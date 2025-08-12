import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { GuardModlue } from 'src/common/guards/guard.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TokenModule,UserModule,GuardModlue]
})
export class AuthModule {}
