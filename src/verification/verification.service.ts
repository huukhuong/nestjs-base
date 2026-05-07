import { Injectable } from '@nestjs/common';
import {
  createHash,
  randomInt,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { BadRequestException } from 'src/common/exceptions';
import { RedisService } from 'src/redis';
import {
  VerificationOtpPayload,
  VerificationResetTokenPayload,
  VerificationType,
} from './verification.types';

@Injectable()
export class VerificationService {
  private readonly otpTtlSeconds = 10 * 60;
  private readonly resetTokenTtlSeconds = 15 * 60;

  constructor(private readonly redisService: RedisService) {}

  async createOtp(type: VerificationType, userId: string, email: string) {
    const otp = this.generateOtp();
    const otpPayload: VerificationOtpPayload = {
      userId,
      email: email.toLowerCase(),
      otpHash: this.hashValue(otp),
    };

    await this.redisService.set(
      this.getOtpKey(type, email),
      JSON.stringify(otpPayload),
      this.otpTtlSeconds,
    );

    return {
      otp,
      expiresIn: this.otpTtlSeconds,
    };
  }

  async verifyOtpAndCreateResetToken(
    type: VerificationType,
    email: string,
    otp: string,
  ) {
    const otpKey = this.getOtpKey(type, email);
    const raw = await this.redisService.get(otpKey);
    if (!raw) {
      throw new BadRequestException({
        message: 'OTP is invalid or expired',
      });
    }

    const payload = JSON.parse(raw) as VerificationOtpPayload;
    const isValid = this.compareHashed(payload.otpHash, this.hashValue(otp));
    if (!isValid) {
      throw new BadRequestException({
        message: 'OTP is invalid or expired',
      });
    }

    const resetToken = this.generateResetToken();
    const resetTokenPayload: VerificationResetTokenPayload = {
      userId: payload.userId,
      email: payload.email,
      type,
    };

    await this.redisService.set(
      this.getResetTokenKey(resetToken),
      JSON.stringify(resetTokenPayload),
      this.resetTokenTtlSeconds,
    );
    await this.redisService.del(otpKey);

    return {
      resetToken,
      expiresIn: this.resetTokenTtlSeconds,
    };
  }

  async consumeResetToken(resetToken: string, type: VerificationType) {
    const key = this.getResetTokenKey(resetToken);
    const raw = await this.redisService.get(key);
    if (!raw) {
      throw new BadRequestException({
        message: 'Reset token is invalid or expired',
      });
    }

    const payload = JSON.parse(raw) as VerificationResetTokenPayload;
    if (payload.type !== type) {
      throw new BadRequestException({
        message: 'Reset token is invalid',
      });
    }

    await this.redisService.del(key);
    return payload;
  }

  private getOtpKey(type: VerificationType, email: string) {
    return `verification:otp:${type}:${email.toLowerCase()}`;
  }

  private getResetTokenKey(resetToken: string) {
    return `verification:reset-token:${resetToken}`;
  }

  private generateOtp(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('base64url');
  }

  private hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private compareHashed(a: string, b: string) {
    const aBuffer = Buffer.from(a, 'utf8');
    const bBuffer = Buffer.from(b, 'utf8');
    if (aBuffer.length !== bBuffer.length) {
      return false;
    }
    return timingSafeEqual(aBuffer, bBuffer);
  }
}
