import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRoleEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
