import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(port);

  Logger.verbose('============================================');
  Logger.verbose(`Server is running on port ${port}`);
  Logger.verbose(`CORS Origin: ${JSON.stringify(corsOrigin)}`);
  Logger.verbose(`Swagger URL: http://localhost:${port}/swagger`);
  Logger.verbose('============================================');
};

bootstrap().catch(() => Logger.error("Can't bootstrap the application"));
