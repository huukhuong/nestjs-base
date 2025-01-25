import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators';

@Controller()
@ApiTags('/')
export class AppController {
  @Get()
  @Public()
  getHello() {
    return {
      message: 'Hello',
    };
  }
}
