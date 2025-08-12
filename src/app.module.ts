import { Module,MiddlewareConsumer,NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';
import { CommentModule } from './comment/comment.module';
import { RedisModule } from './redis/redis.module';
import { RateLimitMiddleware } from './redis/redis.rateLimit';
import { SanitizeMiddleware } from './common/middlewares/sanitize.middleware';


@Module({
  imports: [
    AuthModule,
     UserModule,
      ProjectModule,
       TaskModule,
        NotificationModule,
         CommentModule,
          RedisModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
    consumer.apply(SanitizeMiddleware).forRoutes('*');
  }};
