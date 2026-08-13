import type {
  CEFRLevel,
  Course,
  Lesson,
  LessonCategory,
  VocabularyItem,
} from '../types';

export type VocabularySeed = [
  word: string,
  ipa: string,
  type: string,
  meaning: string,
  example: string,
  exampleTranslation: string,
];

type ComprehensionQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type ProgressionLessonSeed = {
  id: number;
  slug: string;
  title: string;
  category: LessonCategory;
  description: string;
  tags: string[];
  vocabulary: VocabularySeed[];
  grammarTitle: string;
  grammarExplanation: string;
  grammarExamples: Array<[english: string, vietnamese: string]>;
  dialogueTitle: string;
  dialogue: Array<[speaker: string, text: string, translation: string]>;
  readingTitle: string;
  readingPassage: string;
  readingTranslation: string;
  readingQuestions: ComprehensionQuestion[];
  listeningTranscript: string;
  listeningQuestions: ComprehensionQuestion[];
  speakingTask: string;
  writingTask: string;
  writingSample: string;
};

function makeVocabulary(seed: VocabularySeed[]): VocabularyItem[] {
  return seed.map(
    ([word, ipa, type, meaning, example, exampleTranslation]) => ({
      word,
      ipa,
      type,
      meaning,
      example,
      exampleTranslation,
    }),
  );
}

function makeExercises(seed: ProgressionLessonSeed) {
  const vocabularyExercises = seed.vocabulary.map(
    ([word, , , meaning], index) => ({
      id: `${seed.slug}-vocab-${String(index + 1).padStart(3, '0')}`,
      type: 'multiple-choice' as const,
      question: `Which word best matches this meaning: “${meaning}”?`,
      options: [
        word,
        seed.vocabulary[(index + 1) % seed.vocabulary.length][0],
        seed.vocabulary[(index + 2) % seed.vocabulary.length][0],
        seed.vocabulary[(index + 3) % seed.vocabulary.length][0],
      ],
      answer: 0,
      explanation: `${word} is the target word for “${meaning}”.`,
    }),
  );

  const readingExercises = seed.readingQuestions.map((question, index) => ({
    id: `${seed.slug}-reading-${String(index + 1).padStart(3, '0')}`,
    type: 'multiple-choice' as const,
    question: question.question,
    options: question.options,
    answer: question.answer,
    explanation:
      'The answer is supported by a specific detail or inference in the reading passage.',
  }));

  const listeningExercises = seed.listeningQuestions.map((question, index) => ({
    id: `${seed.slug}-listening-${String(index + 1).padStart(3, '0')}`,
    type: 'multiple-choice' as const,
    question: question.question,
    options: question.options,
    answer: question.answer,
    explanation:
      'The speaker states or clearly implies this information in the transcript.',
  }));

  return [
    ...vocabularyExercises,
    ...readingExercises,
    ...listeningExercises,
    {
      id: `${seed.slug}-grammar-001`,
      type: 'fill-blank' as const,
      question: `Complete the key structure from “${seed.grammarTitle}”.`,
      answer: seed.grammarExamples[0][0],
      explanation:
        'Review the model sentence and apply the grammar pattern from this chapter.',
    },
    {
      id: `${seed.slug}-ordering-001`,
      type: 'ordering' as const,
      question: 'Put the words in order: could / explain / that / you / again',
      answer: ['Could', 'you', 'explain', 'that', 'again'],
      explanation:
        'A polite request begins with “Could you”, followed by the base verb.',
    },
    {
      id: `${seed.slug}-review-001`,
      type: 'true-false' as const,
      question: `This chapter develops ${seed.category} skills through an integrated real-life context.`,
      answer: true,
      explanation:
        'The chapter combines vocabulary, grammar and the four communication skills.',
    },
  ];
}

export function createProgressionLesson(
  level: CEFRLevel,
  seed: ProgressionLessonSeed,
): Lesson {
  const estimatedMinutesByLevel: Record<CEFRLevel, number> = {
    A1: 55,
    A2: 70,
    B1: 85,
    B2: 100,
    C1: 115,
    C2: 130,
  };

  return {
    metadata: {
      id: seed.id,
      slug: seed.slug,
      title: seed.title,
      description: seed.description,
      level,
      category: seed.category,
      estimatedMinutes: estimatedMinutesByLevel[level],
      tags: [level.toLowerCase(), ...seed.tags],
    },
    objectives: [
      `Use the core vocabulary from ${seed.title} accurately in context.`,
      `Understand the main ideas and supporting details in ${level} texts.`,
      `Apply ${seed.grammarTitle} in controlled and free practice.`,
      'Produce a short spoken response and a structured written response.',
    ],
    vocabulary: makeVocabulary(seed.vocabulary),
    dialogue: {
      title: seed.dialogueTitle,
      lines: seed.dialogue.map(([speaker, text, translation]) => ({
        speaker,
        text,
        translation,
      })),
    },
    grammar: [
      {
        title: seed.grammarTitle,
        explanation: seed.grammarExplanation,
        examples: seed.grammarExamples.map(([english, vietnamese]) => ({
          english,
          vietnamese,
        })),
      },
    ],
    reading: {
      title: seed.readingTitle,
      passage: seed.readingPassage,
      translation: seed.readingTranslation,
      questions: seed.readingQuestions,
    },
    listening: {
      transcript: seed.listeningTranscript,
      questions: seed.listeningQuestions,
    },
    speaking: [
      {
        title: `${seed.title} role-play`,
        instruction: seed.speakingTask,
      },
      {
        title: 'One-minute reflection',
        instruction:
          'Speak for one minute. Use at least five target words and one grammar structure from the chapter.',
      },
    ],
    writing: [
      {
        title: `${seed.title} writing`,
        instruction: seed.writingTask,
        sample: seed.writingSample,
      },
    ],
    exercises: makeExercises(seed),
  };
}

export function createProgressionCourse(
  id: string,
  level: CEFRLevel,
  title: string,
  description: string,
  seeds: ProgressionLessonSeed[],
): Course {
  return {
    id,
    level,
    title,
    description,
    lessons: seeds.map((seed) => createProgressionLesson(level, seed)),
  };
}
