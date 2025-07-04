import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  ratingUrl: string =
    'https://dnvr.kpi.ua/2025/07/04/%D1%80%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3-%D1%83%D1%81%D0%BF%D1%96%D1%88%D0%BD%D0%BE%D1%81%D1%82%D1%96-%D0%BB%D1%96%D1%82%D0%BE-2024-2025/';
  async getFiotScores(): Promise<any> {
    const res = await axios.get(this.ratingUrl);
    const data = res.data;
    const $ = cheerio.load(data);

    $('p').each((i, el) => {
      const text = $(el).text();
      if (/ФІОТ/i.test(text)) {
        console.log('Important paragraph:', text);
      } else {
        console.log('Other paragraph:', text);
      }
    });
  }
}
