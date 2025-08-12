import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CommentController } from '../src/comment/comment.controller';
import { CommentService } from '../src/comment/comment.service';
import { INestApplication, ExecutionContext, CanActivate } from '@nestjs/common';
import { AuthGuard } from '../src/common/guards/auth.guards';

// Мок CommentService с нужными методами
const mockCommentService = {
  getComments: jest.fn().mockResolvedValue([
    {
      commentsList: {
        title: 'Test Comment',
        description: 'Test description',
        file: null,
        createdAt: new Date(),
        author: { id: 1, email: 'author@test.com' },
        target: null,
      },
      fileUrl: null,
    },
  ]),
  createComment: jest.fn().mockResolvedValue({
    comment: {
      title: 'New Comment',
      description: 'Created comment',
      file: null,
      createdAt: new Date(),
      author: { id: 1, email: 'author@test.com' },
      target: null,
    },
    fileUrl: null,
  }),
  changeComment: jest.fn().mockResolvedValue({
    comment: {
      title: 'Updated Comment',
      description: 'Updated description',
      file: null,
      createdAt: new Date(),
      author: { id: 1, email: 'author@test.com' },
      target: null,
    },
    fileUrl: null,
  }),
  deleteComment: jest.fn().mockResolvedValue({ message: 'Comment deleted' }),
};

// Мок AuthGuard, вставляет фиктивного пользователя
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: 1 };
    return true;
  }
}

describe('CommentController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: mockCommentService }],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/comment/:taskId (GET) - getComments', () => {
    return request(app.getHttpServer())
      .get('/comment/1')
      .expect(200)
      .expect(res => {
        expect(mockCommentService.getComments).toHaveBeenCalledWith(1, 1);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('commentsList');
        expect(res.body[0]).toHaveProperty('fileUrl');
      });
  });

  it('/comment (POST) - createComment', () => {
    const createDto = {
      title: 'New Comment',
      description: 'Created comment',
      taskId: 1,
      authorId: 1,
    };

    return request(app.getHttpServer())
      .post('/comment')
      .field('title', createDto.title)
      .field('description', createDto.description)
      .field('taskId', createDto.taskId.toString())
      .field('authorId', createDto.authorId.toString())
      .attach('file', Buffer.from('file content'), 'test.txt')
      .expect(201)
      .expect(res => {
        expect(mockCommentService.createComment).toHaveBeenCalled();
        expect(res.body).toHaveProperty('comment');
        expect(res.body).toHaveProperty('fileUrl');
      });
  });

  it('/comment/:commentId (PATCH) - changeComment', () => {
    const updateDto = {
      title: 'Updated Comment',
      description: 'Updated description',
    };

    return request(app.getHttpServer())
      .patch('/comment/1')
      .field('title', updateDto.title)
      .field('description', updateDto.description)
      .attach('file', Buffer.from('updated file content'), 'update.txt')
      .expect(200)
      .expect(res => {
        expect(mockCommentService.changeComment).toHaveBeenCalled();
        expect(res.body).toHaveProperty('comment');
        expect(res.body).toHaveProperty('fileUrl');
      });
  });

  it('/comment/:commentId (DELETE) - deleteComment', () => {
    return request(app.getHttpServer())
      .delete('/comment/1')
      .expect(200)
      .expect(res => {
        expect(mockCommentService.deleteComment).toHaveBeenCalledWith(1, 1);
        expect(res.body).toEqual({ message: 'Comment deleted' });
      });
  });
});
