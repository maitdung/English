import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
import { CreateExerciseAttemptDto } from './dto/create-exercise-attempt.dto';
import { ReviewVocabularyDto } from './dto/review-vocabulary.dto';
import { LearningProgressService } from './learning-progress.service';

@ApiTags('Learning Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('learning-progress')
export class LearningProgressController {
  constructor(
    private readonly learningProgressService: LearningProgressService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Lấy tổng quan tiến độ học của người dùng' })
  @ApiOkResponse({ description: 'Tổng quan tiến độ.' })
  me(@CurrentUser() user: JwtPayload) {
    return this.learningProgressService.getMe(user.sub);
  }

  @Post('courses/:courseSlug/enroll')
  @ApiOperation({ summary: 'Đăng ký học một khóa' })
  @ApiCreatedResponse({ description: 'Đã đăng ký khóa học.' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy khóa học.' })
  enroll(
    @CurrentUser() user: JwtPayload,
    @Param('courseSlug') courseSlug: string,
  ) {
    return this.learningProgressService.enrollCourse(user.sub, courseSlug);
  }

  @Post('courses/:courseSlug/lessons/:lessonSlug/complete')
  @ApiOperation({ summary: 'Đánh dấu hoàn thành bài học' })
  @ApiCreatedResponse({ description: 'Đã lưu tiến độ bài học.' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bài học.' })
  completeLesson(
    @CurrentUser() user: JwtPayload,
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @Body() dto: CompleteLessonDto,
  ) {
    return this.learningProgressService.completeLesson(
      user.sub,
      courseSlug,
      lessonSlug,
      dto,
    );
  }

  @Post('courses/:courseSlug/lessons/:lessonSlug/exercises/:exerciseId/attempt')
  @ApiOperation({ summary: 'Lưu lần làm bài tập' })
  @ApiCreatedResponse({ description: 'Đã lưu attempt.' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy bài tập.' })
  attemptExercise(
    @CurrentUser() user: JwtPayload,
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: CreateExerciseAttemptDto,
  ) {
    return this.learningProgressService.recordExerciseAttempt(
      user.sub,
      courseSlug,
      lessonSlug,
      exerciseId,
      dto.answer,
    );
  }

  @Post('vocabularies/:vocabularyId/review')
  @ApiOperation({ summary: 'Lưu lần ôn từ vựng' })
  @ApiCreatedResponse({ description: 'Đã lưu lần ôn.' })
  reviewVocabulary(
    @CurrentUser() user: JwtPayload,
    @Param('vocabularyId') vocabularyId: string,
    @Body() dto: ReviewVocabularyDto,
  ) {
    return this.learningProgressService.reviewVocabulary(
      user.sub,
      vocabularyId,
      dto.score ?? 100,
    );
  }
}
