import { Global, Module } from '@nestjs/common';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NESTLENS_MAILER_SERVICE, NESTLENS_REDIS_CLIENT } from 'nestlens';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MAIL_QUEUE_NAME } from './constants/mail.constant';
import { MailProcessor } from './mail.processor';
import { MailTemplateService } from './mail-template.service';
import { MailTransportService } from './mail-transport.service';
import { MailLog } from './entities/mail-log.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([MailLog]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE_NAME,
    }),
  ],
  controllers: [MailController],
  providers: [
    MailService,
    MailProcessor,
    MailTemplateService,
    MailTransportService,
    { provide: NESTLENS_MAILER_SERVICE, useExisting: MailTransportService },
    {
      provide: NESTLENS_REDIS_CLIENT,
      useFactory: async (queue: { client?: Promise<object> | object }) => {
        const client = queue?.client;
        if (client == null) {
          return null;
        }

        return typeof (client as Promise<object>).then === 'function'
          ? await (client as Promise<object>)
          : client;
      },
      inject: [getQueueToken(MAIL_QUEUE_NAME)],
    },
  ],
  exports: [MailService, NESTLENS_MAILER_SERVICE, NESTLENS_REDIS_CLIENT],
})
export class MailModule {}
