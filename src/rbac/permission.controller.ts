import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, UUIDParam } from 'src/common/decorators';
import { ERoles } from 'src/common/enum';
import { CreatePermissionDto } from './dto';
import { RbacService } from './rbac.service';

@ApiTags('Permission')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac/permissions')
export class PermissionController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  findPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create permission' })
  @ApiBody({ type: CreatePermissionDto })
  createPermission(@Body() payload: CreatePermissionDto) {
    return this.rbacService.createPermission(payload.code, payload.name);
  }

  @Patch(':permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update permission' })
  updatePermission(
    @UUIDParam('permissionId') permissionId: string,
    @Body() payload: { code?: string; name?: string },
  ) {
    return this.rbacService.updatePermission(permissionId, payload);
  }
}
