import { Entity, Index, ManyToOne, JoinColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { UserEntity } from 'src/user/entities/user.entity';
import { PermissionEntity } from './permission.entity';

@Entity('user_permissions')
@Index(['userId', 'permissionId'], { unique: true })
export class UserPermissionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  permissionId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PermissionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
