import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key used to store required permissions for a route or controller.
 * @type {string}
 */
export const PERMISSIONS_KEY: string = 'permissions';

/**
 * Decorator to specify required permissions for a route or controller.
 *
 * @param {string[]} permissions - Array of permissions that are permitted to access the route.
 * @returns {MethodDecorator & ClassDecorator} Decorator function to set the permissions metadata.
 */
export const Permissions = (
  ...permissions: string[]
): MethodDecorator & ClassDecorator =>
  SetMetadata(PERMISSIONS_KEY, permissions);
