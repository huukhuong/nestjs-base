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
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { RbacService } from './rbac.service';

@ApiTags('Permission')
@ApiBearerAuth()
@Roles(ERoles.SUPER_ADMIN)
@Controller('rbac/permissions')
export class PermissionController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  @ApiOperation({ summary: 'List permissions' })
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

  @Get(':permissionId')
  @ApiOperation({ summary: 'Get permission by id' })
  getPermission(@UUIDParam('permissionId') permissionId: string) {
    return this.rbacService.findPermissionById(permissionId);
  }

  @Put(':permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update permission' })
  @ApiBody({ type: UpdatePermissionDto })
  updatePermission(
    @UUIDParam('permissionId') permissionId: string,
    @Body() payload: UpdatePermissionDto,
  ) {
    return this.rbacService.updatePermission(permissionId, payload);
  }

  @Delete(':permissionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete permission' })
  async deletePermission(@UUIDParam('permissionId') permissionId: string) {
    await this.rbacService.deletePermission(permissionId);
    return { message: 'Permission deleted' };
  }
}
