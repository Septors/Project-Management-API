import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { INestApplication, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guards';
import * as cookieParser from 'cookie-parser'; // добавь импорт

// Мок сервиса с нужными методами
const mockAuthService = {
  getProfile: jest.fn().mockImplementation((sub) => Promise.resolve({ email: 'test@example.com', role: 'user' })),
  login: jest.fn().mockImplementation((dto) => Promise.resolve({
    user: { email: dto.email, role: 'user' },
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
  })),
  register: jest.fn().mockImplementation((dto) => Promise.resolve({
    user: { email: dto.email, role: 'user' },
    accessToken: 'fake-access-token',
    refreshToken: 'fake-refresh-token',
  })),
  logout: jest.fn().mockResolvedValue({ message: 'Logged out' }),
  refresh: jest.fn().mockResolvedValue({
    user: { email: 'test@example.com', role: 'user' },
    accessToken: 'new-access-token',
  }),
};

// Мок AuthGuard, который вставляет фиктивного пользователя
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: 1 }; // подставляем userId в req.user
    return true;
  }
}

describe('AuthController (integration)', () => {
  let app: INestApplication;

beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
      {
        provide: AuthService,
        useValue: mockAuthService,
      },
    ],
  })
    .overrideGuard(AuthGuard)
    .useClass(MockAuthGuard)
    .compile();

  app = moduleRef.createNestApplication();

  app.use(cookieParser()); // <-- ВАЖНО: вот здесь подключаем cookie-parser

  await app.init();
});

  afterAll(async () => {
    await app.close();
  });

  it('/auth (GET) - getMe', () => {
    return request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ email: 'test@example.com', role: 'user' });
      });
  });

  it('/auth/login (POST) - login', () => {
    const loginDto = { email: 'user@example.com', password: 'Password1' };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          user: { email: loginDto.email, role: 'user' },
          accessToken: 'fake-access-token',
        });
        expect(res.headers['set-cookie']).toBeDefined(); // проверяем, что куки установились
      });
  });

  it('/auth/register (POST) - register', () => {
    const registerDto = { email: 'newuser@example.com', password: 'Password1', confirmPassword: 'Password1' };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          user: { email: registerDto.email, role: 'user' },
          accessToken: 'fake-access-token',
        });
        expect(res.headers['set-cookie']).toBeDefined();
      });
  });

  it('/auth/logout (POST) - logout', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', 'Bearer fake-access-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ message: 'Logged out' });
        expect(res.headers['set-cookie']).toBeDefined(); // куки должны быть очищены
      });
  });

 it('/auth/update-token (POST) - refresh', () => {
  return request(app.getHttpServer())
    .post('/auth/update-token')
    .set('Cookie', ['refreshToken=fake-refresh-token'])
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual({
        user: { email: 'test@example.com', role: 'user' },
        accessToken: 'new-access-token',
      });
    });
});
});
