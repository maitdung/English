import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1_000;

@Injectable()
export class WritingRetentionService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WritingRetentionService.name);
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') === 'test') {
      return;
    }

    await this.runCleanupSafely();
    this.cleanupTimer = setInterval(() => {
      void this.runCleanupSafely();
    }, CLEANUP_INTERVAL_MS);
    this.cleanupTimer.unref();
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  async cleanupExpired(now = new Date()): Promise<number> {
    const retentionDays = this.configService.get<number>(
      'WRITING_RETENTION_DAYS',
      365,
    );
    const cutoff = new Date(
      now.getTime() - retentionDays * 24 * 60 * 60 * 1_000,
    );
    const result = await this.prisma.writingSubmission.deleteMany({
      where: { reviewedAt: { lt: cutoff } },
    });

    return result.count;
  }

  private async runCleanupSafely(): Promise<void> {
    try {
      const deletedCount = await this.cleanupExpired();
      if (deletedCount > 0) {
        this.logger.log(
          `Writing retention cleanup removed ${deletedCount} expired submissions.`,
        );
      }
    } catch {
      this.logger.error(
        'Writing retention cleanup failed; it will retry on the next schedule.',
      );
    }
  }
}
