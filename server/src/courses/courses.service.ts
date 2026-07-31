import { Injectable, NotFoundException } from '@nestjs/common';

import {
  CourseStatus,
  ExerciseType,
  Prisma,
} from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CourseQueryDto } from './dto/course-query.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CourseQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      status: CourseStatus.PUBLISHED,
    };

    if (query.level) {
      where.level = query.level;
    }

    if (query.search?.trim()) {
      const search = query.search.trim();

      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          shortDescription: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            orderIndex: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        select: {
          id: true,
          slug: true,
          title: true,
          shortDescription: true,
          thumbnailUrl: true,
          level: true,
          estimatedHours: true,
          publishedAt: true,
          _count: {
            select: {
              units: true,
            },
          },
          units: {
            select: {
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.course.count({
        where,
      }),
    ]);

    const data = courses.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      shortDescription: course.shortDescription,
      thumbnailUrl: course.thumbnailUrl,
      level: course.level,
      estimatedHours: course.estimatedHours,
      publishedAt: course.publishedAt,
      unitCount: course._count.units,
      lessonCount: course.units.reduce(
        (totalLessons, unit) => totalLessons + unit._count.lessons,
        0,
      ),
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        slug,
        status: CourseStatus.PUBLISHED,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        description: true,
        thumbnailUrl: true,
        level: true,
        estimatedHours: true,
        publishedAt: true,
        units: {
          orderBy: {
            orderIndex: 'asc',
          },
          select: {
            id: true,
            title: true,
            description: true,
            orderIndex: true,
            lessons: {
              orderBy: {
                orderIndex: 'asc',
              },
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                type: true,
                orderIndex: true,
                durationMinutes: true,
                isFree: true,
                _count: {
                  select: {
                    vocabularies: true,
                    exercises: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Không tìm thấy khóa học.');
    }

    return {
      ...course,
      units: course.units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((lesson) => ({
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          type: lesson.type,
          orderIndex: lesson.orderIndex,
          durationMinutes: lesson.durationMinutes,
          isFree: lesson.isFree,
          vocabularyCount: lesson._count.vocabularies,
          exerciseCount: lesson._count.exercises,
        })),
      })),
    };
  }

  async findLesson(courseSlug: string, lessonSlug: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        unit: {
          course: {
            slug: courseSlug,
            status: CourseStatus.PUBLISHED,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        type: true,
        durationMinutes: true,
        isFree: true,
        content: true,
        unit: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
            course: {
              select: {
                id: true,
                slug: true,
                title: true,
                level: true,
              },
            },
          },
        },
        vocabularies: {
          orderBy: {
            orderIndex: 'asc',
          },
          select: {
            id: true,
            word: true,
            phonetic: true,
            partOfSpeech: true,
            meaning: true,
            example: true,
            exampleTranslation: true,
            audioUrl: true,
            imageUrl: true,
            orderIndex: true,
          },
        },
        exercises: {
          orderBy: {
            orderIndex: 'asc',
          },
          select: {
            id: true,
            type: true,
            question: true,
            instructions: true,
            options: true,
            points: true,
            orderIndex: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học.');
    }

    return lesson;
  }

  async checkExercise(
    courseSlug: string,
    lessonSlug: string,
    exerciseId: string,
    submittedAnswer: unknown,
  ) {
    const exercise = await this.prisma.exercise.findFirst({
      where: {
        id: exerciseId,
        lesson: {
          slug: lessonSlug,
          unit: {
            course: {
              slug: courseSlug,
              status: CourseStatus.PUBLISHED,
            },
          },
        },
      },
      select: {
        type: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        points: true,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Không tìm thấy bài tập.');
    }

    const isCorrect = this.answersMatch(
      exercise.correctAnswer,
      submittedAnswer,
      exercise.type === ExerciseType.MULTIPLE_CHOICE
        ? exercise.options
        : undefined,
    );

    return {
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      pointsEarned: isCorrect ? exercise.points : 0,
      maxPoints: exercise.points,
    };
  }

  private answersMatch(
    expected: unknown,
    submitted: unknown,
    multipleChoiceOptions?: unknown,
  ): boolean {
    if (Array.isArray(multipleChoiceOptions)) {
      const expectedOption = this.resolveMultipleChoiceAnswer(
        expected,
        multipleChoiceOptions,
      );
      const submittedOption = this.resolveMultipleChoiceAnswer(
        submitted,
        multipleChoiceOptions,
      );

      return (
        this.normalizeAnswerValue(expectedOption) ===
        this.normalizeAnswerValue(submittedOption)
      );
    }

    if (Array.isArray(expected)) {
      const submittedValue = Array.isArray(submitted)
        ? submitted.join(' ')
        : submitted;

      return (
        this.normalizeAnswerValue(expected.join(' ')) ===
        this.normalizeAnswerValue(submittedValue)
      );
    }

    return (
      this.normalizeAnswerValue(expected) ===
      this.normalizeAnswerValue(submitted)
    );
  }

  private resolveMultipleChoiceAnswer(
    answer: unknown,
    options: unknown[],
  ): unknown {
    const optionIndex =
      typeof answer === 'number' && Number.isInteger(answer)
        ? answer
        : typeof answer === 'string' && /^\d+$/.test(answer.trim())
          ? Number.parseInt(answer.trim(), 10)
          : null;

    if (
      optionIndex !== null &&
      optionIndex >= 0 &&
      optionIndex < options.length
    ) {
      return options[optionIndex];
    }

    return answer;
  }

  private normalizeAnswerValue(value: unknown): string {
    if (typeof value === 'string') {
      return value
        .normalize('NFKC')
        .trim()
        .replace(/[‘’]/g, "'")
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .toLocaleLowerCase('en-US');
    }

    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      return String(value);
    }

    return JSON.stringify(value) ?? '';
  }
}
