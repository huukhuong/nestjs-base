import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'database/data-source';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { LocationModule } from './location/location.module';
import { AuthorizeModule } from './authorize/authorize.module';
import { RoleGuard } from './authorize/guards/role.guard';
import { PermissionGuard } from './authorize/guards/permission.guard';
import { User } from './user/user.entity';
import { Role } from './authorize/entities/role.entity';
import { Permission } from './authorize/entities/permission.entity';
import { PermissionGroup } from './authorize/entities/permission-group.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOption),
    TypeOrmModule.forFeature([User, Role, Permission, PermissionGroup]),
    MailModule,
    UserModule,
    AuthModule,
    LocationModule,
    AuthorizeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
