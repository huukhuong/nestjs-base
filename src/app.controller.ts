import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import moment from 'moment';

@Controller()
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly typeOrm: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get('/health')
  @HealthCheck()
  async healthStatus() {
    const health = await this.health.check([
      () => this.typeOrm.pingCheck('database', { timeout: 3000 }),
      () => this.http.pingCheck('swagger', `${process.env.HOST}/swagger`),
    ]);

    return {
      uptime: Number(process.uptime().toFixed(0)),
      timestamp: moment(),
      health,
    };
  }
}
