import { Expose } from "class-transformer";

export class WardResponseDto {
  @Expose()
  code: string;

  @Expose()
  fullName: string;

  @Expose()
  fullNameEn: string;

  constructor(partial: Partial<WardResponseDto>) {
    Object.assign(this, partial);
  }
}
