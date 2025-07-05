import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SubscriptionDto } from './subscription.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  pollFaculty(@Param('faculty') faculty: string) {
    return this.appService.isFacultyRated(faculty);
  }

  @Post('subscribe')
  subscribeToFaculty(@Body() dto: SubscriptionDto) {
    return this.appService.subscribeToFaculty(dto);
  }
}
