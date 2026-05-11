import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
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

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      UserRoleEntity,
      RolePermissionEntity,
      UserPermissionEntity,
    ]),
  ],
  controllers: [RoleController, PermissionController],
  providers: [RbacService, RbacGuard],
  exports: [RbacService, RbacGuard],
})
export class RbacModule {}
