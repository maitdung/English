export type CourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonType =
  | "VOCABULARY"
  | "GRAMMAR"
  | "READING"
  | "LISTENING"
  | "SPEAKING"
  | "WRITING"
  | "QUIZ";

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "FILL_BLANK"
  | "MATCHING"
  | "SENTENCE_ORDER"
  | "TRUE_FALSE";

export type CourseListItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel;
  estimatedHours: number;
  publishedAt: string | null;
  unitCount: number;
  lessonCount: number;
};

export type CourseListResponse = {
  data: CourseListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CourseLessonSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: LessonType;
  orderIndex: number;
  durationMinutes: number;
  isFree: boolean;
  vocabularyCount: number;
  exerciseCount: number;
};

export type CourseUnit = {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: CourseLessonSummary[];
};

export type CourseDetail = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  level: CourseLevel;
  estimatedHours: number;
  publishedAt: string | null;
  units: CourseUnit[];
};

export type VocabularyItem = {
  id: string;
  word: string;
  phonetic: string | null;
  partOfSpeech: string | null;
  meaning: string;
  example: string | null;
  exampleTranslation: string | null;
  audioUrl: string | null;
  imageUrl: string | null;
  orderIndex: number;
};

export type LessonExercise = {
  id: string;
  type: ExerciseType;
  question: string;
  instructions: string | null;
  options: unknown;
  points: number;
  orderIndex: number;
};

export type LessonDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: LessonType;
  durationMinutes: number;
  isFree: boolean;
  content: unknown;
  unit: {
    id: string;
    title: string;
    orderIndex: number;
    course: {
      id: string;
      slug: string;
      title: string;
      level: CourseLevel;
    };
  };
  vocabularies: VocabularyItem[];
  exercises: LessonExercise[];
};