import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class ForbiddenException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '403 Forbidden',
      statusCode: HttpStatus.FORBIDDEN,
      exception,
      code: code || EExceptionCodes.FORBIDDEN,
    });
  }
}
