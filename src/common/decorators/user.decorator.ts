import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/guards/jwt-auth.guard';

/**
 * Custom parameter decorator to extract the user object from the request.
 *
 * @param {unknown} data - Optional data passed to the decorator (not used).
 * @param {ExecutionContext} ctx - The execution context containing the HTTP request.
 * @returns {any} The user object attached to the request.
 */
export const User = createParamDecorator(
  (_, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['user'] as JwtPayload;
  },
);
