import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, UUIDParam } from 'src/common/decorators';
import { ERoles } from 'src/common/enum';
import { AssignManyPermissionsToRoleDto, CreateRoleDto } from './dto';
import { RbacService } from './rbac.service';

@ApiTags('Role')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac/roles')
export class RoleController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  @ApiOperation({ summary: 'List all roles' })
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

  @Patch(':roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update role' })
  updateRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: { code?: string; name?: string },
  ) {
    return this.rbacService.updateRole(roleId, payload);
  }

  @Post(':roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission to role' })
  async assignPermissionToRole(
    @UUIDParam('roleId') roleId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.assignPermissionToRole(roleId, permissionId);
    return { message: 'Permission assigned to role' };
  }

  @Delete(':roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke permission from role' })
  async revokePermissionFromRole(
    @UUIDParam('roleId') roleId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.revokePermissionFromRole(roleId, permissionId);
    return { message: 'Permission revoked from role' };
  }

  @Post(':roleId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign many permissions to role' })
  @ApiBody({ type: AssignManyPermissionsToRoleDto })
  async assignManyPermissionsToRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: AssignManyPermissionsToRoleDto,
  ) {
    await this.rbacService.assignManyPermissionsToRole(
      roleId,
      payload.permissionIds,
    );
    return { message: 'Permissions assigned to role' };
  }

  @Delete(':roleId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke many permissions from role' })
  @ApiBody({ type: AssignManyPermissionsToRoleDto })
  async revokeManyPermissionsFromRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: AssignManyPermissionsToRoleDto,
  ) {
    await this.rbacService.revokeManyPermissionsFromRole(
      roleId,
      payload.permissionIds,
    );
    return { message: 'Permissions revoked from role' };
  }

  @Put(':roleId/permissions/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync permissions for role' })
  @ApiBody({ type: AssignManyPermissionsToRoleDto })
  async syncPermissionsForRole(
    @UUIDParam('roleId') roleId: string,
    @Body() payload: AssignManyPermissionsToRoleDto,
  ) {
    await this.rbacService.syncPermissionsForRole(
      roleId,
      payload.permissionIds,
    );
    return { message: 'Role permissions synced' };
  }
}
