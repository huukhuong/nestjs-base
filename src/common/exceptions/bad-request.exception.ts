import { HttpStatus } from '@nestjs/common';
import { EExceptionCodes } from '../enum/exception-codes.enum';
import { BaseException, IBaseException } from './base.exception';

export class BadRequestException extends BaseException {
  constructor({ message, exception, code }: IBaseException = {}) {
    super({
      message: message || '400 Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
      exception,
      code: code || EExceptionCodes.BAD_REQUEST,
    });
  }
}
