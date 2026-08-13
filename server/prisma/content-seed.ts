import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';
import {
  ContentImporter,
  courses,
  serializeError,
} from './content';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Thiếu biến môi trường DATABASE_URL.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

function readBoolean(
  name: string,
  defaultValue: boolean,
): boolean {
  const rawValue = process.env[name];

  if (rawValue === undefined) {
    return defaultValue;
  }

  const value = rawValue.trim().toLowerCase();

  if (
    value === 'true' ||
    value === '1' ||
    value === 'yes'
  ) {
    return true;
  }

  if (
    value === 'false' ||
    value === '0' ||
    value === 'no'
  ) {
    return false;
  }

  throw new Error(
    `Biến ${name} phải là true hoặc false.`,
  );
}

async function main(): Promise<void> {
  const dryRun = readBoolean(
    'CONTENT_SEED_DRY_RUN',
    true,
  );

  const validate = readBoolean(
    'CONTENT_SEED_VALIDATE',
    true,
  );

  const verbose = readBoolean(
    'CONTENT_SEED_VERBOSE',
    true,
  );

  const clearExisting = readBoolean(
    'CONTENT_SEED_CLEAR',
    false,
  );

  if (!dryRun && clearExisting) {
    throw new Error(
      'Không cho phép CONTENT_SEED_CLEAR=true trong script kiểm thử.',
    );
  }

  console.log('');
  console.log('====================================');
  console.log('Content Engine Seed');
  console.log('====================================');
  console.log(`Dry run: ${dryRun}`);
  console.log(`Validate: ${validate}`);
  console.log(`Verbose: ${verbose}`);
  console.log(`Courses: ${courses.length}`);
  console.log('');

  const importer = new ContentImporter(
    prisma,
    {
      dryRun,
      validate,
      verbose,
      clearExisting: false,
    },
  );

  const result = await importer.importCourses(
    [...courses],
  );

  console.log('');
  console.log('====================================');
  console.log('Content Engine Result');
  console.log('====================================');
  console.table({
    courses: result.courses,
    units: result.units,
    lessons: result.lessons,
    vocabularies: result.vocabularies,
    exercises: result.exercises,
    durationMs: result.durationMs,
    dryRun: result.dryRun,
  });
}

main()
  .catch((error: unknown) => {
    console.error(
      JSON.stringify(
        serializeError(error),
        null,
        2,
      ),
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });