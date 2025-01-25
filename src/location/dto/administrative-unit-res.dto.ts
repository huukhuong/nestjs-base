import { Expose } from 'class-transformer';

export class AdministrativeUnitResponseDto {
  @Expose()
  id: number;

  @Expose()
  shortName: string;

  @Expose()
  shortNameEn: string;

  constructor(partial: Partial<AdministrativeUnitResponseDto>) {
    Object.assign(this, partial);
  }
}
