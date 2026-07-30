import {
  Injectable,
  Logger,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { PrismaService } from '../prisma/prisma.service';

export type ServiceHealthStatus = 'up' | 'down';

export interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
  uptimeSeconds: number;
  dependencies: {
    postgres: ServiceHealthStatus;
    redis: ServiceHealthStatus;
  };
}

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly logger = new Logger(HealthService.name);
  private readonly redis: Redis;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      enableOfflineQueue: false,
    });

    this.redis.on('error', (error: Error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async check(): Promise<HealthResponse> {
    const [postgres, redis] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
    ]);

    const response: HealthResponse = {
      status: postgres === 'up' && redis === 'up' ? 'ok' : 'error',
      service: 'mtd-lingo-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dependencies: {
        postgres,
        redis,
      },
    };

    if (response.status === 'error') {
      throw new ServiceUnavailableException(response);
    }

    return response;
  }

  onModuleDestroy(): void {
    if (this.redis.status !== 'end') {
      this.redis.disconnect();
    }
  }

  private async checkPostgres(): Promise<ServiceHealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch (error) {
      this.logger.error(
        `PostgreSQL health check thất bại: ${this.getErrorMessage(error)}`,
      );
      return 'down';
    }
  }

  private async checkRedis(): Promise<ServiceHealthStatus> {
    try {
      if (this.redis.status === 'wait') {
        await this.redis.connect();
      }

      const result = await this.redis.ping();

      return result === 'PONG' ? 'up' : 'down';
    } catch (error) {
      this.logger.error(
        `Redis health check thất bại: ${this.getErrorMessage(error)}`,
      );
      return 'down';
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}
