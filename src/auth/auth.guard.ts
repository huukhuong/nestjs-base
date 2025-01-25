import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BaseException } from 'src/common/exceptions/base-exception';
import { ENV } from 'src/config/env';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      'noAuth',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new BaseException(
        'Token không tồn tại. Vui lòng đăng nhập để tiếp tục',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: ENV.JWT_SECRET,
      });
      // id, usernamme, email
      request['user'] = payload;
    } catch (e) {
      throw new BaseException(
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập để tiếp tục',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
