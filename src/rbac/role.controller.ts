import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, UUIDParam } from 'src/common/decorators';
import { ERoles } from 'src/common/enum';
import { CreateRoleDto, SyncPermissionIdsDto, UpdateRoleDto } from './dto';
import { RbacService } from './rbac.service';

@ApiTags('Role')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac/roles')
export class RoleController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  @ApiOperation({ summary: 'List roles' })
  findRoles() {
    return this.rbacService.findAllRoles();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create role' })
  @ApiBody({ type: CreateRoleDto })
  createRole(@Body() payload: CreateRoleDto) {
    return this.rbacService.createRole(payload.code, payload.name);
  }

  @Post(':roleId/permissions/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync permissions on role',
    description:
      'Replaces role_permissions with the given permission ID list (empty removes all). Response `data` is the role with `permissions` array.',
  })
  @ApiBody({ type: SyncPermissionIdsDto })
  syncPermissionsForRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: SyncPermissionIdsDto,
  ) {
    return this.rbacService.syncPermissionsForRole(
      roleId,
      payload.permissionIds,
    );
  }

  @Get(':roleId')
  @ApiOperation({
    summary: 'Get role detail',
    description:
      'Response `data` is the role entity plus `permissions` (via role_permissions).',
  })
  getRoleDetail(@UUIDParam('roleId') roleId: string) {
    return this.rbacService.getRoleDetail(roleId);
  }

  @Put(':roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  @ApiBody({ type: UpdateRoleDto })
  updateRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: UpdateRoleDto,
  ) {
    return this.rbacService.updateRole(roleId, payload);
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete role' })
  async deleteRole(@UUIDParam('roleId') roleId: string) {
    await this.rbacService.deleteRole(roleId);
    return { message: 'Role deleted' };
  }
}
