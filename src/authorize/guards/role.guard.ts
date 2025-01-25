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
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride<string[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userFound = await this.userRepository.findOne({
      where: { id: user?.id },
      relations: ['roles', 'roles.permissions'],
    });

    const roleCodes = userFound?.roles.map((e) => e.code);

    if (roleCodes?.find((e) => e === 'SYSADMIN')) {
      return true;
    }

    if (roleCodes?.some((e) => requiredRoles.includes(e))) {
      return true;
    }

    throw new BaseException(
      'Bạn không có quyền thực hiện thao tác này',
      HttpStatus.FORBIDDEN,
    );
  }
}
