import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ENV } from 'src/config/env';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: ENV.MAIL_HOST,
        secure: false,
        auth: {
          user: ENV.MAIL_USER,
          pass: ENV.MAIL_PASS,
        },
      },
      defaults: {
        from: `"${ENV.MAIL_FROM}" <${ENV.MAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
