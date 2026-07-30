// server/prisma/content/cli.ts

import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';

import {
  assertContentAudit,
  ContentImporter,
  ContentRepository,
  courses,
  registry,
  serializeError,
} from '.';

type ContentCommand = 'dry-run' | 'import' | 'verify' | 'stats' | 'audit';

interface CliOptions {
  command: ContentCommand;
  validate: boolean;
  verbose: boolean;
}

const CONTENT_COMMANDS: readonly ContentCommand[] = [
  'dry-run',
  'import',
  'verify',
  'stats',
  'audit',
];

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Thiếu biến môi trường DATABASE_URL.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

function readBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }

  throw new Error(`Giá trị boolean không hợp lệ: ${value}`);
}

function isContentCommand(value: string): value is ContentCommand {
  return CONTENT_COMMANDS.some((command) => command === value);
}

function parseArguments(): CliOptions {
  const rawCommand = process.argv[2] ?? 'dry-run';

  if (!isContentCommand(rawCommand)) {
    throw new Error(
      [
        `Lệnh không hợp lệ: ${rawCommand}`,
        'Các lệnh hỗ trợ:',
        ...CONTENT_COMMANDS.map((command) => `- ${command}`),
      ].join('\n'),
    );
  }

  return {
    command: rawCommand,
    validate: readBoolean(process.env.CONTENT_SEED_VALIDATE, true),
    verbose: readBoolean(process.env.CONTENT_SEED_VERBOSE, true),
  };
}

async function runDryRun(options: CliOptions): Promise<void> {
  const importer = new ContentImporter(prisma, {
    dryRun: true,
    validate: options.validate,
    verbose: options.verbose,
    clearExisting: false,
  });

  const result = await importer.importCourses([...courses]);

  console.log('');
  console.log('✅ Content dry-run completed.');

  console.table({
    courses: result.courses,
    units: result.units,
    lessons: result.lessons,
    vocabularies: result.vocabularies,
    exercises: result.exercises,
    durationMs: result.durationMs,
  });
}

async function runImport(options: CliOptions): Promise<void> {
  const importer = new ContentImporter(prisma, {
    dryRun: false,
    validate: options.validate,
    verbose: options.verbose,
    clearExisting: false,
  });

  const result = await importer.importCourses([...courses]);

  console.log('');
  console.log('✅ Content import completed.');

  console.table({
    courses: result.courses,
    units: result.units,
    lessons: result.lessons,
    vocabularies: result.vocabularies,
    exercises: result.exercises,
    durationMs: result.durationMs,
  });
}

async function runStats(): Promise<void> {
  const repository = new ContentRepository(prisma);

  const databaseStats = await repository.getStats();

  const registryStats = registry.getStats();

  console.log('');
  console.log('Content Statistics');
  console.log('==================');

  console.table({
    sourceCourses: registryStats.courses,
    sourceLessons: registryStats.lessons,
    sourceVocabularies: registryStats.vocabularies,
    sourceExercises: registryStats.exercises,
    databaseCourses: databaseStats.courses,
    databaseUnits: databaseStats.units,
    databaseLessons: databaseStats.lessons,
    databaseVocabularies: databaseStats.vocabularies,
    databaseExercises: databaseStats.exercises,
  });
}

