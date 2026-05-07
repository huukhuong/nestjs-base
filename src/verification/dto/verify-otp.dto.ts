import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { VerificationType } from '../verification.types';

export class VerifyOtpDto {
  @ApiProperty({
    enum: VerificationType,
    example: VerificationType.FORGOT_PASSWORD,
  })
  @IsEnum(VerificationType)
  type: VerificationType;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', minLength: 6, maxLength: 6 })
  @IsString()
  @Length(6, 6)
  otp: string;
}
