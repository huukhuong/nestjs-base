import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministrativeRegionResponseDto } from './dto/administrative-region-res.dto';
import { AdministrativeUnitResponseDto } from './dto/administrative-unit-res.dto';
import { DistrictResponseDto } from './dto/district-res.dto';
import { ProvinceResponseDto } from './dto/province-res.dto';
import { WardResponseDto } from './dto/ward-res.dto';
import { AdministrativeRegion } from './entities/administrative-region.entity';
import { AdministrativeUnit } from './entities/administrative-unit.entity';
import { District } from './entities/district.entity';
import { Province } from './entities/province.entity';
import { Ward } from './entities/ward.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(AdministrativeRegion)
    private readonly administrativeRegionRepository: Repository<AdministrativeRegion>,
    @InjectRepository(AdministrativeUnit)
    private readonly administrativeUnitRepository: Repository<AdministrativeUnit>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async administrativeRegions() {
    const regions = await this.administrativeRegionRepository.find();
    return regions.map((r) => {
      return new AdministrativeRegionResponseDto({
        id: r.id,
        name: r.name,
        nameEn: r.name_en,
      });
    });
  }

  async administrativeUnits() {
    const units = await this.administrativeUnitRepository.find();
    return units.map((u) => {
      return new AdministrativeUnitResponseDto({
        id: u.id,
        shortName: u.short_name,
        shortNameEn: u.short_name_en,
      });
    });
  }

  async provinces(region?: number) {
    const regionFind = await this.administrativeRegionRepository.findOne({
      where: { id: region },
      relations: ['provinces', 'provinces.administrativeUnit'],
    });

    let data: Province[] = [];

    if (!regionFind) {
      data = await this.provinceRepository.find();
    } else {
      data = regionFind.provinces;
    }

    return data.map((p) => {
      return new ProvinceResponseDto({
        code: p.code,
        fullName: p.full_name,
        fullNameEn: p.full_name_en,
      });
    });
  }

  async districts(province?: string) {
    const provinceFind = await this.provinceRepository.findOne({
      where: { code: province },
      relations: ['districts', 'districts.administrativeUnit'],
    });

    let data: District[] = [];

    if (!provinceFind) {
      data = [];
    } else {
      data = provinceFind.districts;
    }

    return data.map((p) => {
      return new DistrictResponseDto({
        code: p.code,
        fullName: p.full_name,
        fullNameEn: p.full_name_en,
      });
    });
  }

  async wards(district?: string) {
    const districtFind = await this.districtRepository.findOne({
      where: { code: district },
      relations: ['wards', 'wards.administrativeUnit'],
    });

    let data: Ward[] = [];

    if (!districtFind) {
      data = [];
    } else {
      data = districtFind.wards;
    }

    return data.map((p) => {
      return new WardResponseDto({
        code: p.code,
        fullName: p.full_name,
        fullNameEn: p.full_name_en,
      });
    });
  }
}
