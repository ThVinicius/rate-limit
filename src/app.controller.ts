import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerIpGuard } from './throttler-ip.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ThrottlerIpGuard)
  @Get('with-rate-limit')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('no-rate-limit')
  test(): string {
    return 'Rota sem rate limit';
  }
}
