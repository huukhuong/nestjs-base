import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseException } from 'src/common/exceptions/base-exception';
import { NotFoundException } from 'src/common/exceptions/not-found-exception';
import { paginate } from 'src/common/paginate';
import { ILike, Repository } from 'typeorm';
import { CreatePermissionGroupDto } from '../dto/create-permission-group.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { SearchPermissionGroupDto } from '../dto/search-permission-group.dto';
import { SearchPermissionDto } from '../dto/search-permission.dto';
import { PermissionGroup } from '../entities/permission-group.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionGroup)
    private readonly permissionGroupRepository: Repository<PermissionGroup>,
  ) {}

  async search(params: SearchPermissionDto) {
    try {
      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.permissionRepository,
        withDeleted: params.withDeleted,
        relations: ['group'],
        where: [
          ...(params.code ? [{ code: ILike(`%${params.code}%`) }] : []),
          ...(params.name ? [{ name: ILike(`%${params.name}%`) }] : []),
          ...(params.groupId ? [{ group: { id: params.groupId } }] : []),
        ],
      });
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async create(params: CreatePermissionDto) {
    try {
      const permissionGroup = await this.permissionGroupRepository.findOneBy({
        id: params.groupId,
      });
      if (!permissionGroup) {
        throw new NotFoundException('Không tìm thấy nhóm chức năng');
      }
      const permission = this.permissionRepository.create({
        code: params.code,
        name: params.name,
      });
      permission.group = permissionGroup;
      const result = await this.permissionRepository.save(permission);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async update(permissionId: string, params: CreatePermissionDto) {
    try {
      const permissionFound = await this.permissionRepository.findOneBy({
        id: permissionId,
      });

      if (!permissionFound) {
        throw new NotFoundException('Không tìm thấy quyền');
      }

      permissionFound.code = params.code;
      permissionFound.name = params.name;

      if (params.groupId) {
        const groupFound = await this.permissionGroupRepository.findOneBy({
          id: params.groupId,
        });
        if (!groupFound) {
          throw new NotFoundException('Nhóm chức năng không tồn tại');
        }
        permissionFound.group = groupFound;
      }

      const result = await this.permissionRepository.save(permissionFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async delete(permissionId: string) {
    try {
      const role = await this.permissionRepository.findOneBy({
        id: permissionId,
      });

      if (!role) {
        throw new NotFoundException('Không tìm thấy quyền');
      }

      const result = await this.permissionRepository.softDelete({
        id: permissionId,
      });

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
   * ================== nhóm chức năng ===================
   * =================================================
   */
  async searchGroup(params: SearchPermissionGroupDto) {
    try {
      return await paginate({
        pageSize: params.pageSize,
        pageIndex: params.pageIndex,
        repository: this.permissionGroupRepository,
        withDeleted: params.withDeleted,
        relations: ['permissions'],
        where: [...(params.name ? [{ name: ILike(`%${params.name}%`) }] : [])],
      });
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async createGroup(params: CreatePermissionGroupDto) {
    try {
      const role = this.permissionGroupRepository.create(params);
      const result = await this.permissionGroupRepository.save(role);
      return result;
    } catch (e) {
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async updateGroup(groupId: string, params: CreatePermissionGroupDto) {
    try {
      const groupFound = await this.permissionGroupRepository.findOneBy({
        id: groupId,
      });

      if (!groupFound) {
        throw new NotFoundException('Không tìm thấy nhóm chức năng');
      }

      groupFound.name = params.name;

      const result = await this.permissionGroupRepository.save(groupFound);
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }

  async deleteGroup(groupId: string) {
    try {
      const role = await this.permissionGroupRepository.findOneBy({
        id: groupId,
      });

      if (!role) {
        throw new NotFoundException('Không tìm thấy nhóm chức năng');
      }

      const result = await this.permissionGroupRepository.softDelete({
        id: groupId,
      });
      return result;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BaseException('Có lỗi xảy ra.\n' + e.message);
    }
  }
}
