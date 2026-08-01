export type PracticeSkill =
  | "vocabulary"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "grammar"
  | "toeic";

export type PracticeLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type PracticeExerciseBase = {
  id: string;
  instruction: string;
  explanation: string;
  hint?: string;
};

export type ChoiceExercise = PracticeExerciseBase & {
  type: "multiple-choice" | "listening-choice";
  prompt: string;
  options: string[];
  correctAnswer: number;
  transcript?: string;
};

export type TextExercise = PracticeExerciseBase & {
  type: "fill-blank" | "dictation";
  prompt: string;
  correctAnswer: string;
  acceptedAnswers?: string[];
  audioText?: string;
  placeholder?: string;
};

export type ReorderExercise = PracticeExerciseBase & {
  type: "reorder";
  prompt: string;
  tokens: string[];
  correctAnswer: string;
};

export type WritingChecklistItem = {
  label: string;
  keywords?: string[];
};

export type WritingExercise = PracticeExerciseBase & {
  type: "guided-writing";
  prompt: string;
  placeholder: string;
  minimumWords: number;
  checklist: WritingChecklistItem[];
  sampleAnswer: string;
};

export type SpeakingExercise = PracticeExerciseBase & {
  type: "shadowing";
  prompt: string;
  modelText: string;
  focusPoints: string[];
};

export type PracticeExercise =
  | ChoiceExercise
  | TextExercise
  | ReorderExercise
  | WritingExercise
  | SpeakingExercise;

export type PracticeSet = {
  id: string;
  title: string;
  description: string;
  skill: PracticeSkill;
  level: PracticeLevel;
  duration: number;
  icon: string;
  accent: "cyan" | "blue" | "violet" | "emerald" | "amber" | "rose" | "orange";
  tags: string[];
  featured?: boolean;
  exercises: PracticeExercise[];
};

export const practiceSkillLabels: Record<PracticeSkill, string> = {
  vocabulary: "Từ vựng",
  listening: "Luyện nghe",
  speaking: "Luyện nói",
  reading: "Luyện đọc",
  writing: "Luyện viết",
  grammar: "Ngữ pháp",
  toeic: "TOEIC",
};

export const practiceTypeLabels: Record<PracticeExercise["type"], string> = {
  "multiple-choice": "Chọn đáp án",
  "listening-choice": "Nghe & chọn",
  "fill-blank": "Điền từ",
  dictation: "Chính tả",
  reorder: "Xếp câu",
  "guided-writing": "Viết có hướng dẫn",
  shadowing: "Nói đuổi",
};
