import { Expose } from 'class-transformer';

export class AdministrativeRegionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  nameEn: string;

  constructor(partial: Partial<AdministrativeRegionResponseDto>) {
    Object.assign(this, partial);
  }
}
