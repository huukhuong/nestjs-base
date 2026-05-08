import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from 'src/common/exceptions';
import {
  MAIL_QUEUE_NAME,
  MAIL_SEND_TEMPLATE_JOB_NAME,
  resolveMailSubject,
} from './constants/mail.constant';
import { SendTemplateMailDto } from './dto/send-template-mail.dto';
import { MailLogEntity, MailType } from './entities/mail-log.entity';
import { MailTemplateService } from './mail-template.service';
import { SendTemplateMailJobData } from './types/send-template-mail-job-data.type';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(MAIL_QUEUE_NAME)
    private readonly mailQueue: Queue<SendTemplateMailJobData>,
    @InjectRepository(MailLogEntity)
    private readonly mailLogRepository: Repository<MailLogEntity>,
    private readonly mailTemplateService: MailTemplateService,
  ) {}

  async sendTemplateMail(payload: SendTemplateMailDto) {
    this.mailTemplateService.assertTemplateExists(payload.templateName);

    const mailLog = await this.mailLogRepository.save(
      this.mailLogRepository.create({
        recipient: payload.to,
        subject: resolveMailSubject(payload.templateName, payload.subject),
        type: MailType.TEMPLATE,
        body: payload.templateName,
        context: payload.variables,
        sentAt: null,
      }),
    );

    const job = await this.enqueueTemplateMailJob({
      to: payload.to,
      templateName: payload.templateName,
      subject: payload.subject,
      variables: payload.variables,
      mailLogId: mailLog.id,
    });

    return {
      mailLogId: mailLog.id,
      jobId: job.id,
      status: 'queued',
    };
  }

  async resendMailById(mailLogId: string) {
    const mailLog = await this.mailLogRepository.findOne({
      where: {
        id: mailLogId,
      },
    });

    if (!mailLog) {
      throw new NotFoundException({
        message: 'Mail log not found',
      });
    }

    if (mailLog.type !== MailType.TEMPLATE) {
      throw new BadRequestException({
        message: 'Only template mail logs can be resent',
      });
    }

    this.mailTemplateService.assertTemplateExists(mailLog.body);

    const job = await this.enqueueTemplateMailJob({
      to: mailLog.recipient,
      templateName: mailLog.body,
      subject: mailLog.subject,
      variables: mailLog.context || {},
      mailLogId: mailLog.id,
    });

    return {
      mailLogId: mailLog.id,
      jobId: job.id,
      status: 'queued',
    };
  }

  private async enqueueTemplateMailJob(jobData: SendTemplateMailJobData) {
    return this.mailQueue.add(MAIL_SEND_TEMPLATE_JOB_NAME, jobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: 500,
      removeOnFail: 1000,
    });
  }
}
