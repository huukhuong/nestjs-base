import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Can be email or username',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  account: string;
}
