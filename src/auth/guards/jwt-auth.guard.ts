import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from 'src/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EExceptionCodes } from 'src/common/enum/exception-codes.enum';
import { UserStatus } from 'src/user/entities/user-status.enum';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators';

export type JwtPayload = {
  sub: string;
  email: string | null;
};

const PUBLIC_PATH_PREFIXES = [
  '/nestlens',
  '/__nestlens__',
  '/swagger',
  '/health',
];

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    if (this.isPublicPath(request.path)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Missing access token',
        code: EExceptionCodes.UNAUTHORIZED,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          code: EExceptionCodes.UNAUTHORIZED,
        });
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new UnauthorizedException({
          message: 'User is blocked',
          code: EExceptionCodes.USER_BLOCKED,
        });
      }

      request['user'] = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException({
        message: 'Invalid or expired token',
        code: EExceptionCodes.UNAUTHORIZED,
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPublicPath(pathname: string): boolean {
    return PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix));
  }
}
