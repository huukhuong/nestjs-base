import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'src/common/exceptions';
import { ERoles } from 'src/common/enum';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
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
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createRole(code: string, name: string): Promise<RoleEntity> {
    const normalizedCode = code.trim().toUpperCase() as ERoles;
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
    await this.requireRoleById(roleId);

    const patch: Partial<RoleEntity> = {};

    if (payload.code !== undefined) {
      const normalizedCode = payload.code.trim().toUpperCase() as ERoles;
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

  findAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getRoleDetail(
    roleId: string,
  ): Promise<RoleEntity & { permissions: PermissionEntity[] }> {
    const role = await this.requireRoleById(roleId);
    const links = await this.rolePermissionRepository.find({
      where: { roleId },
      relations: { permission: true },
    });
    const permissions = links
      .map(l => l.permission)
      .filter((p): p is PermissionEntity => p != null)
      .sort((a, b) => a.code.localeCompare(b.code));

    return { ...role, permissions } as RoleEntity & {
      permissions: PermissionEntity[];
    };
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = await this.requireRoleById(roleId);
    if (role.code === ERoles.SUPER_ADMIN) {
      throw new BadRequestException({
        message: 'Cannot delete SUPER_ADMIN role',
      });
    }
    await this.roleRepository.delete({ id: roleId });
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
    await this.findPermissionById(permissionId);

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

  findAllPermissions(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findPermissionById(permissionId: string): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new NotFoundException({ message: 'Permission not found' });
    }
    return permission;
  }

  async deletePermission(permissionId: string): Promise<void> {
    await this.findPermissionById(permissionId);
    await this.permissionRepository.delete({ id: permissionId });
  }

  async getUserRbacDetail(userId: string): Promise<
    Record<string, unknown> & {
      roles: (RoleEntity & { permissions: PermissionEntity[] })[];
      permissions: PermissionEntity[];
    }
  > {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    return this.buildUserRbacDetail(user);
  }

  /**
   * User fields + roles + permissions on one object (same as getUserRbacDetail).
   */
  async buildUserRbacDetail(user: UserEntity): Promise<
    Record<string, unknown> & {
      roles: (RoleEntity & { permissions: PermissionEntity[] })[];
      permissions: PermissionEntity[];
    }
  > {
    const userId = user.id;
    const safeUser = Object.fromEntries(
      Object.entries(user).filter(([key]) => key !== 'password'),
    );

    const roles = await this.roleRepository
      .createQueryBuilder('r')
      .innerJoin(UserRoleEntity, 'ur', 'ur.roleId = r.id')
      .where('ur.userId = :userId', { userId })
      .orderBy('r.code', 'ASC')
      .getMany();

    const rolesWithPermissions = await this.attachPermissionsToRoles(roles);

    const codes = await this.getUserPermissionCodes(userId);
    const permissions =
      codes.length === 0
        ? []
        : await this.permissionRepository.find({
            where: { code: In(codes) },
            order: { code: 'ASC' },
          });

    return {
      ...safeUser,
      roles: rolesWithPermissions,
      permissions,
    };
  }

  /** Each role includes permissions linked via role_permissions (same idea as GET role detail). */
  private async attachPermissionsToRoles(
    roles: RoleEntity[],
  ): Promise<(RoleEntity & { permissions: PermissionEntity[] })[]> {
    if (roles.length === 0) {
      return [];
    }
    const roleIds = roles.map(r => r.id);
    const links = await this.rolePermissionRepository.find({
      where: { roleId: In(roleIds) },
      relations: { permission: true },
    });
    const byRoleId = new Map<string, PermissionEntity[]>();
    for (const link of links) {
      const p = link.permission;
      if (!p) {
        continue;
      }
      const list = byRoleId.get(link.roleId) ?? [];
      list.push(p);
      byRoleId.set(link.roleId, list);
    }
    return roles.map(role => {
      const perms = (byRoleId.get(role.id) ?? []).sort((a, b) =>
        a.code.localeCompare(b.code),
      );
      return { ...role, permissions: perms } as RoleEntity & {
        permissions: PermissionEntity[];
      };
    });
  }

  async syncRolesForUser(
    userId: string,
    roleIds: string[],
  ): Promise<
    Record<string, unknown> & {
      roles: (RoleEntity & { permissions: PermissionEntity[] })[];
      permissions: PermissionEntity[];
    }
  > {
    for (const roleId of roleIds) {
      await this.requireRoleById(roleId);
    }

    const currentRows = await this.userRoleRepository.find({
      where: { userId },
      select: { roleId: true },
    });
    const currentRoleIds = currentRows.map(row => row.roleId);

    const targetRoleIds = Array.from(new Set(roleIds));
    const toAdd = targetRoleIds.filter(id => !currentRoleIds.includes(id));
    const toRemove = currentRoleIds.filter(id => !targetRoleIds.includes(id));

    for (const roleId of toAdd) {
      await this.insertUserRoleIfAbsent(userId, roleId);
    }
    if (toRemove.length > 0) {
      await this.userRoleRepository.delete({
        userId,
        roleId: In(toRemove),
      });
    }

    return this.getUserRbacDetail(userId);
  }

  async syncPermissionsForRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<RoleEntity & { permissions: PermissionEntity[] }> {
    await this.requireRoleById(roleId);
    for (const permissionId of permissionIds) {
      await this.findPermissionById(permissionId);
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

    for (const permissionId of toAdd) {
      await this.insertRolePermissionIfAbsent(roleId, permissionId);
    }
    if (toRemove.length > 0) {
      await this.rolePermissionRepository.delete({
        roleId,
        permissionId: In(toRemove),
      });
    }

    return this.getRoleDetail(roleId);
  }

  async syncPermissionsForUser(
    userId: string,
    permissionIds: string[],
  ): Promise<
    Record<string, unknown> & {
      roles: (RoleEntity & { permissions: PermissionEntity[] })[];
      permissions: PermissionEntity[];
    }
  > {
    for (const permissionId of permissionIds) {
      await this.findPermissionById(permissionId);
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

    for (const permissionId of toAdd) {
      await this.insertUserPermissionIfAbsent(userId, permissionId);
    }
    if (toRemove.length > 0) {
      await this.userPermissionRepository.delete({
        userId,
        permissionId: In(toRemove),
      });
    }

    return this.getUserRbacDetail(userId);
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

  private async requireRoleById(roleId: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({ message: 'Role not found' });
    }
    return role;
  }

  private async insertUserRoleIfAbsent(
    userId: string,
    roleId: string,
  ): Promise<void> {
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

  private async insertRolePermissionIfAbsent(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
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

  private async insertUserPermissionIfAbsent(
    userId: string,
    permissionId: string,
  ): Promise<void> {
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
}
