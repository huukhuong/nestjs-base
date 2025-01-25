import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base-exception';

export class NotFoundException extends BaseException {
  constructor(message = 'Not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
