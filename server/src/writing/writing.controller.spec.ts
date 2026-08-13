import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ThrottlerGuard } from '@nestjs/throttler';

import { CourseLevel, UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WritingTaskType } from './dto/review-writing.dto';
import { WritingController } from './writing.controller';
import { WritingService } from './writing.service';

describe('WritingController', () => {
  const writingService = {
    review: jest.fn(),
    getHistory: jest.fn(),
    getPolicy: jest.fn(),
    getOne: jest.fn(),
    exportHistory: jest.fn(),
    deleteOne: jest.fn(),
    deleteAll: jest.fn(),
  };
  const controller = new WritingController(
    writingService as unknown as WritingService,
  );
  const user = {
    sub: 'user-1',
    email: 'student@example.com',
    role: UserRole.STUDENT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('protects all writing routes with JWT and throttling', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      WritingController,
    ) as unknown[];

    expect(guards).toEqual(
      expect.arrayContaining([JwtAuthGuard, ThrottlerGuard]),
    );
  });

  it('passes the authenticated user id to review', async () => {
    const dto = {
      consent: true as const,
      taskType: WritingTaskType.GENERAL,
      level: CourseLevel.A2,
      content: 'Learning English helps me speak with people from many places.',
    };
    writingService.review.mockResolvedValue({ id: 'writing-1' });

    await controller.review(user, dto);

    expect(writingService.review).toHaveBeenCalledWith('user-1', dto);
  });

  it('passes the authenticated user id and pagination to history', async () => {
    const query = { limit: 20, offset: 0 };
    writingService.getHistory.mockResolvedValue({
      items: [],
      total: 0,
      ...query,
    });

    await controller.history(user, query);

    expect(writingService.getHistory).toHaveBeenCalledWith('user-1', query);
  });

  it('returns policy without requiring a user identifier', () => {
    writingService.getPolicy.mockReturnValue({
      retentionDays: 365,
      consentVersion: 'v1',
      configuredProviders: ['openai'],
      localFallbackAvailable: true,
    });

    controller.policy();

    expect(writingService.getPolicy).toHaveBeenCalledWith();
  });

  it('scopes detail and export requests to the authenticated user', async () => {
    writingService.getOne.mockResolvedValue({ id: 'writing-1' });
    writingService.exportHistory.mockResolvedValue({ items: [] });

    await controller.detail(user, 'f997227a-5234-4aa5-9bd8-d35b0750752e');
    await controller.export(user);

    expect(writingService.getOne).toHaveBeenCalledWith(
      'user-1',
      'f997227a-5234-4aa5-9bd8-d35b0750752e',
    );
    expect(writingService.exportHistory).toHaveBeenCalledWith('user-1');
  });

  it('scopes single and bulk deletion to the authenticated user', async () => {
    writingService.deleteOne.mockResolvedValue({ deletedCount: 1 });
    writingService.deleteAll.mockResolvedValue({ deletedCount: 2 });

    await controller.deleteOne(user, 'f997227a-5234-4aa5-9bd8-d35b0750752e');
    await controller.deleteAll(user);

    expect(writingService.deleteOne).toHaveBeenCalledWith(
      'user-1',
      'f997227a-5234-4aa5-9bd8-d35b0750752e',
    );
    expect(writingService.deleteAll).toHaveBeenCalledWith('user-1');
  });
});
