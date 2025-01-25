import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Province } from './province.entity';
import { District } from './district.entity';
import { Ward } from './ward.entity';

@Entity('administrative_units')
export class AdministrativeUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  full_name_en: string;

  @Column({ nullable: true })
  short_name: string;

  @Column({ nullable: true })
  short_name_en: string;

  @Column({ nullable: true })
  code_name: string;

  @Column({ nullable: true })
  code_name_en: string;

  @OneToMany(() => Province, province => province.administrativeUnit)
  provinces: Province[];

  @OneToMany(() => District, district => district.administrativeUnit)
  districts: District[];

  @OneToMany(() => Ward, ward => ward.administrativeUnit)
  wards: Ward[];
}
