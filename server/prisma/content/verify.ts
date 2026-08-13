// server/prisma/content/verify.ts

import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';
import { ContentImporter, courses, registry, serializeError } from '.';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Thiếu biến môi trường DATABASE_URL.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: databaseUrl,
  }),
});

interface VerificationResult {
  registryCourses: number;
  registryLessons: number;
  registryVocabularies: number;
  registryExercises: number;
  databaseCourses: number;
  databaseUnits: number;
  databaseLessons: number;
  databaseVocabularies: number;
  databaseExercises: number;
}

async function verifyContent(): Promise<VerificationResult> {
  const importer = new ContentImporter(prisma, {
    dryRun: true,
    validate: true,
    verbose: false,
    clearExisting: false,
  });

  await importer.importCourses([...courses]);

  const registryStats = registry.getStats();

  const [
    databaseCourses,
    databaseUnits,
    databaseLessons,
    databaseVocabularies,
    databaseExercises,
  ] = await Promise.all([
    prisma.course.count(),
    prisma.unit.count(),
    prisma.lesson.count(),
    prisma.vocabulary.count(),
    prisma.exercise.count(),
  ]);

  for (const course of courses) {
    const databaseCourse = await prisma.course.findUnique({
      where: {
        slug: course.id,
      },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                vocabularies: true,
                exercises: true,
              },
            },
          },
        },
      },
    });

    if (!databaseCourse) {
      throw new Error(`Không tìm thấy course trong database: ${course.id}`);
    }

    for (const sourceLesson of course.lessons) {
      const databaseLesson = databaseCourse.units
        .flatMap((unit) => unit.lessons)
        .find((lesson) => lesson.slug === sourceLesson.metadata.slug);

      if (!databaseLesson) {
        throw new Error(
          `Không tìm thấy lesson trong database: ${course.id}/${sourceLesson.metadata.slug}`,
        );
      }

      if (
        databaseLesson.vocabularies.length !== sourceLesson.vocabulary.length
      ) {
        throw new Error(
          [
            `Sai số lượng vocabulary:`,
            `${course.id}/${sourceLesson.metadata.slug}`,
            `source=${sourceLesson.vocabulary.length}`,
            `database=${databaseLesson.vocabularies.length}`,
          ].join(' '),
        );
      }

      if (databaseLesson.exercises.length !== sourceLesson.exercises.length) {
        throw new Error(
          [
            `Sai số lượng exercise:`,
            `${course.id}/${sourceLesson.metadata.slug}`,
            `source=${sourceLesson.exercises.length}`,
            `database=${databaseLesson.exercises.length}`,
          ].join(' '),
        );
      }
    }
  }

  return {
    registryCourses: registryStats.courses,
    registryLessons: registryStats.lessons,
    registryVocabularies: registryStats.vocabularies,
    registryExercises: registryStats.exercises,
    databaseCourses,
    databaseUnits,
    databaseLessons,
    databaseVocabularies,
    databaseExercises,
  };
}

async function main(): Promise<void> {
  const result = await verifyContent();

  console.log('');
  console.log('Content Verification');
  console.log('====================');
  console.table(result);
  console.log('');
  console.log('✅ Content verification passed.');
}

main()
  .catch((error: unknown) => {
    console.error(JSON.stringify(serializeError(error), null, 2));

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
