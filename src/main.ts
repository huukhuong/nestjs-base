import { Logger } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';
import { NestFactory } from '@nestjs/core';
import { Queue } from 'bullmq';
import { JobWatcher } from 'nestlens';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { swaggerConfig, validationConfig } from './common/configs';
import { ResponseInterceptor } from './common/interceptors';
import { MAIL_QUEUE_NAME } from './mail/constants/mail.constant';

const bootstrap = async () => {
  const port = process.env.PORT ?? 3000;

  const corsOrigin = process.env.CORS_ORIGIN?.split(',') || [];

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
      },
    },
  );

  swaggerConfig(app);
  validationConfig(app);
  app.useGlobalInterceptors(new ResponseInterceptor());
  setupNestLensQueueWatcher(app);

  await app.listen(port);

  Logger.verbose('============================================');
  Logger.verbose(`Server is running on port ${port}`);
  Logger.verbose(`CORS Origin: ${JSON.stringify(corsOrigin)}`);
  Logger.verbose(`Swagger URL: ${process.env.HOST}/swagger`);
  Logger.verbose(`Monitoring URL: ${process.env.HOST}/nestlens`);
  Logger.verbose('============================================');
};

const setupNestLensQueueWatcher = (app: NestExpressApplication) => {
  const jobWatcher = app.get(JobWatcher, { strict: false });
  const mailQueue = app.get<Queue>(getQueueToken(MAIL_QUEUE_NAME), {
    strict: false,
  });

  if (!jobWatcher || !mailQueue) {
    return;
  }

  void jobWatcher.setupBullMQQueue(mailQueue, MAIL_QUEUE_NAME);
};

bootstrap().catch(() => Logger.error("Can't bootstrap the application"));
