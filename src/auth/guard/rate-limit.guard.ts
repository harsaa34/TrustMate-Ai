// src/auth/guards/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private redis: Redis;

  constructor() {
    // Use in-memory store for simplicity, or connect to Redis
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.route.path;
    
    const key = `rate_limit:${ip}:${endpoint}`;
    
    // Check current count
    const current = await this.redis.get(key);
    const currentCount = current ? parseInt(current) : 0;
    
    // Allow 5 attempts per 15 minutes for login
    if (currentCount >= 5) {
      throw new HttpException(
        'Too many attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    // Increment count
    await this.redis.multi()
      .incr(key)
      .expire(key, 900) // 15 minutes
      .exec();
    
    return true;
  }
}