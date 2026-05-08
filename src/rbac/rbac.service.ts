import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from 'src/common/exceptions';
import {
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserPermissionEntity,
  UserRoleEntity,
} from './entities';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    @InjectRepository(UserPermissionEntity)
    private readonly userPermissionRepository: Repository<UserPermissionEntity>,
  ) {}

  async createRole(code: string, name: string): Promise<RoleEntity> {
    const normalizedCode = code.trim().toUpperCase();
    const exists = await this.roleRepository.findOne({
      where: { code: normalizedCode },
    });
    if (exists) {
      throw new ConflictException({ message: 'Role code already exists' });
    }

    return this.roleRepository.save(
      this.roleRepository.create({ code: normalizedCode, name: name.trim() }),
    );
  }

  async updateRole(
    roleId: string,
    payload: { code?: string; name?: string },
  ): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({ message: 'Role not found' });
    }

    const patch: Partial<RoleEntity> = {};

    if (payload.code !== undefined) {
      const normalizedCode = payload.code.trim().toUpperCase();
      const existingRole = await this.roleRepository.findOne({
        where: { code: normalizedCode },
      });
      if (existingRole && existingRole.id !== roleId) {
        throw new ConflictException({ message: 'Role code already exists' });
      }
      patch.code = normalizedCode;
    }

    if (payload.name !== undefined) {
      patch.name = payload.name.trim();
    }

    await this.roleRepository.update(roleId, patch);
    return this.roleRepository.findOneByOrFail({ id: roleId });
  }

  async createPermission(
    code: string,
    name: string,
  ): Promise<PermissionEntity> {
    const normalizedCode = code.trim().toUpperCase();
    const exists = await this.permissionRepository.findOne({
      where: { code: normalizedCode },
    });
    if (exists) {
      throw new ConflictException({
        message: 'Permission code already exists',
      });
    }

    return this.permissionRepository.save(
      this.permissionRepository.create({
        code: normalizedCode,
        name: name.trim(),
      }),
    );
  }

  async updatePermission(
    permissionId: string,
    payload: { code?: string; name?: string },
  ): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException({ message: 'Permission not found' });
    }

    const patch: Partial<PermissionEntity> = {};

    if (payload.code !== undefined) {
      const normalizedCode = payload.code.trim().toUpperCase();
      const existingPermission = await this.permissionRepository.findOne({
        where: { code: normalizedCode },
      });
      if (existingPermission && existingPermission.id !== permissionId) {
        throw new ConflictException({
          message: 'Permission code already exists',
        });
      }
      patch.code = normalizedCode;
    }

    if (payload.name !== undefined) {
      patch.name = payload.name.trim();
    }

    await this.permissionRepository.update(permissionId, patch);
    return this.permissionRepository.findOneByOrFail({ id: permissionId });
  }

  findAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.find({ order: { createdAt: 'DESC' } });
  }

  findAllPermissions(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find({ order: { createdAt: 'DESC' } });
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await this.ensureRoleExists(roleId);
    const exists = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });
    if (exists) {
      return;
    }

    await this.userRoleRepository.save(
      this.userRoleRepository.create({ userId, roleId }),
    );
  }

  async revokeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await this.userRoleRepository.delete({ userId, roleId });
  }

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await Promise.all([
      this.ensureRoleExists(roleId),
      this.ensurePermissionExists(permissionId),
    ]);
    const exists = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });
    if (exists) {
      return;
    }

    await this.rolePermissionRepository.save(
      this.rolePermissionRepository.create({ roleId, permissionId }),
    );
  }

  async revokePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.rolePermissionRepository.delete({ roleId, permissionId });
  }

  async assignPermissionToUser(
    userId: string,
    permissionId: string,
  ): Promise<void> {
    await this.ensurePermissionExists(permissionId);
    const exists = await this.userPermissionRepository.findOne({
      where: { userId, permissionId },
    });
    if (exists) {
      return;
    }

    await this.userPermissionRepository.save(
      this.userPermissionRepository.create({ userId, permissionId }),
    );
  }

  async revokePermissionFromUser(
    userId: string,
    permissionId: string,
  ): Promise<void> {
    await this.userPermissionRepository.delete({ userId, permissionId });
  }

  async assignManyRolesToUser(
    userId: string,
    roleIds: string[],
  ): Promise<void> {
    for (const roleId of roleIds) {
      await this.assignRoleToUser(userId, roleId);
    }
  }

  async revokeManyRolesFromUser(
    userId: string,
    roleIds: string[],
  ): Promise<void> {
    for (const roleId of roleIds) {
      await this.revokeRoleFromUser(userId, roleId);
    }
  }

  async assignManyPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.assignPermissionToRole(roleId, permissionId);
    }
  }

  async revokeManyPermissionsFromRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.revokePermissionFromRole(roleId, permissionId);
    }
  }

  async assignManyPermissionsToUser(
    userId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.assignPermissionToUser(userId, permissionId);
    }
  }

  async revokeManyPermissionsFromUser(
    userId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.revokePermissionFromUser(userId, permissionId);
    }
  }

  async syncRolesForUser(userId: string, roleIds: string[]): Promise<void> {
    for (const roleId of roleIds) {
      await this.ensureRoleExists(roleId);
    }

    const currentRows = await this.userRoleRepository.find({
      where: { userId },
      select: { roleId: true },
    });
    const currentRoleIds = currentRows.map(row => row.roleId);

    const targetRoleIds = Array.from(new Set(roleIds));
    const toAdd = targetRoleIds.filter(id => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter(id => !targetRoleIds.includes(id));

    if (toAdd.length > 0) {
      await this.assignManyRolesToUser(userId, toAdd);
    }
    if (toRemove.length > 0) {
      await this.revokeManyRolesFromUser(userId, toRemove);
    }
  }

  async syncPermissionsForRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await this.ensureRoleExists(roleId);
    for (const permissionId of permissionIds) {
      await this.ensurePermissionExists(permissionId);
    }

    const currentRows = await this.rolePermissionRepository.find({
      where: { roleId },
      select: { permissionId: true },
    });
    const currentPermissionIds = currentRows.map(row => row.permissionId);

    const targetPermissionIds = Array.from(new Set(permissionIds));
    const toAdd = targetPermissionIds.filter(
      id => !currentPermissionIds.includes(id),
    );
    const toRemove = currentPermissionIds.filter(
      id => !targetPermissionIds.includes(id),
    );

    if (toAdd.length > 0) {
      await this.assignManyPermissionsToRole(roleId, toAdd);
    }
    if (toRemove.length > 0) {
      await this.revokeManyPermissionsFromRole(roleId, toRemove);
    }
  }

  async syncPermissionsForUser(
    userId: string,
    permissionIds: string[],
  ): Promise<void> {
    for (const permissionId of permissionIds) {
      await this.ensurePermissionExists(permissionId);
    }

    const currentRows = await this.userPermissionRepository.find({
      where: { userId },
      select: { permissionId: true },
    });
    const currentPermissionIds = currentRows.map(row => row.permissionId);

    const targetPermissionIds = Array.from(new Set(permissionIds));
    const toAdd = targetPermissionIds.filter(
      id => !currentPermissionIds.includes(id),
    );
    const toRemove = currentPermissionIds.filter(
      id => !targetPermissionIds.includes(id),
    );

    if (toAdd.length > 0) {
      await this.assignManyPermissionsToUser(userId, toAdd);
    }
    if (toRemove.length > 0) {
      await this.revokeManyPermissionsFromUser(userId, toRemove);
    }
  }

  async getUserRoleCodes(userId: string): Promise<string[]> {
    const rows = await this.userRoleRepository
      .createQueryBuilder('ur')
      .innerJoin(RoleEntity, 'r', 'r.id = ur.roleId')
      .select('r.code', 'code')
      .where('ur.userId = :userId', { userId })
      .getRawMany<{ code: string }>();

    return rows.map(r => r.code);
  }

  /**
   * Returns ALL permission codes for a user, merged from:
   * - user_permissions
   * - role_permissions via user_roles
   */
  async getUserPermissionCodes(userId: string): Promise<string[]> {
    const [direct, viaRoles] = await Promise.all([
      this.userPermissionRepository
        .createQueryBuilder('up')
        .innerJoin(PermissionEntity, 'p', 'p.id = up.permissionId')
        .select('p.code', 'code')
        .where('up.userId = :userId', { userId })
        .getRawMany<{ code: string }>(),
      this.rolePermissionRepository
        .createQueryBuilder('rp')
        .innerJoin(PermissionEntity, 'p', 'p.id = rp.permissionId')
        .innerJoin(UserRoleEntity, 'ur', 'ur.roleId = rp.roleId')
        .select('p.code', 'code')
        .where('ur.userId = :userId', { userId })
        .getRawMany<{ code: string }>(),
    ]);

    return Array.from(new Set([...direct, ...viaRoles].map(r => r.code)));
  }

  private async ensureRoleExists(roleId: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({ message: 'Role not found' });
    }
  }

  private async ensurePermissionExists(permissionId: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException({ message: 'Permission not found' });
    }
  }
}
