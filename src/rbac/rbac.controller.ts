import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, UUIDParam } from 'src/common/decorators';
import { ERoles } from 'src/common/enum';
import {
  AssignManyPermissionsToRoleDto,
  AssignManyPermissionsToUserDto,
  AssignManyRolesToUserDto,
  CreatePermissionDto,
  CreateRoleDto,
} from './dto';
import { RbacService } from './rbac.service';

@ApiTags('RBAC')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List all roles' })
  findRoles() {
    return this.rbacService.findAllRoles();
  }

  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create role' })
  @ApiBody({ type: CreateRoleDto })
  createRole(@Body() payload: CreateRoleDto) {
    return this.rbacService.createRole(payload.code, payload.name);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'List all permissions' })
  findPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create permission' })
  @ApiBody({ type: CreatePermissionDto })
  createPermission(@Body() payload: CreatePermissionDto) {
    return this.rbacService.createPermission(payload.code, payload.name);
  }

  @Post('users/:userId/roles/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRoleToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    await this.rbacService.assignRoleToUser(userId, roleId);
    return { message: 'Role assigned to user' };
  }

  @Post('users/:userId/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign many roles to user' })
  @ApiBody({ type: AssignManyRolesToUserDto })
  async assignManyRolesToUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyRolesToUserDto,
  ) {
    await this.rbacService.assignManyRolesToUser(userId, payload.roleIds);
    return { message: 'Roles assigned to user' };
  }

  @Post('roles/:roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission to role' })
  async assignPermissionToRole(
    @UUIDParam('roleId') roleId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.assignPermissionToRole(roleId, permissionId);
    return { message: 'Permission assigned to role' };
  }

  @Post('roles/:roleId/permissions')
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

  @Post('users/:userId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission directly to user' })
  async assignPermissionToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.assignPermissionToUser(userId, permissionId);
    return { message: 'Permission assigned to user' };
  }

  @Post('users/:userId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign many permissions directly to user' })
  @ApiBody({ type: AssignManyPermissionsToUserDto })
  async assignManyPermissionsToUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyPermissionsToUserDto,
  ) {
    await this.rbacService.assignManyPermissionsToUser(
      userId,
      payload.permissionIds,
    );
    return { message: 'Permissions assigned to user' };
  }

  @Get('users/:userId/roles')
  @ApiOperation({ summary: 'Get role codes by user id' })
  getUserRoles(@UUIDParam('userId') userId: string) {
    return this.rbacService.getUserRoleCodes(userId);
  }

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get effective permission codes by user id' })
  getUserPermissions(@UUIDParam('userId') userId: string) {
    return this.rbacService.getUserPermissionCodes(userId);
  }
}
