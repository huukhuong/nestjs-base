import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ENV } from 'src/config/env';

export class SyncPermissionToRoleDto {
  @ApiProperty({
    default: [ENV.UUID_EXAMPLE],
  })
  @IsUUID('4', { each: true, message: 'Each roleId must be a valid UUIDv4' })
  permissionIds: string[];
}
