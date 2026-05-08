import { BaseEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  lastName: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true, length: 50 })
  username: string | null;

  @Column({ type: 'varchar', unique: true, nullable: true, length: 255 })
  email: string | null;

  @Column({ type: 'varchar', nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus = UserStatus.ACTIVE;
}
