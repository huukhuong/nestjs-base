import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from 'src/common/entities';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
