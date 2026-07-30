// server/prisma/content/exporter.ts

import {
  PrismaClient,
  ExerciseType as PrismaExerciseType,
} from '../../generated/prisma/client';

import {
  Course,
  Lesson,
  LessonCategory,
  LessonMetadata,
  Exercise,
  ExerciseType,
  VocabularyItem,
} from './types';

export interface ContentExportOptions {
  verbose?: boolean;
  includeDraftCourses?: boolean;
  includeArchivedCourses?: boolean;
}

export interface ExportedCourseSummary {
  slug: string;
  title: string;
  level: string;
  lessons: number;
  vocabularies: number;
  exercises: number;
}

export interface ContentExportResult {
  exportedAt: Date;
  courses: Course[];
  summary: ExportedCourseSummary[];
}

interface StoredLessonContent {
  objectives?: string[];
  dialogue?: Lesson['dialogue'];
  grammar?: Lesson['grammar'];
  reading?: Lesson['reading'];
  listening?: Lesson['listening'];
  speaking?: Lesson['speaking'];
  writing?: Lesson['writing'];
}

type DbCourseWithContent = Awaited<
  ReturnType<ContentExporter['findCourseBySlug']>
>;

type DbLesson =
  NonNullable<DbCourseWithContent>['units'][number]['lessons'][number];

export class ContentExportError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ContentExportError';
  }
}

