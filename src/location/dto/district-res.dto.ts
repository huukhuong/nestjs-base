import { Expose } from "class-transformer";

export class DistrictResponseDto {
  @Expose()
  code: string;

  @Expose()
  fullName: string;

  @Expose()
  fullNameEn: string;

  constructor(partial: Partial<DistrictResponseDto>) {
    Object.assign(this, partial);
  }
}
