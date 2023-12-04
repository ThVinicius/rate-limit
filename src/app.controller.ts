import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitPerIpGuard } from './decorators/throttle-with-ip-guard-decorator.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RateLimitPerIpGuard({ limit: 1, ttl: 10000 })
  @Get('with-rate-limit')
  getHello(): string {
    return this.appService.getHello();
  }

  @RateLimitPerIpGuard({ limit: 1, ttl: 2000 })
  @Get('with-rate-limit-2')
  getHello2(): string {
    return this.appService.getHello();
  }

  @Get('no-rate-limit')
  test(): string {
    return 'Rota sem rate limit';
  }
}
