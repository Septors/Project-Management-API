import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from './redis.service'; // путь к твоему сервису

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      await this.redisService.consumeRateLimit(req.ip);
      next();
    } catch (rejRes) {
      res.status(429).send('Too Many Requests');
    }
  }
}

