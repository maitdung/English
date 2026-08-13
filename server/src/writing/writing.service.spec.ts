import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CourseLevel } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewWritingDto, WritingTaskType } from './dto/review-writing.dto';
import { WritingService } from './writing.service';

const reviewedAt = new Date('2026-08-13T08:30:00.000Z');

const baseDto: ReviewWritingDto = {
  consent: true,
  taskType: WritingTaskType.ESSAY,
  level: CourseLevel.B1,
  prompt: 'Why is learning English useful?',
  content:
    'i am agree that English is very important. It helps many people get information, becuase it is used around the world',
  targetWords: 120,
};

function createConfig(values: Record<string, unknown> = {}): ConfigService {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      values[key] === undefined ? defaultValue : values[key],
    ),
    getOrThrow: jest.fn((key: string) => {
      if (values[key] === undefined || values[key] === '') {
        throw new Error(`Missing ${key}`);
      }

      return values[key];
    }),
  } as unknown as ConfigService;
}

function createPrismaMock() {
  return {
    writingSubmission: {
      create: jest.fn(({ data }: { data: Record<string, unknown> }) => ({
        ...data,
        id: 'writing-1',
        reviewedAt,
      })),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
}

describe('WritingService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns and persists a useful local assessment without an AI key', async () => {
    const prisma = createPrismaMock();
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig(),
    );

    const result = await service.review('user-1', baseDto);

    expect(result).toMatchObject({
      id: 'writing-1',
      taskType: WritingTaskType.ESSAY,
      level: CourseLevel.B1,
      source: 'fallback',
    });
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.criteria).toHaveLength(4);
    expect(result.criteria.every((criterion) => criterion.score <= 100)).toBe(
      true,
    );
    expect(result.corrections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ corrected: 'I agree' }),
        expect.objectContaining({ corrected: 'because' }),
      ]),
    );
    expect(result.improvedVersion).toContain('I agree');
    expect(result.improvedVersion).toContain('because');
    expect(result.vocabularySuggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ original: 'very important' }),
      ]),
    );
    const createData = prisma.writingSubmission.create.mock.calls[0][0].data;
    expect(createData).toMatchObject({
      userId: 'user-1',
      content: baseDto.content,
      source: 'fallback',
      aiConsentVersion: 'v1',
    });
    expect(createData.aiConsentAt).toBeInstanceOf(Date);
  });

  it('uses OpenAI Responses Structured Outputs and stores its source', async () => {
    const prisma = createPrismaMock();
    const assessment = {
      overallScore: 84,
      cefrEstimate: 'B2',
      summaryVi: 'Bài viết rõ ràng và có lập luận tốt.',
      criteria: [
        {
          key: 'taskAchievement',
          labelVi: 'Hoàn thành yêu cầu',
          score: 85,
          feedbackVi: 'Trả lời đúng trọng tâm.',
        },
        {
          key: 'coherence',
          labelVi: 'Mạch lạc',
          score: 82,
          feedbackVi: 'Các ý nối với nhau rõ.',
        },
        {
          key: 'grammar',
          labelVi: 'Ngữ pháp',
          score: 83,
          feedbackVi: 'Cấu trúc đa dạng.',
        },
        {
          key: 'vocabulary',
          labelVi: 'Từ vựng',
          score: 86,
          feedbackVi: 'Từ vựng chính xác.',
        },
      ],
      corrections: [],
      strengths: ['Lập luận rõ ràng.'],
      priorities: ['Dùng thêm ví dụ cụ thể.'],
      improvedVersion: 'English is essential for global communication.',
      vocabularySuggestions: [],
    };
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          output: [
            {
              type: 'message',
              content: [
                { type: 'output_text', text: JSON.stringify(assessment) },
              ],
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig({ OPENAI_API_KEY: 'server-secret' }),
    );

    const result = await service.review('user-1', baseDto);

    expect(result.source).toBe('openai');
    expect(result.overallScore).toBe(84);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://api.openai.com/v1/responses');
    expect(init.headers).toEqual(
      expect.objectContaining({ Authorization: 'Bearer server-secret' }),
    );
    expect(typeof init.body).toBe('string');
    if (typeof init.body !== 'string') {
      throw new Error('Expected a JSON request body.');
    }
    const body = JSON.parse(init.body) as {
      store: boolean;
      text: { format: { type: string; strict: boolean } };
    };
    expect(body.store).toBe(false);
    expect(body.text.format).toMatchObject({
      type: 'json_schema',
      strict: true,
    });
  });

  it('falls back safely when a configured provider fails without logging the essay', async () => {
    const prisma = createPrismaMock();
    global.fetch = jest
      .fn()
      .mockResolvedValue(new Response('{}', { status: 503 }));
    const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig({ OPENAI_API_KEY: 'server-secret' }),
    );

    const result = await service.review('user-1', baseDto);

    expect(result.source).toBe('fallback');
    expect(warn).toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).not.toContain(baseDto.content);
  });

  it('returns only the current user history with validated pagination values', async () => {
    const prisma = createPrismaMock();
    const stored = {
      id: 'writing-1',
      userId: 'user-1',
      taskType: WritingTaskType.EMAIL,
      level: CourseLevel.A2,
      prompt: null,
      content: 'Thank you for your email. I will send the report tomorrow.',
      targetWords: 80,
      wordCount: 11,
      overallScore: 74,
      cefrEstimate: CourseLevel.A2,
      summaryVi: 'Bài viết rõ ràng.',
      criteria: [],
      corrections: [],
      strengths: ['Thông điệp rõ.'],
      priorities: ['Bổ sung chi tiết.'],
      improvedVersion:
        'Thank you for your email. I will send the report tomorrow.',
      vocabularySuggestions: [],
      source: 'fallback',
      aiConsentAt: reviewedAt,
      aiConsentVersion: 'v1',
      reviewedAt,
    };
    prisma.writingSubmission.findMany.mockResolvedValue([stored]);
    prisma.writingSubmission.count.mockResolvedValue(1);
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig(),
    );

    const result = await service.getHistory('user-1', {
      limit: 10,
      offset: 20,
    });

    expect(prisma.writingSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 'user-1' },
        skip: 20,
        take: 10,
      }),
    );
    expect(prisma.writingSubmission.count).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
    });
    expect(result).toMatchObject({ total: 1, limit: 10, offset: 20 });
    expect(result.items).toEqual([
      {
        id: 'writing-1',
        reviewedAt,
        taskType: WritingTaskType.EMAIL,
        level: CourseLevel.A2,
        prompt: null,
        wordCount: 11,
        overallScore: 74,
        cefrEstimate: CourseLevel.A2,
        source: 'fallback',
      },
    ]);
    expect(result.items[0]).not.toHaveProperty('content');
    expect(result.items[0]).not.toHaveProperty('criteria');
  });

  it('returns only an owned full item and rejects missing or foreign ids', async () => {
    const prisma = createPrismaMock();
    const stored = {
      id: 'writing-1',
      userId: 'user-1',
      taskType: WritingTaskType.GENERAL,
      level: CourseLevel.B1,
      prompt: null,
      content: 'This is a complete writing submission for the detail endpoint.',
      targetWords: null,
      wordCount: 10,
      overallScore: 80,
      cefrEstimate: CourseLevel.B1,
      summaryVi: 'Tốt.',
      criteria: [],
      corrections: [],
      strengths: ['Rõ.'],
      priorities: ['Thêm chi tiết.'],
      improvedVersion:
        'This is a complete writing submission for the detail endpoint.',
      vocabularySuggestions: [],
      source: 'fallback',
      aiConsentAt: reviewedAt,
      aiConsentVersion: 'v1',
      reviewedAt,
    };
    prisma.writingSubmission.findFirst.mockResolvedValueOnce(stored);
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig(),
    );

    await expect(service.getOne('user-1', 'writing-1')).resolves.toMatchObject({
      id: 'writing-1',
      content: stored.content,
      aiConsentVersion: 'v1',
    });
    expect(prisma.writingSubmission.findFirst).toHaveBeenCalledWith({
      where: { id: 'writing-1', userId: 'user-1' },
    });

    prisma.writingSubmission.findFirst.mockResolvedValueOnce(null);
    await expect(service.getOne('user-2', 'writing-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('exports all full items for only the authenticated user', async () => {
    const prisma = createPrismaMock();
    const stored = {
      id: 'writing-1',
      userId: 'user-1',
      taskType: WritingTaskType.GENERAL,
      level: CourseLevel.A2,
      prompt: null,
      content: 'English helps me communicate with people around the world.',
      targetWords: null,
      wordCount: 9,
      overallScore: 70,
      cefrEstimate: CourseLevel.A2,
      summaryVi: 'Rõ ràng.',
      criteria: [],
      corrections: [],
      strengths: ['Rõ.'],
      priorities: ['Chi tiết.'],
      improvedVersion:
        'English helps me communicate with people around the world.',
      vocabularySuggestions: [],
      source: 'fallback',
      aiConsentAt: reviewedAt,
      aiConsentVersion: 'v1',
      reviewedAt,
    };
    prisma.writingSubmission.findMany.mockResolvedValue([stored]);
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig({ WRITING_RETENTION_DAYS: 90 }),
    );

    const result = await service.exportHistory('user-1');

    expect(prisma.writingSubmission.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: [{ reviewedAt: 'desc' }, { id: 'desc' }],
    });
    expect(result).toMatchObject({ retentionDays: 90 });
    expect(result.exportedAt).toBeInstanceOf(Date);
    expect(result.items[0]).toMatchObject({
      content: stored.content,
      aiConsentVersion: 'v1',
    });
  });

  it('deletes only owned records and reports not found for a foreign id', async () => {
    const prisma = createPrismaMock();
    prisma.writingSubmission.deleteMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 })
      .mockResolvedValueOnce({ count: 4 });
    const service = new WritingService(
      prisma as unknown as PrismaService,
      createConfig(),
    );

    await expect(service.deleteOne('user-1', 'writing-1')).resolves.toEqual({
      deletedCount: 1,
    });
    expect(prisma.writingSubmission.deleteMany).toHaveBeenNthCalledWith(1, {
      where: { id: 'writing-1', userId: 'user-1' },
    });
    await expect(
      service.deleteOne('user-2', 'writing-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(service.deleteAll('user-1')).resolves.toEqual({
      deletedCount: 4,
    });
    expect(prisma.writingSubmission.deleteMany).toHaveBeenNthCalledWith(3, {
      where: { userId: 'user-1' },
    });
  });

  it('returns a key-free policy disclosure', () => {
    const service = new WritingService(
      createPrismaMock() as unknown as PrismaService,
      createConfig({
        WRITING_RETENTION_DAYS: 180,
        OPENAI_API_KEY: 'server-secret',
        GEMINI_API_KEY: 'another-secret',
      }),
    );

    const policy = service.getPolicy();

    expect(policy).toEqual({
      retentionDays: 180,
      consentVersion: 'v1',
      configuredProviders: ['openai', 'gemini'],
      localFallbackAvailable: true,
    });
    expect(JSON.stringify(policy)).not.toContain('server-secret');
    expect(JSON.stringify(policy)).not.toContain('another-secret');
  });
});
