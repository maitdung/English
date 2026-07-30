// server/prisma/content/registry.ts

import { Course, Lesson } from './types';
import { sortLessons } from './utils';
import { ContentConflictError, ContentNotFoundError } from './errors';

export interface ContentRegistryStats {
  courses: number;
  lessons: number;
  vocabularies: number;
  exercises: number;
}

export class ContentRegistry {
  private readonly coursesBySlug = new Map<string, Course>();

  private readonly lessonsByGlobalSlug = new Map<string, Lesson>();

  registerCourse(course: Course): this {
    const slug = this.normalizeSlug(course.id);

    if (this.coursesBySlug.has(slug)) {
      throw new ContentConflictError(`Course already registered: ${slug}`, {
        slug,
      });
    }

    const normalizedCourse: Course = {
      ...course,
      id: slug,
      lessons: sortLessons(course.lessons),
    };

    this.assertLessonUniqueness(normalizedCourse);

    this.coursesBySlug.set(slug, normalizedCourse);

    for (const lesson of normalizedCourse.lessons) {
      const globalSlug = this.createGlobalLessonSlug(
        slug,
        lesson.metadata.slug,
      );

      this.lessonsByGlobalSlug.set(globalSlug, lesson);
    }

    return this;
  }

  registerCourses(courses: Course[]): this {
    for (const course of courses) {
      this.registerCourse(course);
    }

    return this;
  }

  hasCourse(slug: string): boolean {
    return this.coursesBySlug.has(this.normalizeSlug(slug));
  }

  getCourse(slug: string): Course {
    const normalizedSlug = this.normalizeSlug(slug);

    const course = this.coursesBySlug.get(normalizedSlug);

    if (!course) {
      throw new ContentNotFoundError('Course', normalizedSlug);
    }

    return course;
  }

  getCourseOrNull(slug: string): Course | null {
    return this.coursesBySlug.get(this.normalizeSlug(slug)) ?? null;
  }

  getLesson(courseSlug: string, lessonSlug: string): Lesson {
    const globalSlug = this.createGlobalLessonSlug(courseSlug, lessonSlug);

    const lesson = this.lessonsByGlobalSlug.get(globalSlug);

    if (!lesson) {
      throw new ContentNotFoundError('Lesson', globalSlug);
    }

    return lesson;
  }

  getLessonOrNull(courseSlug: string, lessonSlug: string): Lesson | null {
    return (
      this.lessonsByGlobalSlug.get(
        this.createGlobalLessonSlug(courseSlug, lessonSlug),
      ) ?? null
    );
  }

  getCourses(): Course[] {
    return [...this.coursesBySlug.values()];
  }

  getPublishedContent(): readonly Course[] {
    return this.getCourses();
  }

  getStats(): ContentRegistryStats {
    const courses = this.getCourses();

    return {
      courses: courses.length,
      lessons: courses.reduce(
        (total, course) => total + course.lessons.length,
        0,
      ),
      vocabularies: courses.reduce(
        (courseTotal, course) =>
          courseTotal +
          course.lessons.reduce(
            (lessonTotal, lesson) => lessonTotal + lesson.vocabulary.length,
            0,
          ),
        0,
      ),
      exercises: courses.reduce(
        (courseTotal, course) =>
          courseTotal +
          course.lessons.reduce(
            (lessonTotal, lesson) => lessonTotal + lesson.exercises.length,
            0,
          ),
        0,
      ),
    };
  }

  clear(): void {
    this.coursesBySlug.clear();
    this.lessonsByGlobalSlug.clear();
  }

  private assertLessonUniqueness(course: Course): void {
    const slugs = new Set<string>();
    const ids = new Set<number>();
    const titles = new Set<string>();

    for (const lesson of course.lessons) {
      const slug = this.normalizeSlug(lesson.metadata.slug);

      const title = lesson.metadata.title.trim().toLocaleLowerCase();

      if (slugs.has(slug)) {
        throw new ContentConflictError(
          `Duplicate lesson slug "${slug}" in course "${course.id}".`,
          {
            course: course.id,
            lessonSlug: slug,
          },
        );
      }

      if (ids.has(lesson.metadata.id)) {
        throw new ContentConflictError(
          `Duplicate lesson id "${lesson.metadata.id}" in course "${course.id}".`,
          {
            course: course.id,
            lessonId: lesson.metadata.id,
          },
        );
      }

      if (titles.has(title)) {
        throw new ContentConflictError(
          `Duplicate lesson title "${lesson.metadata.title}" in course "${course.id}".`,
          {
            course: course.id,
            lessonTitle: lesson.metadata.title,
          },
        );
      }

      slugs.add(slug);
      ids.add(lesson.metadata.id);
      titles.add(title);
    }
  }

  private normalizeSlug(value: string): string {
    return value.trim().toLowerCase();
  }

  private createGlobalLessonSlug(
    courseSlug: string,
    lessonSlug: string,
  ): string {
    return [
      this.normalizeSlug(courseSlug),
      this.normalizeSlug(lessonSlug),
    ].join('/');
  }
}

export const contentRegistry = new ContentRegistry();
