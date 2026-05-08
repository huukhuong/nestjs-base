import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: 'USER_READ' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  code?: string;

  @ApiPropertyOptional({ example: 'View user list' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;
}
