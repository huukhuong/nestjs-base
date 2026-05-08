import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { EExceptionCodes } from 'src/common/enum/exception-codes.enum';
import {
  BadRequestException,
  BaseException,
  UnauthorizedException,
} from 'src/common/exceptions';
import { EMailTemplateName } from 'src/mail/constants/mail.constant';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthTokenService } from './auth-token.service';
import { VerificationService } from 'src/verification/verification.service';
import { VerificationType } from 'src/verification/verification.types';
import { RbacService } from 'src/rbac';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authTokenService: AuthTokenService,
    private readonly verificationService: VerificationService,
    private readonly mailService: MailService,
    private readonly rbacService: RbacService,
  ) {}

  async register(payload: RegisterDto) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userService.findByEmail(payload.email),
      payload.username
        ? this.userService.findByUsername(payload.username)
        : Promise.resolve(null),
    ]);

    if (existingEmail) {
      throw new BadRequestException({
        message: 'Email already exists',
        code: EExceptionCodes.BAD_REQUEST,
      });
    }

    if (existingUsername) {
      throw new BadRequestException({
        message: 'Username already exists',
        code: EExceptionCodes.BAD_REQUEST,
      });
    }

    const user = new CreateUserDto();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.username = payload.username;
    user.email = payload.email;
    user.phoneNumber = payload.phoneNumber;
    user.password = await hash(
      payload.password,
      Number(process.env.HASH_ROUNDS || 10),
    );

    try {
      const createdUser = await this.userService.createUser(user);
      const safeUser = Object.fromEntries(
        Object.entries(createdUser).filter(([key]) => key !== 'password'),
      );
      return safeUser;
    } catch (error) {
      throw new BaseException({
        message: 'Failed to create user',
        exception: error as Error,
      });
    }
  }

  async login(payload: LoginDto) {
    const accountValue = payload.account.trim();
    const user = await this.findUserByAccount(accountValue);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: EExceptionCodes.USER_NOT_FOUND,
      });
    }

    const isPasswordValid = await compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid password',
        code: EExceptionCodes.INVALID_PASSWORD,
      });
    }

    return this.generateTokenPair(user.id, user.email);
  }

  async refreshToken(payload: RefreshTokenDto) {
    try {
      const refreshPayload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string | null;
        jti: string;
      }>(payload.refreshToken, {
        secret: String(process.env.JWT_REFRESH_SECRET),
      });

      const user = await this.userService.findById(refreshPayload.sub);
      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          code: EExceptionCodes.USER_NOT_FOUND,
        });
      }

      const activeJti = await this.authTokenService.getActiveRefreshTokenJti(
        user.id,
      );
      if (!activeJti || activeJti !== refreshPayload.jti) {
        throw new UnauthorizedException({
          message: 'Refresh token is revoked',
          code: EExceptionCodes.INVALID_REFRESH_TOKEN,
        });
      }

      return this.generateTokenPair(user.id, user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: EExceptionCodes.INVALID_REFRESH_TOKEN,
      });
    }
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: EExceptionCodes.UNAUTHORIZED,
      });
    }
    const safeUser = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    );
    const [roles, permissions] = await Promise.all([
      this.rbacService.getUserRoleCodes(userId),
      this.rbacService.getUserPermissionCodes(userId),
    ]);

    return {
      ...safeUser,
      roles,
      permissions,
    };
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<boolean> {
    const accountValue = payload.account.trim();
    const user = await this.findUserByAccount(accountValue);

    if (!user || !user.email) {
      return true;
    }

    const { otp, expiresIn } = await this.verificationService.createOtp(
      VerificationType.FORGOT_PASSWORD,
      user.id,
      user.email,
    );

    await this.mailService.sendTemplateMail({
      to: user.email,
      templateName: EMailTemplateName.AUTH_FORGOT_PASSWORD_OTP,
      variables: {
        fullName: user.firstName || user.username || user.email,
        otp,
        expiresInMinutes: Math.floor(expiresIn / 60),
      },
    });

    return true;
  }

  async resetPassword(payload: ResetPasswordDto): Promise<boolean> {
    const resetTokenPayload = await this.verificationService.consumeResetToken(
      payload.resetToken,
      VerificationType.FORGOT_PASSWORD,
    );
    const user = await this.userService.findById(resetTokenPayload.userId);
    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found',
        code: EExceptionCodes.USER_NOT_FOUND,
      });
    }

    const hashedPassword = await hash(
      payload.newPassword,
      Number(process.env.HASH_ROUNDS || 10),
    );
    await this.userService.updatePasswordById(user.id, hashedPassword);
    await this.authTokenService.revokeAllRefreshTokens(user.id);

    if (user.email) {
      await this.mailService.sendTemplateMail({
        to: user.email,
        templateName: EMailTemplateName.AUTH_PASSWORD_RESET_SUCCESS,
        variables: {
          fullName: user.firstName || user.username || user.email,
          changedAt: new Date().toISOString(),
        },
      });
    }

    return true;
  }

  private async generateTokenPair(userId: string, email: string | null) {
    const refreshTokenExpiresIn = Number(process.env.JWT_REFRESH_EXPIRATION);
    const refreshTokenJti = randomUUID();

    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        jti: refreshTokenJti,
      },
      {
        secret: String(process.env.JWT_REFRESH_SECRET),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    await this.authTokenService.setActiveRefreshTokenJti(
      userId,
      refreshTokenJti,
      refreshTokenExpiresIn,
    );

    return {
      accessToken,
      accessTokenExpiredIn: Number(process.env.JWT_EXPIRATION),
      refreshToken,
      refreshTokenExpiredIn: refreshTokenExpiresIn,
    };
  }

  private findUserByAccount(account: string) {
    return account.includes('@')
      ? this.userService.findByEmail(account)
      : this.userService.findByUsername(account);
  }
}
