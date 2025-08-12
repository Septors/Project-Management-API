import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private client: Redis;
  private rateLimiter: RateLimiterRedis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.log('Redis error', err);
    });

    this.rateLimiter = new RateLimiterRedis({
      storeClient: this.client,
      points: 10,        
      duration: 1,       
      blockDuration: 60, 
    });
  }

  async set(key: string, value: string, expireSec?: number) {
    if (expireSec) {
      await this.client.set(key, value, 'EX', expireSec);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async consumeRateLimit(key: string): Promise<void> {
    await this.rateLimiter.consume(key);
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}
