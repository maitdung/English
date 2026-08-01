// server/prisma/content/repository.ts

import {
  CourseLevel,
  CourseStatus,
  ExerciseType as PrismaExerciseType,
  LessonType,
  Prisma,
  PrismaClient,
} from '../../generated/prisma/client';

import { mapCourse, mapExercises, mapLesson, mapVocabulary } from './mapper';
import { ExternalLanguageApiService } from './services/external-language-api.service';
import type { Course, Lesson, VocabularyItem } from './types';

const CONTENT_UNIT_ORDER_INDEX = 99;
const CONTENT_UNIT_TITLE = 'Content Engine Lessons';
const CONTENT_UNIT_DESCRIPTION =
  'Production lessons imported from the Content Engine.';

export type PrismaTransactionClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

export interface ContentRepositoryOptions {
  verbose?: boolean;
  enableApiLogging?: boolean;
}

export interface ExistingContentStats {
  courses: number;
  units: number;
  lessons: number;
  vocabularies: number;
  exercises: number;
}

export interface ImportCourseResult {
  courseId: string;
  unitId: string;
  lessons: number;
  vocabularies: number;
  exercises: number;
}

export class ContentRepository {
  private readonly apiService: ExternalLanguageApiService;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly options: ContentRepositoryOptions = {},
  ) {
    this.apiService = new ExternalLanguageApiService(
      options.enableApiLogging ?? options.verbose ?? false,
    );
  }

  async getStats(): Promise<ExistingContentStats> {
    const [courses, units, lessons, vocabularies, exercises] =
      await Promise.all([
        this.prisma.course.count(),
        this.prisma.unit.count(),
        this.prisma.lesson.count(),
        this.prisma.vocabulary.count(),
        this.prisma.exercise.count(),
      ]);

    return {
      courses,
      units,
      lessons,
      vocabularies,
      exercises,
    };
  }

  async clearAll(): Promise<void> {
    this.log('Clearing existing content...');

    await this.prisma.$transaction(async (tx) => {
      await tx.exercise.deleteMany();
      await tx.vocabulary.deleteMany();
      await tx.lesson.deleteMany();
      await tx.unit.deleteMany();
      await tx.course.deleteMany();
    });

    this.log('Existing content cleared.');
  }

  async importCourse(course: Course): Promise<ImportCourseResult> {
    const enhancedCourse = await this.enhanceCourseVocabulary(course);

    return this.prisma.$transaction(
      async (tx) => {
        return this.importCourseWithTransaction(tx, enhancedCourse);
      },
      {
        timeout: 60_000,
        maxWait: 20_000,
      },
    );
  }

  async importCourseWithTransaction(
    tx: PrismaTransactionClient,
    course: Course,
  ): Promise<ImportCourseResult> {
    this.log(`Importing course: ${course.title}`);

    const dbCourse = await this.upsertCourse(tx, course);

    const dbUnit = await this.upsertContentUnit(tx, dbCourse.id);

    let lessonCount = 0;
    let vocabularyCount = 0;
    let exerciseCount = 0;

    for (const lesson of course.lessons) {
      const result = await this.upsertLesson(tx, dbUnit.id, lesson);

      lessonCount += 1;
      vocabularyCount += result.vocabularies;
      exerciseCount += result.exercises;
    }

    return {
      courseId: dbCourse.id,
      unitId: dbUnit.id,
      lessons: lessonCount,
      vocabularies: vocabularyCount,
      exercises: exerciseCount,
    };
  }

  private async upsertCourse(tx: PrismaTransactionClient, course: Course) {
    const mapped = mapCourse(course);

    return tx.course.upsert({
      where: {
        slug: mapped.slug,
      },
      create: {
        slug: mapped.slug,
        title: mapped.title,
        shortDescription: mapped.shortDescription,
        description: mapped.description,
        thumbnailUrl: mapped.thumbnailUrl,
        level: mapped.level as CourseLevel,
        status: mapped.status as CourseStatus,
        estimatedHours: mapped.estimatedHours,
        orderIndex: mapped.orderIndex,
        publishedAt: mapped.publishedAt,
      },
      update: {
        title: mapped.title,
        shortDescription: mapped.shortDescription,
        description: mapped.description,
        thumbnailUrl: mapped.thumbnailUrl,
        level: mapped.level as CourseLevel,
        status: mapped.status as CourseStatus,
        estimatedHours: mapped.estimatedHours,
        orderIndex: mapped.orderIndex,
        publishedAt: mapped.publishedAt,
      },
    });
  }

  private async upsertContentUnit(
    tx: PrismaTransactionClient,
    courseId: string,
  ) {
    const existingUnit = await tx.unit.findUnique({
      where: {
        courseId_orderIndex: {
          courseId,
          orderIndex: CONTENT_UNIT_ORDER_INDEX,
        },
      },
    });

    if (existingUnit) {
      return tx.unit.update({
        where: {
          id: existingUnit.id,
        },
        data: {
          title: CONTENT_UNIT_TITLE,
          description: CONTENT_UNIT_DESCRIPTION,
          orderIndex: CONTENT_UNIT_ORDER_INDEX,
        },
      });
    }

    return tx.unit.create({
      data: {
        courseId,
        title: CONTENT_UNIT_TITLE,
        description: CONTENT_UNIT_DESCRIPTION,
        orderIndex: CONTENT_UNIT_ORDER_INDEX,
      },
    });
  }

  private async upsertLesson(
    tx: PrismaTransactionClient,
    unitId: string,
    lesson: Lesson,
  ): Promise<{
    lessonId: string;
    vocabularies: number;
    exercises: number;
  }> {
    const mapped = mapLesson(unitId, lesson);

    this.log(
      `Importing lesson ${lesson.metadata.id}: ${lesson.metadata.title}`,
    );

    const existingLesson = await tx.lesson.findUnique({
      where: {
        unitId_slug: {
          unitId,
          slug: mapped.slug,
        },
      },
    });

    const lessonData = {
      title: mapped.title,
      description: mapped.description,
      type: mapped.type as LessonType,
      orderIndex: mapped.orderIndex,
      durationMinutes: mapped.durationMinutes,
      isFree: mapped.isFree,
      content: mapped.content as unknown as Prisma.InputJsonValue,
    };

    const dbLesson = existingLesson
      ? await tx.lesson.update({
          where: {
            id: existingLesson.id,
          },
          data: lessonData,
        })
      : await tx.lesson.create({
          data: {
            unitId,
            slug: mapped.slug,
            ...lessonData,
          },
        });

    await this.replaceLessonVocabulary(tx, dbLesson.id, lesson);

    await this.replaceLessonExercises(tx, dbLesson.id, lesson);

    return {
      lessonId: dbLesson.id,
      vocabularies: lesson.vocabulary.length,
      exercises: lesson.exercises.length,
    };
  }

  private async replaceLessonVocabulary(
    tx: PrismaTransactionClient,
    lessonId: string,
    lesson: Lesson,
  ): Promise<void> {
    await tx.vocabulary.deleteMany({
      where: {
        lessonId,
      },
    });

    const data = mapVocabulary(lessonId, lesson.vocabulary);

    if (data.length === 0) {
      return;
    }

    await tx.vocabulary.createMany({
      data,
    });
  }

  private async enhanceCourseVocabulary(course: Course): Promise<Course> {
    const lessons: Lesson[] = [];

    for (const lesson of course.lessons) {
      lessons.push({
        ...lesson,
        vocabulary: await this.enhanceVocabularyData(lesson.vocabulary),
      });
    }

    return {
      ...course,
      lessons,
    };
  }

  private async enhanceVocabularyData(
    vocabulary: VocabularyItem[],
  ): Promise<VocabularyItem[]> {
    if (
      vocabulary.length === 0 ||
      process.env.ENABLE_VOCABULARY_ENRICHMENT !== 'true' ||
      process.env.DISABLE_VOCABULARY_ENRICHMENT === 'true'
    ) {
      return vocabulary;
    }

    try {
      const enhanced = await this.apiService.enhanceVocabularyBatch(
        vocabulary,
        5,
      );

      this.log(
        `Processed ${vocabulary.length} vocabulary items with external APIs.`,
      );

      return enhanced;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.warn(
        `[ContentRepository] Vocabulary enhancement failed; using original data: ${message}`,
      );

      return vocabulary;
    }
  }

  private async replaceLessonExercises(
    tx: PrismaTransactionClient,
    lessonId: string,
    lesson: Lesson,
  ): Promise<void> {
    await tx.exercise.deleteMany({
      where: {
        lessonId,
      },
    });

    const data = mapExercises(lessonId, lesson.exercises).map((exercise) => ({
      lessonId: exercise.lessonId,
      type: exercise.type as PrismaExerciseType,
      question: exercise.question,
      instructions: exercise.instructions,
      options:
        exercise.options === null
          ? Prisma.JsonNull
          : (exercise.options as Prisma.InputJsonValue),
      correctAnswer: exercise.correctAnswer as Prisma.InputJsonValue,
      explanation: exercise.explanation,
      points: exercise.points,
      orderIndex: exercise.orderIndex,
    }));

    if (data.length === 0) {
      return;
    }

    await tx.exercise.createMany({
      data,
    });
  }

  async findCourseBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: {
        slug,
      },
      include: {
        units: {
          orderBy: {
            orderIndex: 'asc',
          },
          include: {
            lessons: {
              orderBy: {
                orderIndex: 'asc',
              },
              include: {
                vocabularies: {
                  orderBy: {
                    orderIndex: 'asc',
                  },
                },
                exercises: {
                  orderBy: {
                    orderIndex: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findLessonBySlug(courseSlug: string, lessonSlug: string) {
    return this.prisma.lesson.findFirst({
      where: {
        slug: lessonSlug,
        unit: {
          course: {
            slug: courseSlug,
          },
        },
      },
      include: {
        unit: {
          include: {
            course: true,
          },
        },
        vocabularies: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        exercises: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });
  }

  async assertCourseDoesNotHaveBrokenOrdering(
    courseSlug: string,
  ): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: {
        slug: courseSlug,
      },
      include: {
        units: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return;
    }

    for (const unit of course.units) {
      const seenOrderIndexes = new Set<number>();

      for (const lesson of unit.lessons) {
        if (seenOrderIndexes.has(lesson.orderIndex)) {
          throw new Error(
            `Duplicate lesson orderIndex ${lesson.orderIndex} in unit ${unit.id}.`,
          );
        }

        seenOrderIndexes.add(lesson.orderIndex);
      }
    }
  }

  async publishCourse(slug: string): Promise<void> {
    await this.prisma.course.update({
      where: {
        slug,
      },
      data: {
        status: CourseStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }

  async archiveCourse(slug: string): Promise<void> {
    await this.prisma.course.update({
      where: {
        slug,
      },
      data: {
        status: CourseStatus.ARCHIVED,
      },
    });
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[ContentRepository] ${message}`);
    }
  }
}

export function createContentRepository(
  prisma: PrismaClient,
  options?: ContentRepositoryOptions,
): ContentRepository {
  return new ContentRepository(prisma, options);
}
