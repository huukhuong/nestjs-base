import { ApiProperty } from '@nestjs/swagger';
import { ENV } from 'src/config/env';

export class CreatePermissionDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({
    default: ENV.UUID_EXAMPLE,
  })
  groupId: string;
}
