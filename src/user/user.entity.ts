import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EUserStatus } from './enums/user-status';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 50,
    nullable: true,
  })
  lastName: string;

  @Column({
    unique: true,
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    unique: true,
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    unique: true,
    length: 15,
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    length: 60,
  })
  password: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: EUserStatus,
    default: EUserStatus.ACTIVE,
  })
  status: EUserStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  emailVerifiedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
