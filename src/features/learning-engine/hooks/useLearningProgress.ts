import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../auth/context/AuthContext";
import type { LearningProgress } from "../types/learning";

const STORAGE_KEY_PREFIX = "mtd-lingo-learning-progress";

const defaultProgress: LearningProgress = {
  completedLessonIds: [],
  reviewedFlashcardIds: [],
  quizHighScore: 0,
};

function createDefaultProgress(): LearningProgress {
  return {
    completedLessonIds: [],
    reviewedFlashcardIds: [],
    quizHighScore: 0,
  };
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

    return {
      completedLessonIds: Array.isArray(
        parsedValue.completedLessonIds,
      )
        ? parsedValue.completedLessonIds.filter(
            (lessonId): lessonId is string =>
              typeof lessonId === "string",
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

      return {
        ...currentProgress,
        completedLessonIds: [
          ...currentProgress.completedLessonIds,
          lessonId,
        ],
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
    reviewFlashcard,
    saveQuizScore,
    resetProgress,
  };
}