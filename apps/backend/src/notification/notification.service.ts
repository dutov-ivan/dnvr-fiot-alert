import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScraperService } from 'src/scraper/scraper.service';

@Injectable()
export class NotificationService {
  constructor(private scraper: ScraperService) {}

  // Cron job to fetch Fiot scores every minute
  @Cron('* * * * *')
  async sendFiotNotification(): Promise<void> {
    try {
      await this.scraper.getFiotScores();
    } catch (error) {
      console.error('Error fetching Fiot scores:', error);
    }
  }
}