async function runVerify(options: CliOptions): Promise<void> {
  const importer = new ContentImporter(prisma, {
    dryRun: true,
    validate: options.validate,
    verbose: false,
    clearExisting: false,
  });

  await importer.importCourses([...courses]);

  const errors: string[] = [];

  for (const sourceCourse of courses) {
    const databaseCourse = await prisma.course.findUnique({
      where: {
        slug: sourceCourse.id,
      },
      include: {
        units: {
          include: {
            lessons: {
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

    if (!databaseCourse) {
      errors.push(`Missing course: ${sourceCourse.id}`);

      continue;
    }

    const databaseLessons = databaseCourse.units.flatMap(
      (unit) => unit.lessons,
    );

    for (const sourceLesson of sourceCourse.lessons) {
      const databaseLesson = databaseLessons.find(
        (lesson) => lesson.slug === sourceLesson.metadata.slug,
      );

      const lessonPath = `${sourceCourse.id}/${sourceLesson.metadata.slug}`;

      if (!databaseLesson) {
        errors.push(`Missing lesson: ${lessonPath}`);

        continue;
      }

      if (databaseLesson.title !== sourceLesson.metadata.title) {
        errors.push(
          [
            'Lesson title mismatch:',
            lessonPath,
            `source="${sourceLesson.metadata.title}"`,
            `database="${databaseLesson.title}"`,
          ].join(' '),
        );
      }

      if (databaseLesson.orderIndex !== sourceLesson.metadata.id) {
        errors.push(
          [
            'Lesson order mismatch:',
            lessonPath,
            `source=${sourceLesson.metadata.id}`,
            `database=${databaseLesson.orderIndex}`,
          ].join(' '),
        );
      }

      if (
        databaseLesson.vocabularies.length !== sourceLesson.vocabulary.length
      ) {
        errors.push(
          [
            'Vocabulary count mismatch:',
            lessonPath,
            `source=${sourceLesson.vocabulary.length}`,
            `database=${databaseLesson.vocabularies.length}`,
          ].join(' '),
        );
      }

      if (databaseLesson.exercises.length !== sourceLesson.exercises.length) {
        errors.push(
          [
            'Exercise count mismatch:',
            lessonPath,
            `source=${sourceLesson.exercises.length}`,
            `database=${databaseLesson.exercises.length}`,
          ].join(' '),
        );
      }

      for (let index = 0; index < sourceLesson.vocabulary.length; index += 1) {
        const sourceVocabulary = sourceLesson.vocabulary[index];

        const databaseVocabulary = databaseLesson.vocabularies[index];

        if (!databaseVocabulary) {
          continue;
        }

        if (sourceVocabulary.word !== databaseVocabulary.word) {
          errors.push(
            [
              'Vocabulary mismatch:',
              lessonPath,
              `index=${index + 1}`,
              `source="${sourceVocabulary.word}"`,
              `database="${databaseVocabulary.word}"`,
            ].join(' '),
          );
        }
      }

      for (let index = 0; index < sourceLesson.exercises.length; index += 1) {
        const sourceExercise = sourceLesson.exercises[index];

        const databaseExercise = databaseLesson.exercises[index];

        if (!databaseExercise) {
          continue;
        }

        if (sourceExercise.question !== databaseExercise.question) {
          errors.push(
            ['Exercise mismatch:', lessonPath, `index=${index + 1}`].join(' '),
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      [
        'Content verification failed:',
        ...errors.map((error) => `- ${error}`),
      ].join('\n'),
    );
  }

  console.log('');
  console.log('✅ Source content matches database content.');

  await runStats();
}

function runAudit(): void {
  const result = assertContentAudit([...courses]);

  console.log('');
  console.log('Content Audit');
  console.log('=============');

  console.table(result.stats);

  const warnings = result.issues.filter(
    (issue) => issue.severity === 'warning',
  );

  if (warnings.length > 0) {
    console.log('');
    console.log('Warnings');
    console.log('--------');

    console.table(
      warnings.map((issue) => ({
        code: issue.code,
        path: issue.path,
        message: issue.message,
      })),
    );
  }

  console.log('');
  console.log('✅ Content audit passed.');
}

async function main(): Promise<void> {
  const options = parseArguments();

  console.log('');
  console.log('Content CLI');
  console.log('===========');
  console.log(`Command: ${options.command}`);
  console.log(`Validate: ${options.validate}`);
  console.log(`Verbose: ${options.verbose}`);

  switch (options.command) {
    case 'audit':
      runAudit();
      return;

    case 'dry-run':
      await runDryRun(options);
      return;

    case 'import':
      await runImport(options);
      return;

    case 'verify':
      await runVerify(options);
      return;

    case 'stats':
      await runStats();
      return;

    default: {
      const exhaustiveCheck: never = options.command;

      throw new Error(
        `Unsupported content command: ${String(exhaustiveCheck)}`,
      );
    }
  }
}

main()
  .catch((error: unknown) => {
    console.error('');
    console.error(JSON.stringify(serializeError(error), null, 2));

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
