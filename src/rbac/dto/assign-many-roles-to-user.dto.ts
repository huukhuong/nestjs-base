import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class AssignManyRolesToUserDto {
  @ApiProperty({
    type: [String],
    example: [
      '7e8dc220-1676-4fbe-838d-fd1d4fe8ad74',
      'a9ef8b0a-b964-46f1-95fd-4d71890df034',
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  roleIds: string[];
}
