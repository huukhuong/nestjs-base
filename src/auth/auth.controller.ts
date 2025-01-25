import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-req.dto';
import { BaseResponse } from 'src/common/base-response';
import { Public } from 'src/common/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() body: LoginRequestDto) {
    const response = await this.authService.login(body.username, body.password);
    return BaseResponse.success(response, 'Đăng nhập thành công');
  }

  @Post('register')
  @Public()
  async register() {
    return BaseResponse.success(null, 'Đăng ký thành công');
  }
}
