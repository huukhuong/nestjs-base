import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from 'src/common/exceptions';
import { ERoles } from 'src/common/enum';
import {
  PERMISSIONS_KEY,
  ROLES_KEY,
  IS_PUBLIC_KEY,
} from 'src/common/decorators';
import { Request } from 'express';
import { RbacService } from './rbac.service';

type RequestWithUser = Request & { user?: { id: string } };

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = req.user?.id;
    if (!userId) {
      // JwtAuthGuard should have populated req.user already
      throw new ForbiddenException({ message: 'Access denied' });
    }

    const roleCodes = await this.rbacService.getUserRoleCodes(userId);

    // SUPER_ADMIN is a system-level bypass role.
    if (roleCodes.includes(ERoles.SUPER_ADMIN)) {
      return true;
    }

    if (requiredRoles.length > 0) {
      const hasAnyRole = requiredRoles.some(r => roleCodes.includes(r));
      if (!hasAnyRole) {
        throw new ForbiddenException({ message: 'Missing required role' });
      }
    }

    if (requiredPermissions.length > 0) {
      const permissionCodes =
        await this.rbacService.getUserPermissionCodes(userId);
      const missing = requiredPermissions.filter(
        p => !permissionCodes.includes(p),
      );
      if (missing.length > 0) {
        throw new ForbiddenException({
          message: 'Missing required permission',
        });
      }
    }

    return true;
  }
}
