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
import {
  AssignManyPermissionsToUserDto,
  AssignManyRolesToUserDto,
} from './dto';
import { RbacService } from './rbac.service';

@ApiTags('User Access')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac/users')
export class UserAccessController {
  constructor(private readonly rbacService: RbacService) {}

  @Post(':userId/roles/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign role to user' })
  async assignRoleToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    await this.rbacService.assignRoleToUser(userId, roleId);
    return { message: 'Role assigned to user' };
  }

  @Delete(':userId/roles/:roleId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke role from user' })
  async revokeRoleFromUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    await this.rbacService.revokeRoleFromUser(userId, roleId);
    return { message: 'Role revoked from user' };
  }

  @Post(':userId/roles')
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

  @Delete(':userId/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke many roles from user' })
  @ApiBody({ type: AssignManyRolesToUserDto })
  async revokeManyRolesFromUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyRolesToUserDto,
  ) {
    await this.rbacService.revokeManyRolesFromUser(userId, payload.roleIds);
    return { message: 'Roles revoked from user' };
  }

  @Put(':userId/roles/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync roles for user' })
  @ApiBody({ type: AssignManyRolesToUserDto })
  async syncRolesForUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyRolesToUserDto,
  ) {
    await this.rbacService.syncRolesForUser(userId, payload.roleIds);
    return { message: 'User roles synced' };
  }

  @Post(':userId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign permission directly to user' })
  async assignPermissionToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.assignPermissionToUser(userId, permissionId);
    return { message: 'Permission assigned to user' };
  }

  @Delete(':userId/permissions/:permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke permission from user' })
  async revokePermissionFromUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    await this.rbacService.revokePermissionFromUser(userId, permissionId);
    return { message: 'Permission revoked from user' };
  }

  @Post(':userId/permissions')
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

  @Delete(':userId/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke many permissions from user' })
  @ApiBody({ type: AssignManyPermissionsToUserDto })
  async revokeManyPermissionsFromUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyPermissionsToUserDto,
  ) {
    await this.rbacService.revokeManyPermissionsFromUser(
      userId,
      payload.permissionIds,
    );
    return { message: 'Permissions revoked from user' };
  }

  @Put(':userId/permissions/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync permissions for user' })
  @ApiBody({ type: AssignManyPermissionsToUserDto })
  async syncPermissionsForUser(
    @UUIDParam('userId') userId: string,
    @Body() payload: AssignManyPermissionsToUserDto,
  ) {
    await this.rbacService.syncPermissionsForUser(
      userId,
      payload.permissionIds,
    );
    return { message: 'User permissions synced' };
  }

  @Get(':userId/roles')
  @ApiOperation({ summary: 'Get role codes by user id' })
  getUserRoles(@UUIDParam('userId') userId: string) {
    return this.rbacService.getUserRoleCodes(userId);
  }

  @Get(':userId/permissions')
  @ApiOperation({ summary: 'Get effective permission codes by user id' })
  getUserPermissions(@UUIDParam('userId') userId: string) {
    return this.rbacService.getUserPermissionCodes(userId);
  }
}
