import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP and get reset token' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() payload: VerifyOtpDto) {
    return this.verificationService.verifyOtpAndCreateResetToken(
      payload.type,
      payload.email,
      payload.otp,
    );
  }
}
