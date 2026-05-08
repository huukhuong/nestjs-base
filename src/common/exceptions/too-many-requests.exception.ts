import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class TooManyRequestsException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '429 Too Many Requests',
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      exception,
      code: code || EExceptionCodes.TOO_MANY_REQUESTS,
    });
  }
}
