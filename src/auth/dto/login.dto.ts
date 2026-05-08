import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Can be email or username',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  account: string;

  @ApiProperty({ example: 'StrongPass123', minLength: 8, maxLength: 60 })
  @IsString()
  @Length(8, 60)
  password: string;
}
