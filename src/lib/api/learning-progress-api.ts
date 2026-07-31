import { apiRequest } from "./api-client";
import { getStoredAccessToken } from "./session";

export type LearningProgressSummary = {
  streakDays: number;
  totalMinutes: number;
  quizHighScore: number;
  completedLessons: number;
  inProgressLessons: number;
  completedEnrollments: number;
  enrollmentCount: number;
  lessonProgressCount: number;
  exerciseAttemptCount: number;
  vocabularyReviewCount: number;
};

export type ExerciseAttemptResponse = {
  isCorrect: boolean;
  correctAnswer: unknown;
  explanation: string | null;
  pointsEarned: number;
  maxPoints: number;
};

export function getLearningProgressRequest(): Promise<LearningProgressSummary> {
  return apiRequest<LearningProgressSummary>("/learning-progress/me", {
    method: "GET",
    accessToken: getStoredAccessToken(),
  });
}

export function enrollCourseRequest(courseSlug: string): Promise<unknown> {
  return apiRequest(`/learning-progress/courses/${encodeURIComponent(courseSlug)}/enroll`, {
    method: "POST",
    accessToken: getStoredAccessToken(),
  });
}

export function completeLessonRequest(
  courseSlug: string,
  lessonSlug: string,
  payload: {
    progressPercent?: number;
    score?: number;
    timeSpentMinutes?: number;
  } = {},
): Promise<unknown> {
  return apiRequest(
    `/learning-progress/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/complete`,
    {
      method: "POST",
      accessToken: getStoredAccessToken(),
      body: payload,
    },
  );
}

export function recordExerciseAttemptRequest(
  courseSlug: string,
  lessonSlug: string,
  exerciseId: string,
  answer: unknown,
): Promise<ExerciseAttemptResponse> {
  return apiRequest<ExerciseAttemptResponse>(
    `/learning-progress/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/exercises/${encodeURIComponent(exerciseId)}/attempt`,
    {
      method: "POST",
      accessToken: getStoredAccessToken(),
      body: {
        answer,
      },
    },
  );
}

export function reviewVocabularyRequest(
  vocabularyId: string,
  score: number,
): Promise<unknown> {
  return apiRequest(`/learning-progress/vocabularies/${encodeURIComponent(vocabularyId)}/review`, {
    method: "POST",
    accessToken: getStoredAccessToken(),
    body: {
      score,
    },
  });
}
