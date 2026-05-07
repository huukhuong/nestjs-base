import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from 'src/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EExceptionCodes } from 'src/common/enum/exception-codes.enum';
import { UserStatus } from 'src/user/entities/user-status.enum';
import { UserService } from 'src/user/user.service';

export type JwtPayload = {
  sub: string;
  email: string | null;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
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
    } catch {
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
}
