import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as CookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(CookieParser())
  app.use(helmet());
  app.enableCors()

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', 
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
