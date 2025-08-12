import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { GuardModlue } from 'src/common/guards/guard.module';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectRepository } from './project.repository';
import { NotificationModule } from 'src/notification/notification.module';
import { TokenModule } from 'src/token/token.module';


@Module({
  providers: [ProjectService,ProjectRepository],
  controllers: [ProjectController],
  exports:[ProjectRepository,ProjectService],
  imports: [
    forwardRef(()=> GuardModlue),UserModule,PrismaModule,NotificationModule,TokenModule],
  
})
export class ProjectModule {}
