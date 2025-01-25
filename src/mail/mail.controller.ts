import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/base-response';
import { SendOtpMaiReqDto } from './dto/send-otp-mail-req.dto';
import { MailService } from './mail.service';

@Controller('mail')
@ApiTags('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send an email with OTP template' })
  async sendOtpMail(
    @Body() body: SendOtpMaiReqDto,
  ): Promise<BaseResponse<boolean>> {
    await this.mailService.sendOtpMail(body);
    return BaseResponse.success(true, 'Mail sent successfully');
  }
}
