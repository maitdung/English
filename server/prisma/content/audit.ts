// server/prisma/content/audit.ts

import type { Course, Exercise, Lesson, VocabularyItem } from './types';

export type ContentAuditSeverity = 'error' | 'warning';

export interface ContentAuditIssue {
  severity: ContentAuditSeverity;
  code: string;
  path: string;
  message: string;
}

export interface ContentAuditStats {
  courses: number;
  lessons: number;
  vocabularies: number;
  exercises: number;
  errors: number;
  warnings: number;
}

export interface ContentAuditResult {
  valid: boolean;
  issues: ContentAuditIssue[];
  stats: ContentAuditStats;
}

export class ContentAuditError extends Error {
  constructor(public readonly result: ContentAuditResult) {
    super(
      result.issues
        .filter((issue) => issue.severity === 'error')
        .map((issue) => `[${issue.code}] ${issue.path}: ${issue.message}`)
        .join('\n'),
    );

    this.name = 'ContentAuditError';
  }
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

function addIssue(issues: ContentAuditIssue[], issue: ContentAuditIssue): void {
  issues.push(issue);
}

function auditVocabulary(
  lesson: Lesson,
  lessonPath: string,
  issues: ContentAuditIssue[],
): void {
  const words = new Map<string, number>();

  lesson.vocabulary.forEach((item: VocabularyItem, index: number) => {
    const path = `${lessonPath}.vocabulary[${index}]`;

    const normalizedWord = normalizeText(item.word);

    const previousIndex = words.get(normalizedWord);

    if (previousIndex !== undefined) {
      addIssue(issues, {
        severity: 'error',
        code: 'DUPLICATE_VOCABULARY',
        path,
        message:
          `Duplicate vocabulary "${item.word}". ` +
          `First occurrence: vocabulary[${previousIndex}].`,
      });
    } else {
      words.set(normalizedWord, index);
    }

    if (normalizeText(item.example) === normalizeText(item.word)) {
      addIssue(issues, {
        severity: 'warning',
        code: 'WEAK_VOCABULARY_EXAMPLE',
        path,
        message: 'Vocabulary example should be a complete contextual sentence.',
      });
    }

    if (!/[.!?]$/.test(item.example.trim())) {
      addIssue(issues, {
        severity: 'warning',
        code: 'EXAMPLE_MISSING_PUNCTUATION',
        path: `${path}.example`,
        message: 'Example should end with punctuation.',
      });
    }

    if (normalizeText(item.exampleTranslation).length < 3) {
      addIssue(issues, {
        severity: 'error',
        code: 'MISSING_EXAMPLE_TRANSLATION',
        path: `${path}.exampleTranslation`,
        message: 'Example translation is missing or too short.',
      });
    }
  });
}

function auditExercises(
  lesson: Lesson,
  lessonPath: string,
  issues: ContentAuditIssue[],
): void {
  const ids = new Map<string, number>();
  const questions = new Map<string, number>();

  lesson.exercises.forEach((exercise: Exercise, index: number) => {
    const path = `${lessonPath}.exercises[${index}]`;

    const normalizedId = normalizeText(exercise.id);

    const previousIdIndex = ids.get(normalizedId);

    if (previousIdIndex !== undefined) {
      addIssue(issues, {
        severity: 'error',
        code: 'DUPLICATE_EXERCISE_ID',
        path,
        message:
          `Duplicate exercise id "${exercise.id}". ` +
          `First occurrence: exercises[${previousIdIndex}].`,
      });
    } else {
      ids.set(normalizedId, index);
    }

    const normalizedQuestion = normalizeText(exercise.question);

    const previousQuestionIndex = questions.get(normalizedQuestion);

    if (previousQuestionIndex !== undefined) {
      addIssue(issues, {
        severity: 'warning',
        code: 'DUPLICATE_EXERCISE_QUESTION',
        path,
        message:
          `Duplicate exercise question. ` +
          `First occurrence: exercises[${previousQuestionIndex}].`,
      });
    } else {
      questions.set(normalizedQuestion, index);
    }

    if (exercise.options && exercise.options.length > 0) {
      const normalizedOptions = exercise.options.map(normalizeText);

      const uniqueOptions = new Set(normalizedOptions);

      if (uniqueOptions.size !== normalizedOptions.length) {
        addIssue(issues, {
          severity: 'error',
          code: 'DUPLICATE_EXERCISE_OPTION',
          path: `${path}.options`,
          message: 'Exercise contains duplicate options.',
        });
      }
    }

    if (
      exercise.type === 'multiple-choice' &&
      (!exercise.options || exercise.options.length < 2)
    ) {
      addIssue(issues, {
        severity: 'error',
        code: 'INVALID_MULTIPLE_CHOICE_OPTIONS',
        path: `${path}.options`,
        message: 'Multiple-choice exercise requires at least two options.',
      });
    }

    if (exercise.options && typeof exercise.answer === 'string') {
      const hasAnswer = exercise.options.some(
        (option) =>
          normalizeText(option) === normalizeText(exercise.answer as string),
      );

      if (exercise.type === 'multiple-choice' && !hasAnswer) {
        addIssue(issues, {
          severity: 'error',
          code: 'ANSWER_NOT_IN_OPTIONS',
          path: `${path}.answer`,
          message: `Answer "${exercise.answer}" does not exist in options.`,
        });
      }
    }

    if (!exercise.explanation || exercise.explanation.trim().length < 8) {
      addIssue(issues, {
        severity: 'warning',
        code: 'WEAK_EXERCISE_EXPLANATION',
        path: `${path}.explanation`,
        message: 'Exercise explanation is missing or too short.',
      });
    }
  });
}

function auditLesson(
  lesson: Lesson,
  coursePath: string,
  issues: ContentAuditIssue[],
): void {
  const lessonPath = `${coursePath}.lessons[` + `${lesson.metadata.id}]`;

  if (lesson.metadata.estimatedMinutes < 5) {
    addIssue(issues, {
      severity: 'warning',
      code: 'LESSON_DURATION_TOO_SHORT',
      path: `${lessonPath}.metadata.estimatedMinutes`,
      message: 'Lesson duration is shorter than five minutes.',
    });
  }

  if (lesson.metadata.tags.length === 0) {
    addIssue(issues, {
      severity: 'warning',
      code: 'LESSON_WITHOUT_TAGS',
      path: `${lessonPath}.metadata.tags`,
      message: 'Lesson should contain searchable tags.',
    });
  }

  if (lesson.objectives.length < 2) {
    addIssue(issues, {
      severity: 'warning',
      code: 'TOO_FEW_OBJECTIVES',
      path: `${lessonPath}.objectives`,
      message: 'Lesson should contain at least two objectives.',
    });
  }

  if (lesson.reading.questions.length === 0) {
    addIssue(issues, {
      severity: 'warning',
      code: 'READING_WITHOUT_QUESTIONS',
      path: `${lessonPath}.reading.questions`,
      message: 'Reading section has no comprehension questions.',
    });
  }

  if (lesson.listening.questions.length === 0) {
    addIssue(issues, {
      severity: 'warning',
      code: 'LISTENING_WITHOUT_QUESTIONS',
      path: `${lessonPath}.listening.questions`,
      message: 'Listening section has no comprehension questions.',
    });
  }

  auditVocabulary(lesson, lessonPath, issues);

  auditExercises(lesson, lessonPath, issues);
}

function auditCourse(
  course: Course,
  courseIndex: number,
  issues: ContentAuditIssue[],
): void {
  const coursePath = `courses[${courseIndex}]`;

  const lessonIds = new Map<number, number>();

  const lessonSlugs = new Map<string, number>();

  const lessonTitles = new Map<string, number>();

  course.lessons.forEach((lesson, lessonIndex) => {
    const id = lesson.metadata.id;

    const slug = normalizeText(lesson.metadata.slug);

    const title = normalizeText(lesson.metadata.title);

    const previousIdIndex = lessonIds.get(id);

    if (previousIdIndex !== undefined) {
      addIssue(issues, {
        severity: 'error',
        code: 'DUPLICATE_LESSON_ID',
        path: `${coursePath}.lessons[${lessonIndex}]`,
        message:
          `Duplicate lesson id ${id}. ` +
          `First occurrence: lessons[${previousIdIndex}].`,
      });
    } else {
      lessonIds.set(id, lessonIndex);
    }

    const previousSlugIndex = lessonSlugs.get(slug);

    if (previousSlugIndex !== undefined) {
      addIssue(issues, {
        severity: 'error',
        code: 'DUPLICATE_LESSON_SLUG',
        path: `${coursePath}.lessons[${lessonIndex}]`,
        message:
          `Duplicate lesson slug "${lesson.metadata.slug}". ` +
          `First occurrence: lessons[${previousSlugIndex}].`,
      });
    } else {
      lessonSlugs.set(slug, lessonIndex);
    }

    const previousTitleIndex = lessonTitles.get(title);

    if (previousTitleIndex !== undefined) {
      addIssue(issues, {
        severity: 'warning',
        code: 'DUPLICATE_LESSON_TITLE',
        path: `${coursePath}.lessons[${lessonIndex}]`,
        message: `Duplicate lesson title "${lesson.metadata.title}".`,
      });
    } else {
      lessonTitles.set(title, lessonIndex);
    }

    auditLesson(lesson, coursePath, issues);
  });
}

export function auditContent(courses: readonly Course[]): ContentAuditResult {
  const issues: ContentAuditIssue[] = [];

  const courseSlugs = new Map<string, number>();

  courses.forEach((course, courseIndex) => {
    const normalizedSlug = normalizeText(course.id);

    const previousIndex = courseSlugs.get(normalizedSlug);

    if (previousIndex !== undefined) {
      addIssue(issues, {
        severity: 'error',
        code: 'DUPLICATE_COURSE_SLUG',
        path: `courses[${courseIndex}]`,
        message:
          `Duplicate course slug "${course.id}". ` +
          `First occurrence: courses[${previousIndex}].`,
      });
    } else {
      courseSlugs.set(normalizedSlug, courseIndex);
    }

    auditCourse(course, courseIndex, issues);
  });

  const errors = issues.filter((issue) => issue.severity === 'error').length;

  const warnings = issues.filter(
    (issue) => issue.severity === 'warning',
  ).length;

  const lessons = courses.reduce(
    (total, course) => total + course.lessons.length,
    0,
  );

  const vocabularies = courses.reduce(
    (courseTotal, course) =>
      courseTotal +
      course.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.vocabulary.length,
        0,
      ),
    0,
  );

  const exercises = courses.reduce(
    (courseTotal, course) =>
      courseTotal +
      course.lessons.reduce(
        (lessonTotal, lesson) => lessonTotal + lesson.exercises.length,
        0,
      ),
    0,
  );

  return {
    valid: errors === 0,
    issues,
    stats: {
      courses: courses.length,
      lessons,
      vocabularies,
      exercises,
      errors,
      warnings,
    },
  };
}

export function assertContentAudit(
  courses: readonly Course[],
): ContentAuditResult {
  const result = auditContent(courses);

  if (!result.valid) {
    throw new ContentAuditError(result);
  }

  return result;
}
