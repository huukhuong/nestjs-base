import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorators/uuid-param.decorator';
import { MAIL_TEMPLATE_SUBJECTS } from './constants/mail.constant';
import { SendTemplateMailDto } from './dto/send-template-mail.dto';
import { MailService } from './mail.service';
import { Public } from 'src/common/decorators';

@ApiTags('Mail')
@Controller('mail')
@ApiBearerAuth()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-template')
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  @ApiOperation({
    summary: 'Queue template email for delivery',
    description: [
      'Use `templateName` from `MailTemplateName` enum.',
      'If `subject` is omitted, system fallback subject is used by template:',
      ...Object.entries(MAIL_TEMPLATE_SUBJECTS).map(
        ([templateName, subject]) => `- ${templateName}: ${subject}`,
      ),
    ].join('\n'),
  })
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
