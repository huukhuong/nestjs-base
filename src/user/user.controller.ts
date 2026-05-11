import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ERoles } from 'src/common/enum';
import {
  ApiPaginationQuery,
  PaginationQueryParam,
  Roles,
  UUIDParam,
} from 'src/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import type { PaginationQuery } from 'src/common/pagination';
import { RbacService } from 'src/rbac';
import { SyncPermissionIdsDto, SyncRoleIdsDto } from 'src/rbac/dto';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => RbacService))
    private readonly rbacService: RbacService,
  ) {}

  @Get()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  @ApiOperation({ summary: 'Get users with pagination' })
  @ApiPaginationQuery
  async findAll(@PaginationQueryParam() query: PaginationQuery) {
    return this.userService.findAll(query);
  }

  @Post()
  @Roles(ERoles.SUPER_ADMIN, ERoles.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Post(':id/sync-roles')
  @Roles(ERoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync roles for user',
    description:
      'Replaces user_roles with the given role ID list (empty removes all roles for this user). Response `data` is the user; each `roles[]` entry includes that role’s `permissions`; top-level `permissions` is effective.',
  })
  @ApiBody({ type: SyncRoleIdsDto })
  syncRolesForUser(
    @UUIDParam('id') id: string,
    @Body() payload: SyncRoleIdsDto,
  ) {
    return this.rbacService.syncRolesForUser(id, payload.roleIds);
  }

  @Post(':id/sync-permissions')
  @Roles(ERoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sync direct permissions for user',
    description:
      'Replaces user_permissions with the given permission ID list (empty removes all direct grants). Same response shape as GET user RBAC (per-role + effective `permissions`).',
  })
  @ApiBody({ type: SyncPermissionIdsDto })
  syncPermissionsForUser(
    @UUIDParam('id') id: string,
    @Body() payload: SyncPermissionIdsDto,
  ) {
    return this.rbacService.syncPermissionsForUser(id, payload.permissionIds);
  }

  @Get(':id')
  @Roles(ERoles.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Get user detail',
    description:
      'Same as GET /auth/me: user + per-role `permissions` + top-level effective `permissions`.',
  })
  getUserRbacDetail(@UUIDParam('id') id: string) {
    return this.rbacService.getUserRbacDetail(id);
  }
}
