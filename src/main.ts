import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log('============================================');
  Logger.log(`Server is running on port ${port}`);
  Logger.log('============================================');
};

bootstrap().catch(() => Logger.error("Can't bootstrap the application"));
