import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermissionEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
