import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SyncPermissionIdsDto {
  @ApiProperty({
    type: [String],
    description:
      'Full list of permission IDs (empty clears all direct / role links depending on endpoint).',
    example: [],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}
