import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { MonitorService } from './monitor/monitor.service';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    private readonly monitorService: MonitorService,
  ) {}

  async isFacultyRated(faculty: string): Promise<boolean> {
    let ratedFaculties =
      (await this.redisService.get<string[]>('ratedFaculties')) || [];
    if (ratedFaculties.length === 0) {
      await this.monitorService.updateScores();
      const result = await this.redisService.get<string[]>('ratedFaculties');
      if (!result) {
        throw new Error('Failed to fetch rated faculties from Redis');
      }
      ratedFaculties = result;
    }
    return ratedFaculties.includes(faculty);
  }
}
