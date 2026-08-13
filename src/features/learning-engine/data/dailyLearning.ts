import { flashcards, lessons } from "./lessonCatalog";
import { practiceSets } from "../../practice/data/practiceCatalog";
import { practiceSkillLabels } from "../../practice/types/practice";
import { vocabularyWords } from "../../vocabulary/data/vocabularyCatalog";
import type { LearningProgress, ReviewItemType } from "../types/learning";

export type DailyPlanItem = {
  id: string;
  title: string;
  subtitle: string;
  type: ReviewItemType;
  route: string;
  isReview: boolean;
  level?: string;
};

const DAY_LIMIT = 8;

export function getDailyPlan(
  progress: LearningProgress,
  now = new Date(),
): DailyPlanItem[] {
  const dueReviews = Object.entries(progress.reviewRecords)
    .filter(([, record]) => new Date(record.dueAt).getTime() <= now.getTime())
    .sort(
      ([, left], [, right]) =>
        new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime(),
    )
    .slice(0, 5)
    .map(([id, record]) => {
      const word = vocabularyWords.find(
        (candidate) => `vocabulary:${candidate.id}` === id,
      );
      const card = flashcards.find(
        (candidate) => `flashcard:${candidate.id}` === id,
      );
      const lesson = lessons.find(
        (candidate) => `lesson:${candidate.id}` === id,
      );
      const practiceSet = practiceSets.find(
        (candidate) => `practice:${candidate.id}` === id,
      );

      return {
        id,
        title:
          word?.word ??
          card?.word ??
          lesson?.title ??
          practiceSet?.title ??
          "Ôn tập bài học",
        subtitle:
          word?.meaning ??
          card?.meaning ??
          lesson?.description ??
          practiceSet?.description ??
          `Lần ôn thứ ${record.repetitions + 1}`,
        type: record.itemType,
        route: practiceSet
          ? `/dashboard/practice/${practiceSet.id}`
          : word || card
            ? "/dashboard/vocabulary"
            : "/dashboard/learning",
        isReview: true,
        level: word?.level ?? lesson?.level ?? practiceSet?.level,
      };
    });

  const reviewedIds = new Set(Object.keys(progress.reviewRecords));
  const availablePracticeSets = practiceSets.filter(
    (practiceSet) => !reviewedIds.has(`practice:${practiceSet.id}`),
  );
  const daySeed = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
      86_400_000,
  );
  const rotatedPracticeSets = availablePracticeSets.length
    ? [
        ...availablePracticeSets.slice(daySeed % availablePracticeSets.length),
        ...availablePracticeSets.slice(0, daySeed % availablePracticeSets.length),
      ]
    : [];
  const newPracticeItems = rotatedPracticeSets
    .slice(0, Math.min(3, Math.max(0, DAY_LIMIT - dueReviews.length)))
    .map((practiceSet) => ({
      id: `practice:${practiceSet.id}`,
      title: practiceSet.title,
      subtitle: `${practiceSkillLabels[practiceSet.skill]} · ${practiceSet.exercises.length} lượt tương tác`,
      type: "quiz" as const,
      route: `/dashboard/practice/${practiceSet.id}`,
      isReview: false,
      level: practiceSet.level,
    }));
  const newWords = vocabularyWords
    .filter(
      (word) =>
        word.status === "new" && !reviewedIds.has(`vocabulary:${word.id}`),
    )
    .slice(
      0,
      Math.max(0, DAY_LIMIT - dueReviews.length - newPracticeItems.length),
    )
    .map((word) => ({
      id: `vocabulary:${word.id}`,
      title: word.word,
      subtitle: `${word.meaning} · ${word.topic}`,
      type: "vocabulary" as const,
      route: "/dashboard/vocabulary",
      isReview: false,
      level: word.level,
    }));

  return [...dueReviews, ...newPracticeItems, ...newWords].slice(0, DAY_LIMIT);
}

export function getTodayActivity(progress: LearningProgress, now = new Date()) {
  const key = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    progress.dailyActivity[key] ?? {
      completedItemIds: [],
      minutes: 0,
      score: 0,
    }
  );
}
