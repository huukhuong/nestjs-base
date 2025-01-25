import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { AdministrativeRegion } from './administrative-region.entity';
import { District } from './district.entity';
import { AdministrativeUnit } from './administrative-unit.entity';

@Entity('provinces')
export class Province {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column()
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @ManyToOne(() => AdministrativeUnit, administrativeUnit => administrativeUnit.provinces, { nullable: true })
  administrativeUnit: AdministrativeUnit;

  @ManyToOne(() => AdministrativeRegion, administrativeRegion => administrativeRegion.provinces, { nullable: true })
  administrativeRegion: AdministrativeRegion;

  @OneToMany(() => District, district => district.province)
  districts: District[];
}
