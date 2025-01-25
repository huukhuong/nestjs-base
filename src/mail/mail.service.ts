import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/common/exceptions/base-exception';
import { Repository } from 'typeorm';
import { SendOtpMaiReqDto } from './dto/send-otp-mail-req.dto';
import { Mail } from './mail.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(Mail) private readonly mailRepository: Repository<Mail>,
  ) {}

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
      const mail = this.mailRepository.create({
        recipient: body.email,
        subject: 'OTP Verification',
        content: `OTP: ${otp}`,
      });
      await this.mailRepository.save(mail);
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
