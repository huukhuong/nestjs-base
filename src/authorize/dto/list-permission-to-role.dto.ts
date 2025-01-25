import { ApiProperty } from '@nestjs/swagger';

export class ListPermissionToRole {
  @ApiProperty()
  roleId: string;

  @ApiProperty()
  listPermission: string[];
}
