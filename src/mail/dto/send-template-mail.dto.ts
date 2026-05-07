import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SendTemplateMailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  to: string;

  @ApiProperty({ example: 'welcome' })
  @IsString()
  @MinLength(1)
  templateName: string;

  @ApiPropertyOptional({ example: 'Welcome to the app' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    example: { fullName: 'John Doe', appName: 'NestJS Base' },
    type: 'object',
    additionalProperties: true,
  })
  @IsObject()
  variables: Record<string, unknown>;
}
