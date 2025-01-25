import { ApiProperty } from '@nestjs/swagger';
import { PaggingRequestDto } from 'src/common/pagging-req.dto';

export class SearchRoleDto extends PaggingRequestDto {
  @ApiProperty()
  code?: string;

  @ApiProperty()
  name?: string;
}
