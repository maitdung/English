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
  difficulty?: "foundation" | "intermediate" | "advanced";
  level?: string;
  topic?: string;
};

export type LearningProgress = {
  completedLessonIds: string[];
  completedSkillIds: string[];
  reviewedFlashcardIds: string[];
  quizHighScore: number;
  reviewRecords: Record<string, ReviewRecord>;
  dailyActivity: Record<string, DailyActivity>;
  streakDays: number;
  lastActivityDate: string | null;
};

export type ReviewItemType = "vocabulary" | "flashcard" | "lesson" | "quiz";

export type ReviewRecord = {
  itemType: ReviewItemType;
  dueAt: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  attempts: number;
  correctAttempts: number;
  lastReviewedAt: string | null;
  lastScore: number;
};

export type DailyActivity = {
  completedItemIds: string[];
  minutes: number;
  score: number;
};
