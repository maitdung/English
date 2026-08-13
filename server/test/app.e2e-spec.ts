import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('MTD Lingo API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  it('/api/courses (GET) returns published courses', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/courses')
      .expect(200);
    const body = response.body as {
      data: unknown;
      meta: unknown;
    };

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 12,
      }),
    );
  });

  it('/api/courses validates pagination', async () => {
    await request(app.getHttpServer()).get('/api/courses?page=0').expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
