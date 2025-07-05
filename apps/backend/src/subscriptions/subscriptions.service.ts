import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClient, DrizzleDatabase } from 'src/db/drizzle-client';
import { subscriptions } from 'src/db/schema';

@Injectable()
export class SubscriptionsService {
  constructor(@Inject(DrizzleDatabase) private readonly db: DatabaseClient) {}

  async addSubscription(deviceId: string, faculty: string) {
    return await this.db.insert(subscriptions).values({
      id: deviceId,
      faculty,
    });
  }
}
