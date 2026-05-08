import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to store required roles for a route or controller.
 * @type {string}
 */
export const ROLES_KEY: string = 'roles';

/**
 * Decorator to specify required roles for a route or controller.
 *
 * @param {string[]} roles - Array of roles that are permitted to access the route.
 * @returns {MethodDecorator & ClassDecorator} Decorator function to set the roles metadata.
 */
export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
