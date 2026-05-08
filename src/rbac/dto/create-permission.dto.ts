import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'USER_READ' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  code: string;

  @ApiProperty({ example: 'View user list' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;
}
