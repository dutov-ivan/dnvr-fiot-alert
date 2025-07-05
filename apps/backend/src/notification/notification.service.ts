import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { eq, inArray } from 'drizzle-orm';
import { DatabaseClient, DrizzleDatabase } from 'src/db/drizzle-client';
import { subscriptions } from 'src/db/schema';
import { MonitorService } from 'src/monitor/monitor.service';

@Injectable()
export class NotificationService {
  constructor(@Inject(DrizzleDatabase) private readonly db: DatabaseClient) {}

  async notifyUpdates(beforeFaculties: string[], afterFaculties: string[]) {
    const newFaculties = afterFaculties.filter(
      (faculty) => !beforeFaculties.includes(faculty),
    );
    const removedFaculties = beforeFaculties.filter(
      (faculty) => !afterFaculties.includes(faculty),
    );

    if (newFaculties.length > 0) {
      const subscriptionsToNotify = await this.db
        .select()
        .from(subscriptions)
        .where(inArray(subscriptions.faculty, newFaculties))
        .execute();

      for (const subscription of subscriptionsToNotify) {
        console.log(
          `Notify ${subscription.id} about new faculty: ${subscription.faculty}`,
        );
        // Implement your notification logic here, e.g., push notification
      }
    }
  }
}
