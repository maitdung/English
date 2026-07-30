// server/prisma/content/types.ts

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonCategory =
  | 'grammar'
  | 'vocabulary'
  | 'conversation'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'mixed';

export interface VocabularyItem {
  word: string;
  ipa: string;
  type: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
  translation: string;
}

export interface DialogueSection {
  title: string;
  lines: DialogueLine[];
}

export interface GrammarRule {
  title: string;
  explanation: string;
  examples: {
    english: string;
    vietnamese: string;
  }[];
}

export interface ReadingQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface ReadingSection {
  title: string;
  passage: string;
  translation: string;
  questions: ReadingQuestion[];
}

export interface ListeningQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface ListeningSection {
  transcript: string;
  questions: ListeningQuestion[];
}

export interface SpeakingTask {
  title: string;
  instruction: string;
}

export interface WritingTask {
  title: string;
  instruction: string;
  sample: string;
}

export type ExerciseType =
  'multiple-choice' | 'fill-blank' | 'matching' | 'true-false' | 'ordering';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string | number | boolean | string[];
  explanation?: string;
}

export interface LessonMetadata {
  id: number;
  slug: string;
  title: string;
  description: string;
  level: CEFRLevel;
  category: LessonCategory;
  estimatedMinutes: number;
  tags: string[];
}

export interface Lesson {
  metadata: LessonMetadata;

  objectives: string[];

  vocabulary: VocabularyItem[];

  dialogue: DialogueSection;

  grammar: GrammarRule[];

  reading: ReadingSection;

  listening: ListeningSection;

  speaking: SpeakingTask[];

  writing: WritingTask[];

  exercises: Exercise[];
}

export interface Course {
  id: string;
  level: CEFRLevel;
  title: string;
  description: string;
  lessons: Lesson[];
}
