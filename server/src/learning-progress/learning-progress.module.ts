import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LearningProgressController } from './learning-progress.controller';
import { LearningProgressService } from './learning-progress.service';

@Module({
  imports: [PrismaModule, CoursesModule],
  controllers: [LearningProgressController],
  providers: [LearningProgressService],
})
export class LearningProgressModule {}
