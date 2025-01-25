import { Expose } from 'class-transformer';

export class ProvinceResponseDto {
  @Expose()
  code: string;

  @Expose()
  fullName: string;

  @Expose()
  fullNameEn: string;

  constructor(partial: Partial<ProvinceResponseDto>) {
    Object.assign(this, partial);
  }
}
