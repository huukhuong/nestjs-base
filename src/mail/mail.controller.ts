import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { SendTemplateMailDto } from './dto/send-template-mail.dto';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
@ApiBearerAuth()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-template')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Queue template email for delivery' })
  @ApiBody({ type: SendTemplateMailDto })
  async sendTemplateMail(@Body() payload: SendTemplateMailDto) {
    return this.mailService.sendTemplateMail(payload);
  }

  @Post(':mailLogId/resend')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Requeue mail by mail log id' })
  async resendMailById(@UUIDParam('mailLogId') mailLogId: string) {
    return this.mailService.resendMailById(mailLogId);
  }
}
