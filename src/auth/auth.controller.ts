import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Public, User } from 'src/common/decorators';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshToken(payload);
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Send OTP for forgot password' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    await this.authService.forgotPassword(payload);
    return {
      message: 'OTP has been sent to your email',
    };
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password using verified reset token' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() payload: ResetPasswordDto) {
    await this.authService.resetPassword(payload);
    return {
      message: 'Password reset successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async me(@User() user: UserEntity) {
    return this.authService.me(user.id);
  }
}
