// server/prisma/content/importer.ts

import { PrismaClient } from '../../generated/prisma/client';

import { Course, Lesson } from './types';
import { validator, ValidationError } from './validator';
import { normalizeLesson, sortLessons } from './utils';
import {
  ContentRepository,
  createContentRepository,
  ExistingContentStats,
  ImportCourseResult,
} from './repository';

export interface ContentImportOptions {
  validate?: boolean;
  clearExisting?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

export interface ContentImportSummary {
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;

  dryRun: boolean;
  validated: boolean;
  clearedExisting: boolean;

  before?: ExistingContentStats;
  after?: ExistingContentStats;

  courses: number;
  units: number;
  lessons: number;
  vocabularies: number;
  exercises: number;

  importedCourses: {
    courseId: string;
    unitId: string;
    slug: string;
    title: string;
    level: string;
    lessons: number;
    vocabularies: number;
    exercises: number;
  }[];

  warnings: string[];
}

export class ContentImportError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ContentImportError';
  }
}

export class ContentImporter {
  private readonly repository: ContentRepository;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly options: ContentImportOptions = {},
  ) {
    this.repository = createContentRepository(prisma, {
      verbose: options.verbose,
    });
  }

  async importCourses(courses: Course[]): Promise<ContentImportSummary> {
    const startedAt = new Date();

    const summary: ContentImportSummary = {
      startedAt,
      finishedAt: startedAt,
      durationMs: 0,

      dryRun: this.options.dryRun ?? false,
      validated: this.options.validate !== false,
      clearedExisting: this.options.clearExisting ?? false,

      courses: 0,
      units: 0,
      lessons: 0,
      vocabularies: 0,
      exercises: 0,

      importedCourses: [],
      warnings: [],
    };

    try {
      this.assertCoursesNotEmpty(courses);

      const normalizedCourses = courses.map((course) =>
        this.normalizeCourse(course),
      );

      if (this.options.validate !== false) {
        this.validateCourses(normalizedCourses);
      }

      this.assertNoDuplicateCourseSlugs(normalizedCourses);

      summary.before = await this.repository.getStats();

      if (this.options.dryRun) {
        this.log('Dry run enabled. No database changes will be made.');

        for (const course of normalizedCourses) {
          summary.courses += 1;
          summary.units += 1;
          summary.lessons += course.lessons.length;
          summary.vocabularies += course.lessons.reduce(
            (total, lesson) => total + lesson.vocabulary.length,
            0,
          );
          summary.exercises += course.lessons.reduce(
            (total, lesson) => total + lesson.exercises.length,
            0,
          );

          summary.importedCourses.push({
            courseId: 'dry-run',
            unitId: 'dry-run',
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
          });
        }

        summary.after = summary.before;
        return this.finishSummary(summary);
      }

      if (this.options.clearExisting) {
        await this.repository.clearAll();
      }

      for (const course of normalizedCourses) {
        const result = await this.importSingleCourse(course);

        summary.courses += 1;
        summary.units += 1;
        summary.lessons += result.lessons;
        summary.vocabularies += result.vocabularies;
        summary.exercises += result.exercises;

        summary.importedCourses.push({
          courseId: result.courseId,
          unitId: result.unitId,
          slug: course.id,
          title: course.title,
          level: course.level,
          lessons: result.lessons,
          vocabularies: result.vocabularies,
          exercises: result.exercises,
        });

        await this.repository.assertCourseDoesNotHaveBrokenOrdering(course.id);
      }

      summary.after = await this.repository.getStats();

      return this.finishSummary(summary);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ContentImportError('Content import failed.', error);
    }
  }

  async importCourse(course: Course): Promise<ContentImportSummary> {
    return this.importCourses([course]);
  }

  private async importSingleCourse(
    course: Course,
  ): Promise<ImportCourseResult> {
    this.log(`Import course: ${course.title}`);

    const result = await this.repository.importCourse(course);

    this.log(
      `Imported ${course.title}: ${result.lessons} lessons, ${result.vocabularies} vocabularies, ${result.exercises} exercises.`,
    );

    return result;
  }

  private normalizeCourse(course: Course): Course {
    return {
      ...course,
      id: course.id.trim().toLowerCase(),
      title: course.title.trim(),
      description: course.description.trim(),
      lessons: sortLessons(course.lessons).map((lesson) =>
        normalizeLesson({
          ...lesson,
          metadata: {
            ...lesson.metadata,
            level: course.level,
          },
        }),
      ),
    };
  }

  private validateCourses(courses: Course[]): void {
    for (const course of courses) {
      validator.validateCourse(course);
      this.validateProductionQuality(course);
    }
  }

  private validateProductionQuality(course: Course): void {
    const warnings: string[] = [];

    if (course.lessons.length < 1) {
      warnings.push(`Course ${course.id} has no lessons.`);
    }

    for (const lesson of course.lessons) {
      this.assertLessonLooksLikeBookContent(course, lesson);
    }

    if (warnings.length > 0) {
      throw new ContentImportError(warnings.join('\n'));
    }
  }

  private assertLessonLooksLikeBookContent(
    course: Course,
    lesson: Lesson,
  ): void {
    const prefix = `${course.id}/${lesson.metadata.slug}`;

    if (lesson.metadata.title.length < 5) {
      throw new ContentImportError(`${prefix}: Lesson title is too short.`);
    }

    if (lesson.metadata.description.length < 20) {
      throw new ContentImportError(
        `${prefix}: Lesson description is too short.`,
      );
    }

    if (lesson.objectives.some((item) => item.length < 10)) {
      throw new ContentImportError(
        `${prefix}: Every objective should be meaningful.`,
      );
    }

    if (lesson.reading.passage.length < 250) {
      throw new ContentImportError(
        `${prefix}: Reading passage is too short. Make it feel like a real book lesson.`,
      );
    }

    if (lesson.listening.transcript.length < 120) {
      throw new ContentImportError(
        `${prefix}: Listening transcript is too short.`,
      );
    }

    if (lesson.vocabulary.length < 10) {
      throw new ContentImportError(
        `${prefix}: Lesson needs at least 10 vocabulary items.`,
      );
    }

    if (lesson.exercises.length < 10) {
      throw new ContentImportError(
        `${prefix}: Lesson needs at least 10 exercises.`,
      );
    }

    const emptyExamples = lesson.vocabulary.filter(
      (item) => !item.example || !item.exampleTranslation,
    );

    if (emptyExamples.length > 0) {
      throw new ContentImportError(
        `${prefix}: Vocabulary examples and translations are required.`,
      );
    }

    const exerciseIds = new Set<string>();

    for (const exercise of lesson.exercises) {
      if (exerciseIds.has(exercise.id)) {
        throw new ContentImportError(
          `${prefix}: Duplicate exercise id ${exercise.id}.`,
        );
      }

      exerciseIds.add(exercise.id);

      if (!exercise.explanation || exercise.explanation.length < 8) {
        throw new ContentImportError(
          `${prefix}: Exercise ${exercise.id} needs a useful explanation.`,
        );
      }
    }
  }

  private assertCoursesNotEmpty(courses: Course[]): void {
    if (!courses.length) {
      throw new ContentImportError('No courses provided for import.');
    }
  }

  private assertNoDuplicateCourseSlugs(courses: Course[]): void {
    const seen = new Set<string>();

    for (const course of courses) {
      if (seen.has(course.id)) {
        throw new ContentImportError(`Duplicate course id: ${course.id}`);
      }

      seen.add(course.id);
    }
  }

  private finishSummary(summary: ContentImportSummary): ContentImportSummary {
    const finishedAt = new Date();

    summary.finishedAt = finishedAt;
    summary.durationMs = finishedAt.getTime() - summary.startedAt.getTime();

    this.printSummary(summary);

    return summary;
  }

  private printSummary(summary: ContentImportSummary): void {
    if (!this.options.verbose) return;

    console.log('');
    console.log('--------------------------------');
    console.log('Content Import Summary');
    console.log('--------------------------------');
    console.log(`Dry run: ${summary.dryRun ? 'yes' : 'no'}`);
    console.log(`Validated: ${summary.validated ? 'yes' : 'no'}`);
    console.log(`Cleared existing: ${summary.clearedExisting ? 'yes' : 'no'}`);
    console.log(`Duration: ${summary.durationMs}ms`);
    console.log('');

    console.table({
      courses: summary.courses,
      units: summary.units,
      lessons: summary.lessons,
      vocabularies: summary.vocabularies,
      exercises: summary.exercises,
    });

    if (summary.importedCourses.length > 0) {
      console.log('');
      console.table(
        summary.importedCourses.map((course) => ({
          slug: course.slug,
          title: course.title,
          level: course.level,
          lessons: course.lessons,
          vocabularies: course.vocabularies,
          exercises: course.exercises,
        })),
      );
    }

    if (summary.before && summary.after) {
      console.log('');
      console.log('Database stats before / after');
      console.table({
        courses: `${summary.before.courses} -> ${summary.after.courses}`,
        units: `${summary.before.units} -> ${summary.after.units}`,
        lessons: `${summary.before.lessons} -> ${summary.after.lessons}`,
        vocabularies: `${summary.before.vocabularies} -> ${summary.after.vocabularies}`,
        exercises: `${summary.before.exercises} -> ${summary.after.exercises}`,
      });
    }

    console.log('');
  }

  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[ContentImporter] ${message}`);
    }
  }
}

export async function importCourse(
  prisma: PrismaClient,
  course: Course,
  options: ContentImportOptions = {},
): Promise<ContentImportSummary> {
  const importer = new ContentImporter(prisma, options);

  return importer.importCourse(course);
}

export async function importCourses(
  prisma: PrismaClient,
  courses: Course[],
  options: ContentImportOptions = {},
): Promise<ContentImportSummary> {
  const importer = new ContentImporter(prisma, options);

  return importer.importCourses(courses);
}
