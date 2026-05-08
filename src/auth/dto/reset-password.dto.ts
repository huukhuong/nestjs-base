import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '1W8zcX6z6E_UhZq5k_N4fQ0TD_DZP6xotQfL2CC7R7Q',
    description: 'Reset token returned from verify OTP endpoint',
  })
  @IsString()
  @MinLength(1)
  resetToken: string;

  @ApiProperty({ example: 'NewStrongPass123', minLength: 8, maxLength: 60 })
  @IsString()
  @Length(8, 60)
  newPassword: string;
}
