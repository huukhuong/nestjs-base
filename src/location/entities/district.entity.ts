import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { AdministrativeUnit } from './administrative-unit.entity';
import { Province } from './province.entity';
import { Ward } from './ward.entity';

@Entity('districts')
export class District {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @ManyToOne(() => Province, province => province.districts, { nullable: true })
  province: Province;

  @ManyToOne(() => AdministrativeUnit, administrativeUnit => administrativeUnit.districts, { nullable: true })
  administrativeUnit: AdministrativeUnit;

  @OneToMany(() => Ward, ward => ward.district)
  wards: Ward[];
}
