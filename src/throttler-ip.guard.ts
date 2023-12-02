import { ExecutionContext } from '@nestjs/common';
import {
  ThrottlerException,
  ThrottlerGuard,
  ThrottlerOptions,
} from '@nestjs/throttler';

export class ThrottlerIpGuard extends ThrottlerGuard {
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
  ): Promise<boolean> {
    const { req, res } = this.getRequestResponse(context);

    const clientIp =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress;

    console.log(
      '🚀 ~ file: throttler-ip.guard.ts:18 ~ ThrottlerIpGuard ~ clientIp:',
      clientIp,
    );

    const key = this.generateKey(context, clientIp, throttler.name);
    console.log(
      '🚀 ~ file: throttler-ip.guard.ts:20 ~ ThrottlerIpGuard ~ key:',
      key,
    );

    const { totalHits, timeToExpire } = await this.storageService.increment(
      key,
      ttl,
    );

    if (totalHits > limit) {
      throw new ThrottlerException();
    }

    res.header(`${this.headerPrefix}-Limit`, limit);
    res.header(
      `${this.headerPrefix}-Remaining`,
      Math.max(0, limit - totalHits),
    );
    res.header(`${this.headerPrefix}-Reset`, timeToExpire);

    return true;
  }
}
