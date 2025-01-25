import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorators';
import { CreateRoleDto } from '../dto/create-role.dto';
import { ListPermissionToRole } from '../dto/list-permission-to-role.dto';
import { SearchRoleDto } from '../dto/search-role.dto';
import { SyncPermissionToRoleDto } from '../dto/sync-permission-to-role.dto';
import { SyncRoleToUserDto } from '../dto/sync-role-to-user.dto';
import { RoleService } from '../services/role.service';
import { BaseResponse } from 'src/common/base-response';

@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm role có phân trang',
  })
  async search(@Body() params: SearchRoleDto) {
    const result = await this.roleService.search(params);
    return BaseResponse.paginate(result);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Tạo mới role',
  })
  async create(@Body() params: CreateRoleDto) {
    const result = await this.roleService.create(params);
    return BaseResponse.success(result);
  }

  @Put('/update/:roleId')
  @ApiOperation({
    summary: 'Cập nhật role',
  })
  async update(
    @UUIDParam('roleId') roleId: string,
    @Body() params: CreateRoleDto,
  ) {
    const result = await this.roleService.update(roleId, params);
    return BaseResponse.success(result);
  }

  @Delete('/delete/:roleId')
  @ApiOperation({
    summary: 'Xoá role',
  })
  async delete(@UUIDParam('roleId') roleId: string) {
    const result = await this.roleService.delete(roleId);
    return BaseResponse.success(result);
  }

  @Get('/:roleId')
  @ApiOperation({
    summary: 'Xem chi tiết role',
  })
  async detail(@UUIDParam('roleId') roleId: string) {
    const result = await this.roleService.detail(roleId);
    return BaseResponse.success(result);
  }

  /**
   * =================================================
   * =============== Phân quyền user =================
   * =================================================
   */
  @Put('/sync-roles-to-user/:userId')
  @ApiOperation({
    summary: 'Đồng bộ role cho user',
  })
  async syncRolesToUser(
    @UUIDParam('userId') userId: string,
    @Body() params: SyncRoleToUserDto,
  ) {
    const result = await this.roleService.syncRolesToUser(userId, params);
    return BaseResponse.success(result);
  }

  @Post('/assign-role-to-user/:userId/:roleId')
  @ApiOperation({
    summary: 'Gán role cho user',
  })
  async assignRoleToUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    const result = await this.roleService.assignRoleToUser(userId, roleId);
    return BaseResponse.success(result);
  }

  @Delete('/revoke-role-from-user/:userId/:roleId')
  @ApiOperation({
    summary: 'Xoá role khỏi user',
  })
  async revokeRoleFromUser(
    @UUIDParam('userId') userId: string,
    @UUIDParam('roleId') roleId: string,
  ) {
    const result = await this.roleService.revokeRoleFromUser(userId, roleId);
    return BaseResponse.success(result);
  }
  @Delete('/revoke-all-role-from-user/:userId')
  @ApiOperation({
    summary: 'Xoá toàn bộ role khỏi user',
  })
  async revokeAllRolesFromUser(@UUIDParam('userId') userId: string) {
    const result = await this.roleService.revokeAllRole(userId);
    return BaseResponse.success(result);
  }

  /**
   * =================================================
   * =============== Phân quyền role =================
   * =================================================
   */
  @Put('/sync-permissions-to-role/:roleId')
  @ApiOperation({
    summary: 'Đồng bộ quyền cho role',
  })
  async syncPermissionsToRole(
    @UUIDParam('roleId') roleId: string,
    @Body() params: SyncPermissionToRoleDto,
  ) {
    const result = await this.roleService.syncPermissionsToRole(roleId, params);
    return BaseResponse.success(result);
  }

  @Post('/assign-permission-to-role/:roleId/:permissionId')
  @ApiOperation({
    summary: 'Gán quyền cho role',
  })
  async assignPermissionToRole(
    @UUIDParam('roleId') roleId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    const result = await this.roleService.assignPermissionToRole(
      roleId,
      permissionId,
    );
    return BaseResponse.success(result);
  }

  @Delete('/revoke-permission-from-role/:roleId/:permissionId')
  @ApiOperation({
    summary: 'Xoá quyền khỏi role',
  })
  async revokePermissionFromRole(
    @UUIDParam('roleId') roleId: string,
    @UUIDParam('permissionId') permissionId: string,
  ) {
    const result = await this.roleService.revokePermissionFromRole(
      roleId,
      permissionId,
    );
    return BaseResponse.success(result);
  }

  @Delete('/revoke-all-permission-from-role/:roleId')
  @ApiOperation({
    summary: 'Xoá tất cả quyền của role',
  })
  async revokeAllPermissionFromRole(@UUIDParam('roleId') roleId: string) {
    const result = await this.roleService.revokeAllPermissionFromRole(roleId);
    return BaseResponse.success(result);
  }

  @Get('/get-permissions-of-role/:roleId')
  @ApiOperation({
    summary:
      'Lấy tất cả quyền của role',
  })
  async getPermissionsForRole(@UUIDParam('roleId') roleId: string) {
    const result = await this.roleService.getPermissionsForRole(roleId);
    return BaseResponse.success(result);
  }

  @Post('/add-list-permission-to-role')
  @ApiOperation({
    summary: 'Gán danh sách quyền cho role',
  })
  async addListPermissionToRole(@Body() params: ListPermissionToRole) {
    const result = await this.roleService.listPermissionToRole(params);
    return BaseResponse.success(result);
  }

  @Delete('/revoke-list-permission-to-role')
  @ApiOperation({
    summary: 'Xóa danh sách quyền khỏi role',
  })
  async revokeListPermissionToRole(@Body() params: ListPermissionToRole) {
    const result = await this.roleService.revokelistPermissionToRole(params);
    return BaseResponse.success(result);
  }
}
