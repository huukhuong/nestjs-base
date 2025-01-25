import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode?: HttpStatus,
    exception?: HttpException,
  ) {
    super(
      {
        statusCode,
        isSuccess: false,
        data: null,
        message,
        devMessage: exception?.stack || null,
      },
      statusCode || 500,
    );
  }
}
