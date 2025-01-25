import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorators';
import { CreatePermissionGroupDto } from '../dto/create-permission-group.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { SearchPermissionGroupDto } from '../dto/search-permission-group.dto';
import { SearchPermissionDto } from '../dto/search-permission.dto';
import { BaseResponse } from 'src/common/base-response';
import { PermissionService } from '../services/permission.service';

@Controller('permission')
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('/search')
  @ApiOperation({
    summary: 'Tìm kiếm quyền có phân trang',
  })
  async search(@Body() params: SearchPermissionDto) {
    const result = await this.permissionService.search(params);
    return BaseResponse.paginate(result);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Tạo mới quyền',
  })
  async create(@Body() params: CreatePermissionDto) {
    const result = await this.permissionService.create(params);
    return BaseResponse.success(result);
  }

  @Put('/update/:permissionId')
  @ApiOperation({
    summary: 'Cập nhật quyền',
  })
  async update(
    @UUIDParam('permissionId') permissionId: string,
    @Body() params: CreatePermissionDto,
  ) {
    const result = await this.permissionService.update(permissionId, params);
    return BaseResponse.success(result);
  }

  @Delete('/delete/:permissionId')
  @ApiOperation({
    summary: 'Xoá quyền',
  })
  async delete(@UUIDParam('permissionId') permissionId: string) {
    const result = await this.permissionService.delete(permissionId);
    return BaseResponse.success(result);
  }

  /**
   * =================================================
   * ================ nhóm chức năng =================
   * =================================================
   */
  @Post('/search-group')
  @ApiOperation({
    summary: 'Tìm kiếm nhóm chức năng có phân trang',
  })
  async searchGroup(@Body() params: SearchPermissionGroupDto) {
    const result = await this.permissionService.searchGroup(params);
    return BaseResponse.paginate(result);
  }

  @Post('/create-group')
  @ApiOperation({
    summary: 'Tạo mới nhóm chức năng',
  })
  async createGroup(@Body() params: CreatePermissionGroupDto) {
    const result = await this.permissionService.createGroup(params);
    return BaseResponse.success(result);
  }

  @Put('/update-group/:groupId')
  @ApiOperation({
    summary: 'Cập nhật nhóm chức năng',
  })
  async updateGroup(
    @UUIDParam('groupId') groupId: string,
    @Body() params: CreatePermissionGroupDto,
  ) {
    const result = await this.permissionService.updateGroup(groupId, params);
    return BaseResponse.success(result);
  }

  @Delete('/delete-group/:groupId')
  @ApiOperation({
    summary: 'Xoá nhóm chức năng',
  })
  async deleteGroup(@UUIDParam('groupId') groupId: string) {
    const result = await this.permissionService.deleteGroup(groupId);
    return BaseResponse.success(result);
  }
}
