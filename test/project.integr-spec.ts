import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ExecutionContext, CanActivate } from '@nestjs/common';
import { ProjectController } from '../src/project/project.controller';
import { ProjectService } from '../src/project/project.service';
import { AuthGuard } from '../src/common/guards/auth.guards';
import { CreaterGuard } from '../src/common/guards/project.creater.guard';

// Мок ProjectService с основными методами
const mockProjectService = {
  getProject: jest.fn().mockImplementation((projectId, sub) =>
    Promise.resolve({
      id: projectId,
      name: 'Test Project',
      description: 'Test description',
      status: 'active',
      user: { id: sub, email: 'user@test.com' },
      tasks: [],
      projectUser: [],
    }),
  ),
  createProject: jest.fn().mockImplementation((dto, sub) =>
    Promise.resolve({
      id: 1,
      name: dto.name,
      description: dto.description,
      status: dto.status,
      user: { id: sub, email: 'creator@test.com' },
      tasks: [],
      projectUser: [],
    }),
  ),
  addUser: jest.fn().mockResolvedValue([{ userId: 2, userRole: 'member' }]),
  updateProject: jest.fn().mockImplementation((dto, projectId) => Promise.resolve(dto)),
  changeUserRole: jest.fn().mockResolvedValue({ message: 'Role updated' }),
  deleteProject: jest.fn().mockResolvedValue({ message: 'Project deleted' }),
};

// Мок AuthGuard
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: 1 }; // Пользователь с id=1
    return true;
  }
}

// Мок CreaterGuard (просто пропускает)
class MockCreaterGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('ProjectController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(CreaterGuard)
      .useClass(MockCreaterGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/project/:projectId (GET) - getProject', () => {
    return request(app.getHttpServer())
      .get('/project/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Test Project');
      });
  });

  it('/project (POST) - create', () => {
    const dto = {
      name: 'New Project',
      description: 'New Desc',
      status: 'active',
      createrId: 1,
      member: [],
    };
    return request(app.getHttpServer())
      .post('/project')
      .send(dto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', dto.name);
        expect(res.body).toHaveProperty('description', dto.description);
      });
  });

  it('/project/:projectId/users (POST) - addUser', () => {
    return request(app.getHttpServer())
      .post('/project/1/users')
      .send({ member: [{ userId: 2, userRole: 'member' }] })
      .expect(201)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('userId', 2);
      });
  });

  it('/project/:projectId (PATCH) - updateProject', () => {
    const dto = { name: 'Updated Project' };
    return request(app.getHttpServer())
      .patch('/project/1')
      .send(dto)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', dto.name);
      });
  });

  it('/project/:projectId/user/:userId (PATCH) - changeUserRole', () => {
    return request(app.getHttpServer())
      .patch('/project/1/user/2')
      .send('member') // ProjectRole, например 'member'
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Role updated');
      });
  });

  it('/project/:projectId (DELETE) - deleteProject', () => {
    return request(app.getHttpServer())
      .delete('/project/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Project deleted');
      });
  });
});
