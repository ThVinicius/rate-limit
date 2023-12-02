import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerIpGuard } from './throttler-ip.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ThrottlerIpGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
