// server/prisma/content/a1/lessons/adapter.ts

import {
  Exercise,
  ExerciseType,
  GrammarRule,
  Lesson,
  ListeningQuestion,
  ReadingQuestion,
} from '../../types';

interface GeneratedVocabulary {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  translation: string;
  exampleTranslation?: string;
  pronunciationTips?: string;
  commonMistakes?: string;
}

interface GeneratedDialogueLine {
  speaker: string;
  english: string;
  vietnamese: string;
}

interface GeneratedDialogue {
  title: string;
  translation?: string;
  lines: GeneratedDialogueLine[];
}

interface GeneratedGrammarNote {
  topic: string;
  explanation: string;
  examples: string[];
}

interface GeneratedExercise {
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean | string[];
  explanation?: string;
  points?: number;
}

interface GeneratedLesson {
  slug: string;
  title: string;
  description: string;
  type: string;
  durationMinutes: number;

  content: {
    warmup?: string;
    objectives: string[];

    pronunciation?: {
      focus: string;
      tips: string;
    };

    grammarNotes: GeneratedGrammarNote[];
    dialogues: GeneratedDialogue[];

    listening: {
      preQuestions?: string[];
      transcript: string;
      translation?: string;
    };

    reading: {
      text: string;
      translation: string;
    };

    speaking: {
      task: string;
      prompts?: string[];
      sampleAnswer?: string;
    };

    writing: {
      task: string;
      usefulLanguage?: string[];
      checklist?: string[];
      sampleAnswer?: string;
    };

    practice?: string;
    review?: string;
    miniTest?: string;
    homework?: string;
  };

  vocabularies: GeneratedVocabulary[];
  exercises: GeneratedExercise[];
}

export interface LessonAdapterOptions {
  id: number;
  level: Lesson['metadata']['level'];
  category?: Lesson['metadata']['category'];
  tags?: string[];
}

function mapExerciseType(type: string): ExerciseType {
  switch (type) {
    case 'multiple_choice':
    case 'listening_question':
    case 'reading_question':
      return 'multiple-choice';

    case 'fill_blank':
      return 'fill-blank';

    case 'matching':
      return 'matching';

    case 'true_false':
      return 'true-false';

    case 'sentence_order':
      return 'ordering';

    default:
      throw new Error(`Unsupported generated exercise type: ${type}`);
  }
}

function splitBilingualExample(example: string): {
  english: string;
  vietnamese: string;
} {
  const match = example.match(/^(.*?)\s*\(([^()]*)\)\s*$/);

  if (!match) {
    return {
      english: example.trim(),
      vietnamese: '',
    };
  }

  return {
    english: match[1].trim(),
    vietnamese: match[2].trim(),
  };
}

function mapGrammar(grammarNotes: GeneratedGrammarNote[]): GrammarRule[] {
  return grammarNotes.map((note) => ({
    title: note.topic,
    explanation: note.explanation,
    examples: note.examples.map(splitBilingualExample),
  }));
}

function mapExercises(
  lessonSlug: string,
  exercises: GeneratedExercise[],
): Exercise[] {
  return exercises.map((exercise, index) => ({
    id: `${lessonSlug}-exercise-` + String(index + 1).padStart(3, '0'),
    type: mapExerciseType(exercise.type),
    question: exercise.question,
    options: exercise.options,
    answer: exercise.correctAnswer,
    explanation: exercise.explanation,
  }));
}

function findAnswerIndex(
  options: string[],
  correctAnswer: GeneratedExercise['correctAnswer'],
): number {
  if (typeof correctAnswer === 'number') {
    return correctAnswer;
  }

  const normalizedAnswer = String(correctAnswer).trim().toLocaleLowerCase();

  const index = options.findIndex(
    (option) => option.trim().toLocaleLowerCase() === normalizedAnswer,
  );

  return index >= 0 ? index : 0;
}

function mapReadingQuestions(
  exercises: GeneratedExercise[],
): ReadingQuestion[] {
  return exercises
    .filter(
      (exercise) =>
        exercise.type === 'reading_question' && Array.isArray(exercise.options),
    )
    .map((exercise) => {
      const options = exercise.options ?? [];

      return {
        question: exercise.question,
        options,
        answer: findAnswerIndex(options, exercise.correctAnswer),
      };
    });
}

function mapListeningQuestions(
  exercises: GeneratedExercise[],
): ListeningQuestion[] {
  return exercises
    .filter(
      (exercise) =>
        exercise.type === 'listening_question' &&
        Array.isArray(exercise.options),
    )
    .map((exercise) => {
      const options = exercise.options ?? [];

      return {
        question: exercise.question,
        options,
        answer: findAnswerIndex(options, exercise.correctAnswer),
      };
    });
}

export function adaptGeneratedLesson(
  source: GeneratedLesson,
  options: LessonAdapterOptions,
): Lesson {
  const primaryDialogue = source.content.dialogues[0];

  if (!primaryDialogue) {
    throw new Error(`${source.slug}: at least one dialogue is required.`);
  }

  return {
    metadata: {
      id: options.id,
      slug: source.slug,
      title: source.title,
      description: source.description,
      level: options.level,
      category: options.category ?? 'mixed',
      estimatedMinutes: source.durationMinutes,
      tags: options.tags ?? [],
    },

    objectives: source.content.objectives,

    vocabulary: source.vocabularies.map((item) => ({
      word: item.word,
      ipa: item.ipa,
      type: item.partOfSpeech,
      meaning: item.meaning,
      example: item.example,
      exampleTranslation: item.exampleTranslation ?? item.translation,
    })),

    dialogue: {
      title: primaryDialogue.title,
      lines: primaryDialogue.lines.map((line) => ({
        speaker: line.speaker,
        text: line.english,
        translation: line.vietnamese,
      })),
    },

    grammar: mapGrammar(source.content.grammarNotes),

    reading: {
      title: 'Sarah’s First International Flight',
      passage: source.content.reading.text,
      translation: source.content.reading.translation,
      questions: mapReadingQuestions(source.exercises),
    },

    listening: {
      transcript: source.content.listening.transcript,
      questions: mapListeningQuestions(source.exercises),
    },

    speaking: [
      {
        title: 'Airport Check-in Role-play',
        instruction: [
          source.content.speaking.task,
          ...(source.content.speaking.prompts ?? []),
        ].join('\n'),
      },
    ],

    writing: [
      {
        title: 'My Last Trip',
        instruction: [
          source.content.writing.task,
          ...(source.content.writing.usefulLanguage ?? []),
          ...(source.content.writing.checklist ?? []),
        ].join('\n'),
        sample: source.content.writing.sampleAnswer ?? '',
      },
    ],

    exercises: mapExercises(source.slug, source.exercises),
  };
}
