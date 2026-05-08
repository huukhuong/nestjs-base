import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis';

@Injectable()
export class AuthTokenService {
  constructor(private readonly redisService: RedisService) {}

  async setActiveRefreshTokenJti(
    userId: string,
    jti: string,
    ttlSeconds: number,
  ) {
    await this.redisService.set(this.getRefreshJtiKey(userId), jti, ttlSeconds);
  }

  async getActiveRefreshTokenJti(userId: string) {
    return this.redisService.get(this.getRefreshJtiKey(userId));
  }

  async revokeAllRefreshTokens(userId: string) {
    await this.redisService.del(this.getRefreshJtiKey(userId));
  }

  private getRefreshJtiKey(userId: string) {
    return `auth:refresh:jti:${userId}`;
  }
}
