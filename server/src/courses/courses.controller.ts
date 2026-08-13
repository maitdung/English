import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CheckExerciseDto } from './dto/check-exercise.dto';
import { CourseQueryDto } from './dto/course-query.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách khóa học đã xuất bản',
  })
  @ApiOkResponse({
    description: 'Danh sách khóa học có phân trang.',
  })
  findAll(@Query() query: CourseQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Lấy chi tiết khóa học, unit và bài học',
  })
  @ApiParam({
    name: 'slug',
    example: 'english-a1-foundations',
  })
  @ApiOkResponse({
    description: 'Chi tiết khóa học.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy khóa học.',
  })
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findOne(slug);
  }

  @Get(':courseSlug/lessons/:lessonSlug')
  @ApiOperation({
    summary: 'Lấy nội dung một bài học',
  })
  @ApiOkResponse({
    description: 'Nội dung, từ vựng và bài tập của bài học.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy bài học.',
  })
  findLesson(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
  ) {
    return this.coursesService.findLesson(courseSlug, lessonSlug);
  }

  @Post(':courseSlug/lessons/:lessonSlug/exercises/:exerciseId/check')
  @ApiOperation({
    summary: 'Kiểm tra đáp án một bài tập và trả phản hồi',
  })
  @ApiOkResponse({
    description: 'Kết quả, đáp án đúng, giải thích và điểm nhận được.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy bài học hoặc bài tập.',
  })
  checkExercise(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: CheckExerciseDto,
  ) {
    return this.coursesService.checkExercise(
      courseSlug,
      lessonSlug,
      exerciseId,
      dto.answer,
    );
  }
}
