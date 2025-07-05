import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { MonitorService } from './monitor/monitor.service';
import { SubscriptionDto } from './subscription.dto';
import { SubscriptionsService } from './subscriptions/subscriptions.service';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    private readonly monitorService: MonitorService,
    private readonly subscriptionsService: SubscriptionsService,
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

  async subscribeToFaculty(dto: SubscriptionDto): Promise<void> {
    this.subscriptionsService.addSubscription(
      dto.deviceId,
      dto.faculty,
      dto.fcmToken,
    );
  }
}
