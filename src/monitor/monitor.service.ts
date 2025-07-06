import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NotificationService } from 'src/notification/notification.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MonitorService {
  constructor(
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationService,
  ) {}

  ratingUrl: string =
    'https://dnvr.kpi.ua/2025/07/04/%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3-%D1%83%D1%81%D0%BF%D1%96%D1%88%D0%BD%D0%BE%D1%81%D1%82%D1%96-%D0%BB%D1%96%D1%82%D0%BE-2024-2025/';

  @Cron('* * * * *') // Every minute
  async updateScores(): Promise<any> {
    const res = await axios.get(this.ratingUrl);
    const data = res.data;
    const $ = cheerio.load(data);

    const facultyNames = $('.post-content p');
    const availableFaculties: string[] = [];
    const ratedFaculties: string[] = [];

    facultyNames.each((i, el) => {
      const text = $(el).text();
      if (text == 'Факультети' || text == 'Інститути') {
        return;
      }
      availableFaculties.push(text);
    });

    this.redisService.set(
      'availableFaculties',
      availableFaculties,
      60 * 60 * 24,
    );

    const beforeMonitor =
      (await this.redisService.get<string[]>('ratedFaculties')) || [];
    const afterMonitor = ratedFaculties;

    await this.notificationService.notifyUpdates(beforeMonitor, afterMonitor);

    this.redisService.set('ratedFaculties', ratedFaculties);
  }
}
