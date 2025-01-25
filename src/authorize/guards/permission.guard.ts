import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/common/exceptions/base-exception';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions: string[] = this.reflector.getAllAndOverride<
      string[]
    >('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userFound = await this.userRepository.findOne({
      where: { id: user?.id },
      relations: ['roles', 'roles.permissions'],
    });

    const permissionsList = userFound?.roles
      .map((role) => role.permissions.map((permission) => permission.code))
      .flat();

    if (permissionsList?.some((e) => requiredPermissions.includes(e))) {
      return true;
    }

    throw new BaseException(
      'Bạn không có quyền thực hiện thao tác này',
      HttpStatus.FORBIDDEN,
    );
  }
}
