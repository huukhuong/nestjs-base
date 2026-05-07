import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BadRequestException } from '../exceptions';

export const validationConfig = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: errors => {
        const formattedErrors: Record<string, string[]> = {};

        errors.forEach(error => {
          const field = error.property;
          const messages = Object.values(error.constraints || {});
          formattedErrors[field] = messages;
        });

        return new BadRequestException({
          message: formattedErrors,
          code: EExceptionCodes.BAD_REQUEST,
        });
      },
    }),
  );
};
