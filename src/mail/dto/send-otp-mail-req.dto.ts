import { ApiProperty } from '@nestjs/swagger';

export class SendOtpMaiReqDto {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  email: string;
}
