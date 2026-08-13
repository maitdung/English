// server/prisma/content/validator.ts

import {
  Course,
  DialogueLine,
  Exercise,
  GrammarRule,
  Lesson,
  ListeningQuestion,
  ReadingQuestion,
  VocabularyItem,
  WritingTask,
  SpeakingTask,
} from './types';

export interface ValidationIssue {
  path: string;
  message: string;
}

export class ValidationError extends Error {
  constructor(public readonly issues: ValidationIssue[]) {
    super(issues.map((x) => `[${x.path}] ${x.message}`).join('\n'));

    this.name = 'ValidationError';
  }
}

const IPA_REGEX = /^\/[\p{L}\p{M}\sˈˌːˑ.'"()\-ɐ-ʯβθðŋʃʒʧʤɡɪʌəæɔɒɑɛʊɜɚɝ]+\/$/u;

export class ContentValidator {
  validateCourse(course: Course): void {
    const issues: ValidationIssue[] = [];

    if (!course.id.trim())
      issues.push({
        path: 'course.id',
        message: 'Course id is required.',
      });

    if (!course.title.trim())
      issues.push({
        path: 'course.title',
        message: 'Course title is required.',
      });

    if (course.lessons.length === 0)
      issues.push({
        path: 'course.lessons',
        message: 'Course has no lessons.',
      });

    const slugSet = new Set<string>();
    const idSet = new Set<number>();

    course.lessons.forEach((lesson, index) => {
      this.validateLesson(lesson, `lessons[${index}]`, issues);

      if (slugSet.has(lesson.metadata.slug)) {
        issues.push({
          path: `lessons[${index}].metadata.slug`,
          message: 'Duplicate slug.',
        });
      }

      slugSet.add(lesson.metadata.slug);

      if (idSet.has(lesson.metadata.id)) {
        issues.push({
          path: `lessons[${index}].metadata.id`,
          message: 'Duplicate lesson id.',
        });
      }

      idSet.add(lesson.metadata.id);
    });

    if (issues.length) {
      throw new ValidationError(issues);
    }
  }

  validateLesson(lesson: Lesson, path: string, issues: ValidationIssue[]) {
    this.validateMetadata(lesson, `${path}.metadata`, issues);

    this.validateObjectives(lesson.objectives, `${path}.objectives`, issues);

    this.validateVocabulary(lesson.vocabulary, `${path}.vocabulary`, issues);

    this.validateDialogue(
      lesson.dialogue.lines,
      `${path}.dialogue.lines`,
      issues,
    );

    this.validateGrammar(lesson.grammar, `${path}.grammar`, issues);

    this.validateReading(
      lesson.reading.questions,
      `${path}.reading.questions`,
      issues,
    );

    this.validateListening(
      lesson.listening.questions,
      `${path}.listening.questions`,
      issues,
    );

    this.validateSpeaking(lesson.speaking, `${path}.speaking`, issues);

    this.validateWriting(lesson.writing, `${path}.writing`, issues);

    this.validateExercises(lesson.exercises, `${path}.exercises`, issues);
  }

  private validateMetadata(
    lesson: Lesson,
    path: string,
    issues: ValidationIssue[],
  ) {
    const meta = lesson.metadata;

    if (meta.id <= 0)
      issues.push({
        path: `${path}.id`,
        message: 'Invalid lesson id.',
      });

    if (!meta.slug.trim())
      issues.push({
        path: `${path}.slug`,
        message: 'Slug is required.',
      });

    if (!meta.title.trim())
      issues.push({
        path: `${path}.title`,
        message: 'Title is required.',
      });

    if (!meta.description.trim())
      issues.push({
        path: `${path}.description`,
        message: 'Description is required.',
      });

    if (meta.estimatedMinutes < 5)
      issues.push({
        path: `${path}.estimatedMinutes`,
        message: 'Estimated time too short.',
      });
  }

  private validateObjectives(
    objectives: string[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (objectives.length < 3)
      issues.push({
        path,
        message: 'Need at least 3 objectives.',
      });
  }

  private validateVocabulary(
    vocabulary: VocabularyItem[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (vocabulary.length < 10)
      issues.push({
        path,
        message: 'Need at least 10 vocabulary items.',
      });

    const words = new Set<string>();

    vocabulary.forEach((item, i) => {
      if (words.has(item.word.toLowerCase()))
        issues.push({
          path: `${path}[${i}]`,
          message: 'Duplicate vocabulary.',
        });

      words.add(item.word.toLowerCase());

      if (!IPA_REGEX.test(item.ipa))
        issues.push({
          path: `${path}[${i}].ipa`,
          message: 'Invalid IPA.',
        });

      if (!item.meaning.trim())
        issues.push({
          path: `${path}[${i}].meaning`,
          message: 'Meaning required.',
        });

      if (!item.example.trim())
        issues.push({
          path: `${path}[${i}].example`,
          message: 'Example required.',
        });

      if (!item.exampleTranslation.trim())
        issues.push({
          path: `${path}[${i}].exampleTranslation`,
          message: 'Translation required.',
        });
    });
  }

  private validateDialogue(
    lines: DialogueLine[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (lines.length < 6)
      issues.push({
        path,
        message: 'Dialogue too short.',
      });

    lines.forEach((line, i) => {
      if (!line.speaker.trim())
        issues.push({
          path: `${path}[${i}]`,
          message: 'Speaker required.',
        });

      if (!line.translation.trim())
        issues.push({
          path: `${path}[${i}]`,
          message: 'Translation required.',
        });
    });
  }

  private validateGrammar(
    grammar: GrammarRule[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (!grammar.length)
      issues.push({
        path,
        message: 'Grammar missing.',
      });
  }

  private validateReading(
    questions: ReadingQuestion[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (questions.length < 3)
      issues.push({
        path,
        message: 'Reading needs at least 3 questions.',
      });
  }

  private validateListening(
    questions: ListeningQuestion[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (questions.length < 3)
      issues.push({
        path,
        message: 'Listening needs at least 3 questions.',
      });
  }

  private validateSpeaking(
    tasks: SpeakingTask[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (tasks.length < 1)
      issues.push({
        path,
        message: 'Need speaking tasks.',
      });
  }

  private validateWriting(
    tasks: WritingTask[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (!tasks.length)
      issues.push({
        path,
        message: 'Writing task missing.',
      });
  }

  private validateExercises(
    exercises: Exercise[],
    path: string,
    issues: ValidationIssue[],
  ) {
    if (exercises.length < 10)
      issues.push({
        path,
        message: 'Need at least 10 exercises.',
      });

    const ids = new Set<string>();

    exercises.forEach((exercise, i) => {
      if (ids.has(exercise.id))
        issues.push({
          path: `${path}[${i}]`,
          message: 'Duplicate exercise id.',
        });

      ids.add(exercise.id);

      if (!exercise.question.trim())
        issues.push({
          path: `${path}[${i}]`,
          message: 'Question required.',
        });

      if (exercise.answer === undefined || exercise.answer === null) {
        issues.push({
          path: `${path}[${i}]`,
          message: 'Answer required.',
        });
      }

      if (
        exercise.type === 'multiple-choice' &&
        (!exercise.options || exercise.options.length < 2)
      ) {
        issues.push({
          path: `${path}[${i}]`,
          message: 'Multiple choice requires options.',
        });
      }
    });
  }
}

export const validator = new ContentValidator();
