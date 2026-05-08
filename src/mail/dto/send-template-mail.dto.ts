import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { EMailTemplateName } from '../constants/mail.constant';

export class SendTemplateMailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  to: string;

  @ApiProperty({
    enum: Object.values(EMailTemplateName),
    enumName: 'MailTemplateName',
    example: EMailTemplateName.WELCOME,
    description: 'Template key. See enum options for supported templates.',
  })
  @IsIn(Object.values(EMailTemplateName))
  templateName: EMailTemplateName;

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
