import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { WritingRetentionService } from './writing-retention.service';

function createConfig(values: Record<string, unknown>): ConfigService {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) =>
      values[key] === undefined ? defaultValue : values[key],
    ),
  } as unknown as ConfigService;
}

describe('WritingRetentionService', () => {
  it('deletes globally expired submissions using the configured cutoff', async () => {
    const deleteMany = jest.fn().mockResolvedValue({ count: 3 });
    const prisma = { writingSubmission: { deleteMany } };
    const service = new WritingRetentionService(
      prisma as unknown as PrismaService,
      createConfig({ WRITING_RETENTION_DAYS: 30 }),
    );
    const now = new Date('2026-08-13T12:00:00.000Z');

    await expect(service.cleanupExpired(now)).resolves.toBe(3);
    expect(deleteMany).toHaveBeenCalledWith({
      where: {
        reviewedAt: { lt: new Date('2026-07-14T12:00:00.000Z') },
      },
    });
  });

  it('does not automatically mutate the database in test environments', async () => {
    const deleteMany = jest.fn();
    const service = new WritingRetentionService(
      { writingSubmission: { deleteMany } } as unknown as PrismaService,
      createConfig({ NODE_ENV: 'test' }),
    );

    await service.onModuleInit();
    service.onModuleDestroy();

    expect(deleteMany).not.toHaveBeenCalled();
  });
});
