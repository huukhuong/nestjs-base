import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { swaggerConfig, validationConfig } from './common/configs';

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

  await app.listen(port);

  Logger.verbose('============================================');
  Logger.verbose(`Server is running on port ${port}`);
  Logger.verbose(`CORS Origin: ${JSON.stringify(corsOrigin)}`);
  Logger.verbose(`Swagger URL: ${process.env.HOST}/swagger`);
  Logger.verbose(`Monitoring URL: ${process.env.HOST}/nestlens`);
  Logger.verbose('============================================');
};

bootstrap().catch(() => Logger.error("Can't bootstrap the application"));
