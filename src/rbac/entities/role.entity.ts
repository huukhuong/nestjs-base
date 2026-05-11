import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { ERoles } from 'src/common/enum';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  code: ERoles;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
