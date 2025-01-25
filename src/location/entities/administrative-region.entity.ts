import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Province } from './province.entity';

@Entity('administrative_regions')
export class AdministrativeRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @Column({ nullable: true })
  code_name_en: string;

  @OneToMany(() => Province, (province) => province.administrativeRegion)
  provinces: Province[];
}
