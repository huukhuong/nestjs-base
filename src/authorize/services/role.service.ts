import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/common/exceptions/base-exception';
import { ConflictException } from 'src/common/exceptions/conflict-exception';
import { NotFoundException } from 'src/common/exceptions/not-found-exception';
import { paginate } from 'src/common/paginate';
import { User } from 'src/user/user.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { ListPermissionToRole } from '../dto/list-permission-to-role.dto';
import { SearchRoleDto } from '../dto/search-role.dto';
import { SyncPermissionToRoleDto } from '../dto/sync-permission-to-role.dto';
import { SyncRoleToUserDto } from '../dto/sync-role-to-user.dto';
import { PermissionGroup } from '../entities/permission-group.entity';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async search(params: SearchRoleDto) {
    try {
      if (!params.code) {
        params.code = '';
      }

      if (!params.name) {
        params.name = '';
      }

      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.roleRepository,
        withDeleted: params.withDeleted,
        where: [
          { code: ILike(`%${params.code}%`) },
          { name: ILike(`%${params.name}%`) },
        ],
      });
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async create(params: CreateRoleDto) {
    try {
      const checkRole = await this.roleRepository.findOneBy({
        code: params.code,
      });
      if (checkRole) {
        throw new ConflictException('Code quyền đã tồn tại');
      }
      const role = this.roleRepository.create(params);
      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async update(roleId: string, params: CreateRoleDto) {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });

      if (!role) {
        throw new NotFoundException('Không tìm thấy nhóm người dùng');
      }

      role.code = params.code;
      role.name = params.name;

      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async delete(roleId: string) {
    try {
      const role = await this.roleRepository.findOneBy({ id: roleId });

      if (!role) {
        throw new NotFoundException('Không tìm thấy nhóm người dùng');
      }

      const result = await this.roleRepository.softDelete({
        id: roleId,
      });

      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async detail(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (role) {
      return role;
    }

    throw new NotFoundException('Không tìm thấy nhóm người dùng');
  }

  /**
   * =================================================
   * =============== Phân quyền user =================
   * =================================================
   */
  async syncRolesToUser(userId: string, params: SyncRoleToUserDto) {
    try {
      const userFound = await this.userRepository.findOne({
        relations: { roles: true },
        where: { id: userId },
      });

      if (!userFound) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const rolesFound = await this.roleRepository.find({
        where: {
          id: In(params.roleIds),
        },
      });

      if (!rolesFound || rolesFound.length === 0) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }

      if (!userFound.roles) {
        userFound.roles = [...rolesFound];
      } else {
        userFound.roles.push(...rolesFound);
      }
      const result = await this.userRepository.save(userFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const userFound = await this.userRepository.findOne({
      relations: { roles: true },
      where: { id: userId },
    });
    if (!userFound) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const roleFound = await this.roleRepository.findOneBy({
      id: roleId,
    });
    if (!roleFound) {
      throw new NotFoundException('Nhóm người dùng không tồn tại');
    }

    if (!userFound.roles) {
      userFound.roles = [roleFound];
    } else {
      userFound.roles.push(roleFound);
    }

    try {
      const result = await this.userRepository.save(userFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async revokeRoleFromUser(userId: string, roleId: string) {
    try {
      const userFound = await this.userRepository.findOne({
        relations: { roles: true },
        where: { id: userId },
      });

      if (!userFound) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const roleFound = await this.roleRepository.findOneBy({
        id: roleId,
      });

      if (!roleFound) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }

      if (!userFound.roles) {
        userFound.roles = [];
      } else {
        const index = userFound.roles.findIndex((p) => p.id === roleFound.id);
        console.log(index);
        if (index > -1) {
          userFound.roles.splice(index, 1);
        }
      }
      const result = await this.userRepository.save(userFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async revokeAllRole(userId: string) {
    try {
      const userFound = await this.userRepository.findOne({
        relations: { roles: true },
        where: { id: userId },
      });
      if (!userFound) {
        throw new NotFoundException('Người dùng không tồn tại');
      }
      userFound.roles = [];
      const result = await this.userRepository.save(userFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }
  /**
   * =================================================
   * =============== Phân quyền role =================
   * =================================================
   */
  async syncPermissionsToRole(roleId: string, params: SyncPermissionToRoleDto) {
    try {
      const roleFound = await this.roleRepository.findOne({
        where: { id: roleId },
        relations: { permissions: true },
      });

      if (!roleFound) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }

      const permissionsFound = await this.permissionRepository.find({
        where: {
          id: In(params.permissionIds),
        },
      });

      if (!permissionsFound || permissionsFound.length === 0) {
        throw new NotFoundException('Quyền không tồn tại');
      }

      if (!roleFound.permissions?.length) {
        roleFound.permissions = [...permissionsFound];
      } else {
        roleFound.permissions.push(...permissionsFound);
      }
      const result = await this.roleRepository.save(roleFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    try {
      const role = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }
      const permissionFound = await this.permissionRepository.findOneBy({
        id: permissionId,
      });
      if (!permissionFound) {
        throw new NotFoundException('Quyền không tồn tại');
      }
      role.permissions.push(permissionFound);
      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async revokePermissionFromRole(roleId: string, permissionId: string) {
    try {
      const role = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }

      const permissionFound = await this.permissionRepository.findOneBy({
        id: permissionId,
      });
      if (!permissionFound) {
        throw new NotFoundException('Quyền không tồn tại');
      }

      const index = role.permissions.findIndex(
        (p) => p.id === permissionFound.id,
      );
      if (index > -1) {
        console.log('a');
        role.permissions.splice(index, 1);
      }

      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async revokeAllPermissionFromRole(roleId: string) {
    try {
      const roleFound = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: roleId },
      });

      if (!roleFound) {
        throw new BaseException('Role không tồn tại', HttpStatus.NOT_FOUND);
      }

      roleFound.permissions = [];

      const result = await this.roleRepository.save(roleFound);
      return result;
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async getPermissionsForRole(roleId: string) {
    try {
      const role = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: roleId },
      });
      if (!role) {
        throw new NotFoundException('Nhóm người dùng không tồn tại');
      }
      const allPermissionGroups = await this.permissionGroupRepository.find({
        relations: { permissions: true },
      });
      const combinedData = allPermissionGroups.map((group) => {
        group.permissions
          .sort((a, b) => a.code.localeCompare(b.code))
          .forEach((permission) => {
            (permission as any).isChosen = role.permissions.some(
              (rolePermission) => rolePermission.id === permission.id,
            );
          });
        return group;
      });
      return combinedData;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async listPermissionToRole(params: ListPermissionToRole) {
    try {
      let listAddPer: Permission[] = [];

      const role = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: params.roleId },
      });

      if (!role) {
        throw new NotFoundException('Không tìm thấy role này');
      }

      if (!params.listPermission) {
        throw new NotFoundException('Không tìm thấy danh sách quyền muốn thêm');
      }

      const promises = params.listPermission.map(async (permission) => {
        let index = role.permissions.findIndex((p) => p.id === permission);
        if (index == -1) {
          const permissionsFound = await this.permissionRepository.findOne({
            where: {
              id: permission,
            },
          });
          if (permissionsFound) {
            listAddPer.push(permissionsFound);
          }
        }
      });
      await Promise.all(promises);

      if (listAddPer.length > 0) {
        const uniquePermissions = new Set([...role.permissions, ...listAddPer]);
        role.permissions = [...uniquePermissions];
      }

      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async revokelistPermissionToRole(params: ListPermissionToRole) {
    try {
      const role = await this.roleRepository.findOne({
        relations: { permissions: true },
        where: { id: params.roleId },
      });

      if (!role) {
        throw new NotFoundException('Không tìm thấy role này');
      }

      if (!params.listPermission) {
        throw new NotFoundException('Không tìm thấy danh sách quyền muốn xóa');
      }

      params.listPermission.map((permission) => {
        let index = role.permissions.findIndex((p) => p.id === permission);
        if (index > -1) {
          role.permissions.splice(index, 1);
        }
      });

      const result = await this.roleRepository.save(role);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }
}
