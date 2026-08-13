// server/prisma/content/constants.ts

import { CEFRLevel, LessonCategory } from './types';

export const CONTENT_VERSION = '1.0.0';

export const MIN_OBJECTIVES = 3;

export const MIN_VOCABULARY = 10;

export const MIN_DIALOGUE_LINES = 6;

export const MIN_READING_QUESTIONS = 3;

export const MIN_LISTENING_QUESTIONS = 3;

export const MIN_EXERCISES = 10;

export const MIN_SPEAKING_TASKS = 2;

export const MIN_WRITING_TASKS = 1;

export const SUPPORTED_LEVELS: readonly CEFRLevel[] = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
];

export const SUPPORTED_CATEGORIES: readonly LessonCategory[] = [
  'grammar',
  'vocabulary',
  'conversation',
  'reading',
  'listening',
  'writing',
  'speaking',
  'mixed',
];

export const LESSON_ID_PADDING = 3;

export const DEFAULT_ESTIMATED_MINUTES = 45;

export const MAX_TAGS = 10;

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_TRANSLATION_LANGUAGE = 'vi';
