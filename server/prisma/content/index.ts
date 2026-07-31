// server/prisma/content/index.ts

export * from './types';
export * from './constants';
export * from './utils';
export * from './validator';
export * from './mapper';
export * from './repository';
export * from './registry';
export * from './logger';
export * from './errors';

export { ContentImporter, importCourse, importCourses } from './importer';

export type { ContentImportOptions, ContentImportSummary } from './importer';

export {
  ContentExporter,
  exportAllCourses,
  exportCourseBySlug,
} from './exporter';

export type {
  ContentExportOptions,
  ContentExportResult,
  ExportedCourseSummary,
} from './exporter';

export { a1Course, a1Lessons, lesson007TravelAirport } from './a1';
export { a2Course } from './a2';
export { b1Course } from './b1';

export { default as a1 } from './a1';

import a1 from './a1';
import a2 from './a2';
import b1 from './b1';
import { ContentRegistry } from './registry';

export const courses = [a1, a2, b1] as const;

export const registry = new ContentRegistry().registerCourses([...courses]);

export default courses;
export * from './audit';
