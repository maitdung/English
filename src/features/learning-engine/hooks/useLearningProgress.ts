import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../auth/context/AuthContext";
import type {
  DailyActivity,
  LearningProgress,
  ReviewItemType,
} from "../types/learning";

const STORAGE_KEY_PREFIX = "mtd-lingo-learning-progress";

const defaultProgress: LearningProgress = {
  completedLessonIds: [],
  completedSkillIds: [],
  reviewedFlashcardIds: [],
  quizHighScore: 0,
  reviewRecords: {},
  dailyActivity: {},
  streakDays: 0,
  lastActivityDate: null,
};

function createDefaultProgress(): LearningProgress {
  return {
    completedLessonIds: [],
    completedSkillIds: [],
    reviewedFlashcardIds: [],
    quizHighScore: 0,
    reviewRecords: {},
    dailyActivity: {},
    streakDays: 0,
    lastActivityDate: null,
  };
}

function dateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): string {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
}

function readStoredProgress(storageKey: string): LearningProgress {
  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return createDefaultProgress();
    }

    const parsedValue = JSON.parse(
      storedValue,
    ) as Partial<LearningProgress>;

    const rawRecords =
      parsedValue.reviewRecords &&
      typeof parsedValue.reviewRecords === "object"
        ? parsedValue.reviewRecords
        : {};
    const reviewRecords = Object.fromEntries(
      Object.entries(rawRecords).filter(([, value]) => {
        if (!value || typeof value !== "object") return false;
        const record = value as Record<string, unknown>;
        return (
          typeof record.itemType === "string" &&
          typeof record.dueAt === "string"
        );
      }),
    ) as LearningProgress["reviewRecords"];
    const rawDailyActivity =
      parsedValue.dailyActivity &&
      typeof parsedValue.dailyActivity === "object"
        ? parsedValue.dailyActivity
        : {};
    const dailyActivity = Object.fromEntries(
      Object.entries(rawDailyActivity).map(([key, value]) => {
        const activity = (value ?? {}) as Partial<DailyActivity>;
        return [
          key,
          {
            completedItemIds: Array.isArray(activity.completedItemIds)
              ? activity.completedItemIds.filter(
                  (itemId): itemId is string => typeof itemId === "string",
                )
              : [],
            minutes:
              typeof activity.minutes === "number"
                ? Math.max(0, activity.minutes)
                : 0,
            score:
              typeof activity.score === "number"
                ? Math.max(0, Math.min(100, activity.score))
                : 0,
          },
        ];
      }),
    ) as LearningProgress["dailyActivity"];

    return {
      completedLessonIds: Array.isArray(
        parsedValue.completedLessonIds,
      )
        ? parsedValue.completedLessonIds.filter(
            (lessonId): lessonId is string =>
              typeof lessonId === "string",
          )
        : [],
      completedSkillIds: Array.isArray(parsedValue.completedSkillIds)
        ? parsedValue.completedSkillIds.filter(
            (skillId): skillId is string =>
              typeof skillId === "string",
          )
        : [],
      reviewedFlashcardIds: Array.isArray(
        parsedValue.reviewedFlashcardIds,
      )
        ? parsedValue.reviewedFlashcardIds.filter(
            (flashcardId): flashcardId is string =>
              typeof flashcardId === "string",
          )
        : [],
      quizHighScore:
        typeof parsedValue.quizHighScore === "number"
          ? Math.max(0, Math.min(100, parsedValue.quizHighScore))
          : 0,
      reviewRecords,
      dailyActivity,
      streakDays:
        typeof parsedValue.streakDays === "number"
          ? Math.max(0, Math.floor(parsedValue.streakDays))
          : 0,
      lastActivityDate:
        typeof parsedValue.lastActivityDate === "string"
          ? parsedValue.lastActivityDate
          : null,
    };
  } catch {
    return createDefaultProgress();
  }
}

