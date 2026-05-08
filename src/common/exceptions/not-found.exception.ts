import { BaseException, IBaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';

export class NotFoundException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '404 Not Found',
      statusCode: HttpStatus.NOT_FOUND,
      exception,
      code: code || EExceptionCodes.NOT_FOUND,
    });
  }
}
