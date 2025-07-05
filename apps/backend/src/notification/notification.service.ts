import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { inArray } from 'drizzle-orm';
import { DatabaseClient, DrizzleDatabase } from 'src/db/drizzle-client';
import { subscriptions } from 'src/db/schema';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import * as serviceAccount from './serviceAccount.json';

@Injectable()
export class NotificationService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
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
        const message: Message = {
          notification: {
            title: 'New Faculty Rated',
            body: `The faculty ${subscription.faculty} has been rated.`,
          },
          token: subscription.fcmToken,
        };

        admin.messaging().send(message);
      }
    }
  }
}
