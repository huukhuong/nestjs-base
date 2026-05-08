import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserPermissionEntity,
  UserRoleEntity,
} from './entities';
import { RbacService } from './rbac.service';
import { RbacGuard } from './rbac.guard';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';
import { UserAccessController } from './user-access.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      UserRoleEntity,
      RolePermissionEntity,
      UserPermissionEntity,
    ]),
  ],
  controllers: [RoleController, PermissionController, UserAccessController],
  providers: [RbacService, RbacGuard],
  exports: [RbacService, RbacGuard],
})
export class RbacModule {}
