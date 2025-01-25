import { ApiProperty } from '@nestjs/swagger';
import { PaggingRequestDto } from 'src/common/pagging-req.dto';

export class SearchPermissionGroupDto extends PaggingRequestDto {
  @ApiProperty()
  name?: string;
}
