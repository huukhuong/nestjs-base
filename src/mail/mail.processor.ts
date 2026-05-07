import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MAIL_QUEUE_NAME,
  MAIL_SEND_TEMPLATE_JOB_NAME,
  resolveMailSubject,
} from './constants/mail.constant';
import { MailLog } from './entities/mail-log.entity';
import { MailTemplateService } from './mail-template.service';
import { MailTransportService } from './mail-transport.service';
import { SendTemplateMailJobData } from './types/send-template-mail-job-data.type';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor extends WorkerHost {
  constructor(
    private readonly templateService: MailTemplateService,
    private readonly mailTransportService: MailTransportService,
    @InjectRepository(MailLog)
    private readonly mailLogRepository: Repository<MailLog>,
  ) {
    super();
  }

  async process(job: Job<SendTemplateMailJobData>): Promise<void> {
    if (job.name !== MAIL_SEND_TEMPLATE_JOB_NAME) {
      return;
    }

    if (!process.env.MAIL_HOST || !process.env.MAIL_FROM) {
      throw new Error('MAIL_HOST and MAIL_FROM are required for sending mail');
    }

    const html = this.templateService.renderTemplate(
      job.data.templateName,
      job.data.variables,
    );

    await this.mailTransportService.sendMail({
      from: process.env.MAIL_FROM,
      to: job.data.to,
      subject: resolveMailSubject(job.data.templateName, job.data.subject),
      html,
    });

    await this.mailLogRepository.update(job.data.mailLogId, {
      sentAt: new Date(),
    });
  }
}
