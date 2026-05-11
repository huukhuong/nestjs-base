import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { UserEntity } from 'src/user/entities/user.entity';
import { PermissionEntity } from './permission.entity';

@Entity('user_permissions')
@Index(['userId', 'permissionId'], { unique: true })
export class UserPermissionEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
