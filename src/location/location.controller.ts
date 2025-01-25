import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { LocationService } from './location.service';
import { BaseResponse } from 'src/common/base-response';
import { ApiOperation } from '@nestjs/swagger';

@Controller('location')
@Public()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/administrative-regions')
  @ApiOperation({ summary: 'Lấy danh sách khu vực' })
  async administrativeRegions() {
    const data = await this.locationService.administrativeRegions();
    return BaseResponse.success(data);
  }

  @Get('/administrative-units')
  @ApiOperation({ summary: 'Lấy danh sách đơn vị hành chính' })
  async administrativeUnits() {
    const data = await this.locationService.administrativeUnits();
    return BaseResponse.success(data);
  }

  @Get('/provinces/:region')
  @ApiOperation({
    summary: 'Lấy danh sách tỉnh thành theo khu vực (truyền -1 để lấy tất cả)',
  })
  async provinces(@Param('region') region: number) {
    const data = await this.locationService.provinces(region);
    return BaseResponse.success(data);
  }

  @Get('districts/:province')
  @ApiOperation({ summary: 'Lấy danh sách quận huyện theo tỉnh thành' })
  async districts(@Param('province') province?: string) {
    const data = await this.locationService.districts(province);
    return BaseResponse.success(data);
  }

  @Get('wards/:district')
  @ApiOperation({ summary: 'Lấy danh sách phường xã theo quận huyện' })
  async wards(@Param('district') district?: string) {
    const data = await this.locationService.wards(district);
    return BaseResponse.success(data);
  }
}
