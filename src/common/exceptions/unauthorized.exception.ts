import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '401 Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
      exception,
      code: code || EExceptionCodes.UNAUTHORIZED,
    });
  }
}
