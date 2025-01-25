import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionGroupDto {
  @ApiProperty()
  name: string;
}
