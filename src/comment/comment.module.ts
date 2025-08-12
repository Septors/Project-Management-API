import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GuardModlue } from 'src/common/guards/guard.module';
import { CommentRepository } from './comment.repository';
import { NotificationModule } from 'src/notification/notification.module';
import { TaskModule } from 'src/task/task.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [CommentService,CommentRepository],
  exports:[CommentRepository,CommentService],
  controllers: [CommentController],
  imports: [PrismaModule,GuardModlue,NotificationModule,TaskModule,TokenModule],
})
export class CommentModule {}
