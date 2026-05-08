import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class ConflictException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '409 Conflict',
      statusCode: HttpStatus.CONFLICT,
      exception,
      code: code || EExceptionCodes.CONFLICT,
    });
  }
}
