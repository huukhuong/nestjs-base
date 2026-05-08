import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class AssignManyPermissionsToRoleDto {
  @ApiProperty({
    type: [String],
    example: [
      'f44fdbf3-bab4-466e-a6c5-7f63622be034',
      '0fba2ce0-3ec5-495e-a4f8-dd4187c9a38c',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
