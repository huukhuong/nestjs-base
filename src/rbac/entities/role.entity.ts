import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
