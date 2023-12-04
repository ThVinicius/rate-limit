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

    const remoteAddress = req.socket.remoteAddress;
    console.log(
      '🚀 ~ file: throttler-ip.guard.ts:18 ~ ThrottlerIpGuard ~ remoteAddress:',
      remoteAddress,
    );

    // Obter a string do cabeçalho X-Forwarded-For
    const xForwardedForHeader =
      (req.headers['x-forwarded-for'] as string) || '';

    // Dividir a string em uma matriz de endereços IP
    const ips = xForwardedForHeader.split(',').map((ip) => ip.trim());

    // O endereço IP real do cliente é o primeiro na lista
    const clientIp =
      ips[0].trim().length > 0 ? ips[0] : req.connection.remoteAddress;
    console.log(
      '🚀 ~ file: throttler-ip.guard.ts:25 ~ ThrottlerIpGuard ~ clientIp:',
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
