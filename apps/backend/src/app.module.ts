import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorService } from './monitor/monitor.service';
import { NotificationService } from './notification/notification.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisService } from './redis/redis.service';
import { DbModule } from './db/db.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DbModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MonitorService, NotificationService, RedisService],
})
export class AppModule {}
