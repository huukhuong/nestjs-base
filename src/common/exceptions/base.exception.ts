import { HttpException, HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';

export interface IBaseException {
  code?: EExceptionCodes;
  message?: string | Record<string, string[]>;
  statusCode?: HttpStatus;
  exception?: HttpException | Error;
  devMessage?: string | null;
}

export class BaseException extends HttpException {
  constructor({
    message,
    statusCode,
    exception,
    code,
    devMessage,
  }: IBaseException = {}) {
    super(
      {
        statusCode,
        code,
        success: false,
        data: null,
        message,
        devMessage:
          devMessage || exception instanceof Error
            ? exception?.stack
            : exception || null,
      },
      statusCode || 500,
    );
  }
}
