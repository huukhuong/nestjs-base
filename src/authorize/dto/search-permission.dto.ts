import { ApiProperty } from '@nestjs/swagger';
import { PaggingRequestDto } from 'src/common/dto/pagging-req.dto';
import { ENV } from 'src/config/env';

export class SearchPermissionDto extends PaggingRequestDto {
  @ApiProperty()
  code?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty({
    default: ENV.UUID_EXAMPLE,
  })
  groupId?: string;
}