export class ContentExporter {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly options: ContentExportOptions = {},
  ) {}

  async exportAllCourses(): Promise<ContentExportResult> {
    const exportedAt = new Date();

    const courses = await this.prisma.course.findMany({
      where: {
        ...(this.options.includeDraftCourses
          ? {}
          : {
              status: {
                not: 'DRAFT',
              },
            }),
        ...(this.options.includeArchivedCourses
          ? {}
          : {
              status: {
                not: 'ARCHIVED',
              },
            }),
      },
      orderBy: [
        {
          orderIndex: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
      include: this.courseInclude(),
    });

    const exportedCourses = courses.map((course) =>
      this.mapCourseFromDb(course),
    );

    const result: ContentExportResult = {
      exportedAt,
      courses: exportedCourses,
      summary: exportedCourses.map((course) => ({
        slug: course.id,
        title: course.title,
        level: course.level,
        lessons: course.lessons.length,
        vocabularies: course.lessons.reduce(
          (total, lesson) => total + lesson.vocabulary.length,
          0,
        ),
        exercises: course.lessons.reduce(
          (total, lesson) => total + lesson.exercises.length,
          0,
        ),
      })),
    };

    this.printSummary(result);

    return result;
  }

  async exportCourseBySlug(slug: string): Promise<Course> {
    const course = await this.findCourseBySlug(slug);

    if (!course) {
      throw new ContentExportError(`Course not found: ${slug}`);
    }

    return this.mapCourseFromDb(course);
  }

  async findCourseBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: {
        slug,
      },
      include: this.courseInclude(),
    });
  }

  private courseInclude() {
    return {
      units: {
        orderBy: {
          orderIndex: 'asc' as const,
        },
        include: {
          lessons: {
            orderBy: {
              orderIndex: 'asc' as const,
            },
            include: {
              vocabularies: {
                orderBy: {
                  orderIndex: 'asc' as const,
                },
              },
              exercises: {
                orderBy: {
                  orderIndex: 'asc' as const,
                },
              },
            },
          },
        },
      },
    };
  }

  private mapCourseFromDb(course: NonNullable<DbCourseWithContent>): Course {
    const lessons = course.units.flatMap((unit) =>
      unit.lessons.map((lesson) =>
        this.mapLessonFromDb(course.slug, course.level, lesson),
      ),
    );

    return {
      id: course.slug,
      level: course.level,
      title: course.title,
      description: course.description ?? course.shortDescription ?? '',
      lessons,
    };
  }

  private mapLessonFromDb(
    courseSlug: string,
    level: Course['level'],
    lesson: DbLesson,
  ): Lesson {
    const content = this.parseLessonContent(courseSlug, lesson);

    const metadata: LessonMetadata = {
      id: lesson.orderIndex,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description ?? '',
      level,
      category: this.mapLessonTypeToCategory(lesson.type),
      estimatedMinutes: lesson.durationMinutes,
      tags: [],
    };

    return {
      metadata,
      objectives: content.objectives ?? [],
      vocabulary: lesson.vocabularies.map((item): VocabularyItem => {
        return {
          word: item.word,
          ipa: item.phonetic ?? '',
          type: item.partOfSpeech ?? '',
          meaning: item.meaning,
          example: item.example ?? '',
          exampleTranslation: item.exampleTranslation ?? '',
        };
      }),
      dialogue: content.dialogue ?? {
        title: '',
        lines: [],
      },
      grammar: content.grammar ?? [],
      reading: content.reading ?? {
        title: '',
        passage: '',
        translation: '',
        questions: [],
      },
      listening: content.listening ?? {
        transcript: '',
        questions: [],
      },
      speaking: content.speaking ?? [],
      writing: content.writing ?? [],
      exercises: lesson.exercises.map((exercise): Exercise => {
        return {
          id: `${lesson.slug}-exercise-${exercise.orderIndex}`,
          type: this.mapPrismaExerciseType(exercise.type),
          question: exercise.question,
          options: this.parseStringArray(exercise.options),
          answer: this.parseAnswer(exercise.correctAnswer),
          explanation: exercise.explanation ?? undefined,
        };
      }),
    };
  }

  private parseLessonContent(
    courseSlug: string,
    lesson: DbLesson,
  ): StoredLessonContent {
    if (!lesson.content) {
      return {};
    }

    if (typeof lesson.content !== 'object') {
      throw new ContentExportError(
        `${courseSlug}/${lesson.slug}: lesson.content must be an object.`,
      );
    }

    return lesson.content as StoredLessonContent;
  }

  private parseStringArray(value: unknown): string[] | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      return undefined;
    }

    return value.map((item) => String(item));
  }

  private parseAnswer(value: unknown): Exercise['answer'] {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    }

    return JSON.stringify(value);
  }

  private mapLessonTypeToCategory(type: string): LessonCategory {
    switch (type) {
      case 'VOCABULARY':
        return 'vocabulary';

      case 'GRAMMAR':
        return 'grammar';

      case 'READING':
        return 'reading';

      case 'LISTENING':
        return 'listening';

      case 'SPEAKING':
        return 'speaking';

      case 'WRITING':
        return 'writing';

      case 'QUIZ':
        return 'mixed';

      default:
        return 'mixed';
    }
  }

  private mapPrismaExerciseType(type: PrismaExerciseType): ExerciseType {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'multiple-choice';

      case 'FILL_BLANK':
        return 'fill-blank';

      case 'MATCHING':
        return 'matching';

      case 'SENTENCE_ORDER':
        return 'ordering';

      case 'TRUE_FALSE':
        return 'true-false';

      default:
        return 'multiple-choice';
    }
  }

  private printSummary(result: ContentExportResult): void {
    if (!this.options.verbose) return;

    console.log('');
    console.log('--------------------------------');
    console.log('Content Export Summary');
    console.log('--------------------------------');

    console.table(result.summary);

    console.log('');
  }
}

export async function exportAllCourses(
  prisma: PrismaClient,
  options: ContentExportOptions = {},
): Promise<ContentExportResult> {
  const exporter = new ContentExporter(prisma, options);

  return exporter.exportAllCourses();
}

export async function exportCourseBySlug(
  prisma: PrismaClient,
  slug: string,
  options: ContentExportOptions = {},
): Promise<Course> {
  const exporter = new ContentExporter(prisma, options);

  return exporter.exportCourseBySlug(slug);
}
