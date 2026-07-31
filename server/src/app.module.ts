import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { CoursesModule } from './courses/courses.module';
import { HealthModule } from './health/health.module';
import { LearningProgressModule } from './learning-progress/learning-progress.module';
import { PrismaModule } from './prisma/prisma.module';
import { validateEnv } from './config/env.validation';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 60,
      },
    ]),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    AdminSettingsModule,
    CoursesModule,
    LearningProgressModule,
  ],
})
export class AppModule {}
