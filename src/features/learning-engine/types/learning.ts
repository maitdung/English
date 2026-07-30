export type LessonSection = {
  id: string;
  title: string;
  content: string[];
  vocabulary?: Array<{
    word: string;
    phonetic: string;
    meaning: string;
  }>;
};

export type Lesson = {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: number;
  description: string;
  sections: LessonSection[];
};

export type Flashcard = {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  topic: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

export type LearningProgress = {
  completedLessonIds: string[];
  reviewedFlashcardIds: string[];
  quizHighScore: number;
};