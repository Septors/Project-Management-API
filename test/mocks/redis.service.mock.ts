// test/mocks/redis.service.mock.ts
export class RedisServiceMock {
  async set() { return; }
  async get() { return null; }
  async del() { return; }
  onModuleInit() { return; }
  onModuleDestroy() { return; }
}
