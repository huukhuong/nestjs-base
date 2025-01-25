import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroup } from './entities/permission-group.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionGroup, Permission, Role, User]),
  ],
  controllers: [PermissionController, RoleController],
  providers: [PermissionService, RoleService],
})
export class AuthorizeModule {}
