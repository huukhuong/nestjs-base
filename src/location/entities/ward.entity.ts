import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { AdministrativeUnit } from './administrative-unit.entity';
import { District } from './district.entity';

@Entity('wards')
export class Ward {
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

  @ManyToOne(() => District, (district) => district.wards, { nullable: true })
  district: District;

  @ManyToOne(
    () => AdministrativeUnit,
    (administrativeUnit) => administrativeUnit.wards,
    { nullable: true },
  )
  administrativeUnit: AdministrativeUnit;
}
