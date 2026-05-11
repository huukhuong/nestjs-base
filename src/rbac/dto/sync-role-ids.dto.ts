import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SyncRoleIdsDto {
  @ApiProperty({
    type: [String],
    description:
      'Full list of role IDs for this user (empty clears all roles).',
    example: [],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  roleIds: string[];
}
