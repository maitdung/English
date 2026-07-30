import { useEffect, useState } from "react";

import type { LearningProgress } from "../types/learning";

const STORAGE_KEY = "mtd-lingo-learning-progress";

const defaultProgress: LearningProgress = {
  completedLessonIds: [],
  reviewedFlashcardIds: [],
  quizHighScore: 0,
};

function readStoredProgress(): LearningProgress {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return defaultProgress;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<LearningProgress>;

    return {
      completedLessonIds: Array.isArray(parsedValue.completedLessonIds)
        ? parsedValue.completedLessonIds
        : [],
      reviewedFlashcardIds: Array.isArray(
        parsedValue.reviewedFlashcardIds,
      )
        ? parsedValue.reviewedFlashcardIds
        : [],
      quizHighScore:
        typeof parsedValue.quizHighScore === "number"
          ? parsedValue.quizHighScore
          : 0,
    };
  } catch {
    return defaultProgress;
  }
}

export default function useLearningProgress() {
  const [progress, setProgress] =
    useState<LearningProgress>(readStoredProgress);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

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
    setProgress((currentProgress) => ({
      ...currentProgress,
      quizHighScore: Math.max(currentProgress.quizHighScore, score),
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