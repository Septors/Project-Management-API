import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TaskController } from '../src/task/task.controller';
import { TaskService } from '../src/task/task.service';
import { INestApplication, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guards';
import { CreaterGuard } from '../src/common/guards/project.creater.guard';

// Мок TaskService с нужными методами
const mockTaskService = {
  createTask: jest.fn().mockImplementation((dto, filePath) => Promise.resolve({
    task: { ...dto, file: filePath || null },
    file: filePath || null
  })),
  getTasks: jest.fn().mockResolvedValue([
    { task: { title: 'Task 1', description: 'Desc', status: 'open', file: null, comments: [], answers: [], assignedTasks: [] }, file: null }
  ]),
  addUserToTask: jest.fn().mockResolvedValue({ message: 'User added to task' }),
  changeTask: jest.fn().mockImplementation((dto, id, filePath) => Promise.resolve({
    task: { ...dto, file: filePath || null },
    file: filePath || null
  })),
  deleteUserInTask: jest.fn().mockResolvedValue({ message: 'User removed from task' }),
  deleteTask: jest.fn().mockResolvedValue({ message: 'Task deleted' }),
  createAnswer: jest.fn().mockImplementation((dto, filePath) => Promise.resolve({
    answer: { title: dto.title, description: dto.description, file: filePath || null },
    file: filePath || null
  })),
  changeAnswer: jest.fn().mockImplementation((dto, taskId, sub, filePath) => Promise.resolve({
    answer: { ...dto, file: filePath || null },
    file: filePath || null
  })),
};

// Моки AuthGuard и CreaterGuard (авторизация всегда успешна)
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: 1 };
    return true;
  }
}
class MockCreaterGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('TaskController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
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

  it('/task (POST) - createTask', () => {
    const createDto = { title: 'New task', description: 'desc', status: 'open', projectId: 1, createrId: 1 };
    return request(app.getHttpServer())
      .post('/task')
      .field('title', createDto.title)
      .field('description', createDto.description)
      .field('status', createDto.status)
      .field('projectId', createDto.projectId.toString())
      .field('createrId', createDto.createrId.toString())
      .attach('file', Buffer.from('file content'), 'image.png')
      .expect(201)
      .expect(res => {
        expect(mockTaskService.createTask).toHaveBeenCalled();
        expect(res.body).toHaveProperty('task');
        expect(res.body.file).toBeDefined();
      });
  });

  it('/task/projects/:projectId (GET) - getTasks', () => {
    return request(app.getHttpServer())
      .get('/task/projects/1')
      .expect(200)
      .expect(res => {
        expect(mockTaskService.getTasks).toHaveBeenCalled();
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/task/:taskId/projects/:projectId/users (POST) - addUser', () => {
    return request(app.getHttpServer())
      .post('/task/1/projects/1/users')
      .send({ userId: 2 })
      .expect(201)
      .expect(res => {
        expect(mockTaskService.addUserToTask).toHaveBeenCalled();
        expect(res.body).toEqual({ message: 'User added to task' });
      });
  });

  it('/task/:taskId (PATCH) - changeTask', () => {
    const updateDto = { title: 'Updated task', description: 'updated desc', status: 'closed' };
    return request(app.getHttpServer())
      .patch('/task/1')
      .field('title', updateDto.title)
      .field('description', updateDto.description)
      .field('status', updateDto.status)
      .attach('file', Buffer.from('updated file'), 'updated.png')
      .expect(200)
      .expect(res => {
        expect(mockTaskService.changeTask).toHaveBeenCalled();
        expect(res.body.task.title).toBe(updateDto.title);
      });
  });

  it('/task/:taskId/projects/:projectId/users/:userId (DELETE) - deleteUser', () => {
    return request(app.getHttpServer())
      .delete('/task/1/projects/1/users/2')
      .expect(200)
      .expect(res => {
        expect(mockTaskService.deleteUserInTask).toHaveBeenCalled();
        expect(res.body).toEqual({ message: 'User removed from task' });
      });
  });

  it('/task/:taskId/projects/:projectId (DELETE) - deleteTask', () => {
    return request(app.getHttpServer())
      .delete('/task/1/projects/1')
      .expect(200)
      .expect(res => {
        expect(mockTaskService.deleteTask).toHaveBeenCalled();
        expect(res.body).toEqual({ message: 'Task deleted' });
      });
  });

  it('/task/answers (POST) - createAnswer', () => {
    const createAnswerDto = { title: 'Answer title', description: 'Answer desc', userId: '1', taskId: '1' };
    return request(app.getHttpServer())
      .post('/task/answers')
      .field('title', createAnswerDto.title)
      .field('description', createAnswerDto.description)
      .field('userId', createAnswerDto.userId)
      .field('taskId', createAnswerDto.taskId)
      .attach('file', Buffer.from('answer file'), 'answer.png')
      .expect(201)
      .expect(res => {
        expect(mockTaskService.createAnswer).toHaveBeenCalled();
        expect(res.body).toHaveProperty('answer');
        expect(res.body.file).toBeDefined();
      });
  });

  it('/task/:taskId/answers (PATCH) - changeAnswer', () => {
    const updateAnswerDto = { title: 'Updated answer', description: 'Updated desc' };
    return request(app.getHttpServer())
      .patch('/task/1/answers')
      .field('title', updateAnswerDto.title)
      .field('description', updateAnswerDto.description)
      .attach('file', Buffer.from('updated answer file'), 'updated_answer.png')
      .expect(200)
      .expect(res => {
        expect(mockTaskService.changeAnswer).toHaveBeenCalled();
        expect(res.body.answer.title).toBe(updateAnswerDto.title);
      });
  });
});
