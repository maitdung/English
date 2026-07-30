// server/prisma/content/mapper.ts

import { Course, Lesson, VocabularyItem, Exercise } from './types';

export interface LessonContent {
  objectives: string[];
  dialogue: Lesson['dialogue'];
  grammar: Lesson['grammar'];
  reading: Lesson['reading'];
  listening: Lesson['listening'];
  speaking: Lesson['speaking'];
  writing: Lesson['writing'];
}

export function mapLessonContent(lesson: Lesson): LessonContent {
  return {
    objectives: lesson.objectives,
    dialogue: lesson.dialogue,
    grammar: lesson.grammar,
    reading: lesson.reading,
    listening: lesson.listening,
    speaking: lesson.speaking,
    writing: lesson.writing,
  };
}

export function mapVocabulary(lessonId: string, vocabulary: VocabularyItem[]) {
  return vocabulary.map((item, index) => ({
    lessonId,
    word: item.word,
    phonetic: item.ipa || null,
    partOfSpeech: item.type || null,
    meaning: item.meaning,
    example: item.example || null,
    exampleTranslation: item.exampleTranslation || null,
    audioUrl: null,
    imageUrl: null,
    orderIndex: index + 1,
  }));
}

export function mapExercises(lessonId: string, exercises: Exercise[]) {
  return exercises.map((exercise, index) => ({
    lessonId,

    type: mapExerciseType(exercise.type),

    question: exercise.question,

    instructions: null,

    options: exercise.options ?? null,

    correctAnswer: exercise.answer,

    explanation: exercise.explanation ?? null,

    points: 10,

    orderIndex: index + 1,
  }));
}

function mapExerciseType(type: string) {
  switch (type) {
    case 'multiple-choice':
      return 'MULTIPLE_CHOICE';

    case 'fill-blank':
      return 'FILL_BLANK';

    case 'matching':
      return 'MATCHING';

    case 'sentence-order':
    case 'ordering':
      return 'SENTENCE_ORDER';

    case 'true-false':
      return 'TRUE_FALSE';

    default:
      return 'MULTIPLE_CHOICE';
  }
}

export function mapLesson(unitId: string, lesson: Lesson) {
  return {
    unitId,

    slug: lesson.metadata.slug,

    title: lesson.metadata.title,

    description: lesson.metadata.description,

    type: 'VOCABULARY',

    orderIndex: lesson.metadata.id,

    durationMinutes: lesson.metadata.estimatedMinutes,

    isFree: lesson.metadata.id <= 3,

    content: mapLessonContent(lesson),
  };
}

export function mapCourse(course: Course) {
  return {
    slug: course.id,

    title: course.title,

    shortDescription: course.description.substring(0, 150),

    description: course.description,

    thumbnailUrl: null,

    level: course.level,

    status: 'PUBLISHED',

    estimatedHours: Math.ceil(course.lessons.length * 0.75),

    orderIndex: 1,

    publishedAt: new Date(),
  };
}

export function mapUnit(courseId: string, title: string, orderIndex: number) {
  return {
    courseId,

    title,

    description: null,

    orderIndex,
  };
}