export default function useLearningProgress() {
  const { user } = useAuth();

  const storageKey = useMemo(() => {
    const userId = user?.id ?? "guest";

    return `${STORAGE_KEY_PREFIX}:${userId}`;
  }, [user?.id]);

  const [progress, setProgress] = useState<LearningProgress>(() =>
    readStoredProgress(storageKey),
  );

  useEffect(() => {
    setProgress(readStoredProgress(storageKey));
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(progress),
    );
  }, [progress, storageKey]);

  const completeLesson = (lessonId: string) => {
    setProgress((currentProgress) => {
      if (currentProgress.completedLessonIds.includes(lessonId)) {
        return currentProgress;
      }

      const now = new Date();
      const today = dateKey(now);
      const previousActivity = currentProgress.dailyActivity[today] ?? {
        completedItemIds: [],
        minutes: 0,
        score: 0,
      };
      const previousDay = new Date(now);
      previousDay.setDate(previousDay.getDate() - 1);
      const nextStreak =
        currentProgress.lastActivityDate === dateKey(previousDay)
          ? currentProgress.streakDays + 1
          : currentProgress.lastActivityDate === today
            ? currentProgress.streakDays
            : 1;

      return {
        ...currentProgress,
        completedLessonIds: [
          ...currentProgress.completedLessonIds,
          lessonId,
        ],
        dailyActivity: {
          ...currentProgress.dailyActivity,
          [today]: {
            ...previousActivity,
            completedItemIds: [
              ...new Set([...previousActivity.completedItemIds, lessonId]),
            ],
            minutes: previousActivity.minutes + 15,
          },
        },
        streakDays: nextStreak,
        lastActivityDate: today,
      };
    });
  };

  const reviewFlashcard = (flashcardId: string) => {
    setProgress((currentProgress) => {
      if (
        currentProgress.reviewedFlashcardIds.includes(flashcardId)
      ) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        reviewedFlashcardIds: [
          ...currentProgress.reviewedFlashcardIds,
          flashcardId,
        ],
      };
    });
  };

  const recordReview = (
    itemId: string,
    itemType: ReviewItemType,
    score: number,
    minutes = 5,
  ) => {
    const normalizedScore = Math.max(0, Math.min(100, score));

    setProgress((currentProgress) => {
      const now = new Date();
      const today = dateKey(now);
      const existing = currentProgress.reviewRecords[itemId];
      const passed = normalizedScore >= 70;
      const repetitions = passed ? (existing?.repetitions ?? 0) + 1 : 0;
      const previousInterval = existing?.intervalDays ?? 0;
      const intervalDays = passed
        ? repetitions <= 1
          ? 1
          : repetitions === 2
            ? 3
            : Math.min(60, Math.max(7, Math.round(previousInterval * 2.2)))
        : 1;
      const easeFactor = Math.max(
        1.3,
        Math.min(
          2.8,
          (existing?.easeFactor ?? 2.2) +
            (passed ? 0.05 : -0.2),
        ),
      );
      const currentDay = currentProgress.dailyActivity[today] ?? {
        completedItemIds: [],
        minutes: 0,
        score: 0,
      };
      const previousDay = new Date(now);
      previousDay.setDate(previousDay.getDate() - 1);
      const nextStreak =
        currentProgress.lastActivityDate === dateKey(previousDay)
          ? currentProgress.streakDays + 1
          : currentProgress.lastActivityDate === today
            ? currentProgress.streakDays
            : 1;

      return {
        ...currentProgress,
        reviewRecords: {
          ...currentProgress.reviewRecords,
          [itemId]: {
            itemType,
            dueAt: addDays(now, intervalDays),
            intervalDays,
            easeFactor,
            repetitions,
            attempts: (existing?.attempts ?? 0) + 1,
            correctAttempts:
              (existing?.correctAttempts ?? 0) + (passed ? 1 : 0),
            lastReviewedAt: now.toISOString(),
            lastScore: normalizedScore,
          },
        },
        dailyActivity: {
          ...currentProgress.dailyActivity,
          [today]: {
            completedItemIds: [
              ...new Set([...currentDay.completedItemIds, itemId]),
            ],
            minutes: currentDay.minutes + Math.max(1, minutes),
            score: Math.max(currentDay.score, normalizedScore),
          },
        },
        streakDays: nextStreak,
        lastActivityDate: today,
      };
    });
  };

  const completeSkill = (skillId: string) => {
    setProgress((currentProgress) => {
      if (currentProgress.completedSkillIds.includes(skillId)) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        completedSkillIds: [
          ...currentProgress.completedSkillIds,
          skillId,
        ],
      };
    });
  };

  const saveQuizScore = (score: number) => {
    const normalizedScore = Math.max(0, Math.min(100, score));

    setProgress((currentProgress) => ({
      ...currentProgress,
      quizHighScore: Math.max(
        currentProgress.quizHighScore,
        normalizedScore,
      ),
    }));
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
  };

  return {
    progress,
    completeLesson,
    completeSkill,
    reviewFlashcard,
    saveQuizScore,
    recordReview,
    resetProgress,
  };
}
