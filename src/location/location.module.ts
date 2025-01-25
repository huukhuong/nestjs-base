import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministrativeRegion } from './entities/administrative-region.entity';
import { AdministrativeUnit } from './entities/administrative-unit.entity';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdministrativeRegion,
      AdministrativeUnit,
      Province,
      District,
      Ward,
    ]),
  ],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}
