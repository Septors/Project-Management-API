import { Module } from '@nestjs/common';
import {UserRepository} from './user.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  imports:[PrismaModule,TokenModule],
})
export class UserModule {}
