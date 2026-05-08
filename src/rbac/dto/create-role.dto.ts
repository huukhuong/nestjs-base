import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code: string;

  @ApiProperty({ example: 'Administrator' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;
}
