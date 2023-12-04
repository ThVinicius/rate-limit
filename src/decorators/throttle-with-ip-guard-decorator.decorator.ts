import { UseGuards } from '@nestjs/common';
import { ThrottlerIpGuard } from '../throttler-ip.guard';
import { Throttle } from '@nestjs/throttler';

export const RateLimitPerIpGuard = (options: {
  limit: number;
  ttl: number;
}) => {
  const throttleDecorator = Throttle({ default: options });
  const throttlerIpGuardDecorator = UseGuards(ThrottlerIpGuard);

  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    throttleDecorator(target, key, descriptor);
    throttlerIpGuardDecorator(target, key, descriptor);
  };
};
