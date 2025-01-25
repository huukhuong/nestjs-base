import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import BaseException from 'src/common/base-exception';
import { SendOtpMaiReqDto } from './dto/send-otp-mail-req.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpMail(body: SendOtpMaiReqDto) {
    try {
      const otp = this.generateOTP();
      await this.mailerService.sendMail({
        to: body.email,
        subject: 'OTP Verification',
        template: './otp',
        context: {
          otp,
        },
      });
    } catch (error) {
      throw new BaseException(error);
    }
  }

  generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }
}
