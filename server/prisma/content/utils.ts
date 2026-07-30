// server/prisma/content/utils.ts

import { Lesson } from './types';

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function deepClone<T>(value: T): T {
  return structuredClone(value);
}

export function sortLessons(lessons: Lesson[]): Lesson[] {
  return [...lessons].sort((a, b) => a.metadata.id - b.metadata.id);
}

export function lessonFileName(id: number, slug: string): string {
  return `lesson-${String(id).padStart(3, '0')}-${slug}.ts`;
}

export function lessonCode(id: number): string {
  return String(id).padStart(3, '0');
}

export function capitalize(text: string): string {
  if (!text.length) return text;

  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function normalizeLesson(lesson: Lesson): Lesson {
  lesson.metadata.slug = slugify(lesson.metadata.slug);

  lesson.metadata.title = normalizeWhitespace(lesson.metadata.title);

  lesson.metadata.description = normalizeWhitespace(
    lesson.metadata.description,
  );

  lesson.objectives = lesson.objectives.map(normalizeWhitespace);

  lesson.metadata.tags = unique(
    lesson.metadata.tags.map((x) => normalizeWhitespace(x.toLowerCase())),
  );

  lesson.vocabulary = lesson.vocabulary.map((v) => ({
    ...v,
    word: normalizeWhitespace(v.word),
    ipa: normalizeWhitespace(v.ipa),
    type: normalizeWhitespace(v.type),
    meaning: normalizeWhitespace(v.meaning),
    example: normalizeWhitespace(v.example),
    exampleTranslation: normalizeWhitespace(v.exampleTranslation),
  }));

  lesson.dialogue.lines = lesson.dialogue.lines.map((line) => ({
    ...line,
    speaker: normalizeWhitespace(line.speaker),
    text: normalizeWhitespace(line.text),
    translation: normalizeWhitespace(line.translation),
  }));

  lesson.grammar = lesson.grammar.map((rule) => ({
    ...rule,
    title: normalizeWhitespace(rule.title),
    explanation: normalizeWhitespace(rule.explanation),
    examples: rule.examples.map((e) => ({
      english: normalizeWhitespace(e.english),
      vietnamese: normalizeWhitespace(e.vietnamese),
    })),
  }));

  lesson.reading.passage = normalizeWhitespace(lesson.reading.passage);

  lesson.reading.translation = normalizeWhitespace(lesson.reading.translation);

  lesson.reading.questions = lesson.reading.questions.map((q) => ({
    ...q,
    question: normalizeWhitespace(q.question),
    options: q.options.map(normalizeWhitespace),
  }));

  lesson.listening.transcript = normalizeWhitespace(
    lesson.listening.transcript,
  );

  lesson.listening.questions = lesson.listening.questions.map((q) => ({
    ...q,
    question: normalizeWhitespace(q.question),
    options: q.options.map(normalizeWhitespace),
  }));

  lesson.speaking = lesson.speaking.map((s) => ({
    ...s,
    title: normalizeWhitespace(s.title),
    instruction: normalizeWhitespace(s.instruction),
  }));

  lesson.writing = lesson.writing.map((w) => ({
    ...w,
    title: normalizeWhitespace(w.title),
    instruction: normalizeWhitespace(w.instruction),
    sample: normalizeWhitespace(w.sample),
  }));

  lesson.exercises = lesson.exercises.map((exercise) => ({
    ...exercise,
    question: normalizeWhitespace(exercise.question),
    options: exercise.options?.map(normalizeWhitespace),
    explanation: exercise.explanation
      ? normalizeWhitespace(exercise.explanation)
      : undefined,
  }));

  return lesson;
}

export function lessonSummary(lesson: Lesson): string {
  return [
    `${lesson.metadata.id}`,
    lesson.metadata.title,
    `${lesson.vocabulary.length} words`,
    `${lesson.exercises.length} exercises`,
  ].join(' | ');
}
