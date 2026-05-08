import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class InternalServerErrorException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '500 Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      exception,
      code: code || EExceptionCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
