import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}
