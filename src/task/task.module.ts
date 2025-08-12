import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskRepository } from './task.repository';
import { NotificationModule } from 'src/notification/notification.module';
import { ProjectModule } from 'src/project/project.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [TaskService,TaskRepository],
  exports:[TaskRepository,TaskService],
  controllers: [TaskController],
  imports: [PrismaModule,NotificationModule,ProjectModule,TokenModule]
})
export class TaskModule {}
