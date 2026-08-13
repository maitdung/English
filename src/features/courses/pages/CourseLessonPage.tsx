import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import { ApiError } from "../../../lib/api/api-client";
import {
  checkLessonExerciseRequest,
  getLessonDetailRequest,
} from "../../../lib/api/courses-api";
import {
  completeLessonRequest,
  enrollCourseRequest,
  recordExerciseAttemptRequest,
} from "../../../lib/api/learning-progress-api";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import type {
  ExerciseCheckResponse,
  LessonDetail,
  LessonExercise,
} from "../types/course";

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatAnswer(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(String).join(" ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function ContentValue({
  value,
  label,
}: {
  value: unknown;
  label?: string;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
        {label && (
          <h3 className="mb-3 font-black text-cyan-300">
            {humanizeKey(label)}
          </h3>
        )}
        <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
          {String(value)}
        </p>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <p>{value ? "Có" : "Không"}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <section>
        {label && (
          <h3 className="mb-3 text-lg font-black text-cyan-300">
            {humanizeKey(label)}
          </h3>
        )}
        <div className="space-y-3">
          {value.map((item, index) => (
            <ContentValue key={index} value={item} />
          ))}
        </div>
      </section>
    );
  }

  if (typeof value === "object") {
    return (
      <section className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
        {label && (
          <h3 className="text-lg font-black text-cyan-300">
            {humanizeKey(label)}
          </h3>
        )}
        {Object.entries(value).map(([key, item]) => (
          <ContentValue key={key} label={key} value={item} />
        ))}
      </section>
    );
  }

  return null;
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

function ExerciseAnswerField({
  exercise,
  value,
  onChange,
}: {
  exercise: LessonExercise;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const options = Array.isArray(exercise.options)
    ? exercise.options
    : null;

  if (exercise.type === "TRUE_FALSE") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Đúng", value: true },
          { label: "Sai", value: false },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
              value === option.value
                ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-200"
                : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/25"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  if (options && exercise.type !== "SENTENCE_ORDER") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const submittedValue =
            exercise.type === "MULTIPLE_CHOICE" ? index : option;
          const isSelected = value === submittedValue;

          return (
            <button
              key={`${String(option)}-${index}`}
              type="button"
              onClick={() => onChange(submittedValue)}
              className={`rounded-xl border p-3 text-left text-sm transition ${
                isSelected
                  ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/25"
              }`}
            >
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                {String.fromCharCode(65 + index)}
              </span>
              {String(option)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <input
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={
        exercise.type === "SENTENCE_ORDER"
          ? "Nhập câu theo đúng thứ tự..."
          : "Nhập đáp án của bạn..."
      }
      className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
    />
  );
}

function CourseLessonPage() {
  const { courseSlug = "", lessonSlug = "" } = useParams();
  const { progress, completeLesson, recordReview } = useLearningProgress();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<
    Record<string, ExerciseCheckResponse>
  >({});
  const [checkingExerciseId, setCheckingExerciseId] = useState<string | null>(
    null,
  );
  const [isSavingLessonProgress, setIsSavingLessonProgress] = useState(false);
  const [exerciseError, setExerciseError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getLessonDetailRequest(courseSlug, lessonSlug)
      .then((response) => {
        if (!cancelled) {
          setLesson(response);
          void enrollCourseRequest(courseSlug).catch(() => undefined);
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(
            reason instanceof ApiError
              ? reason.message
              : "Không thể tải nội dung bài học.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseSlug, lessonSlug]);

  const handleCheckExercise = async (exercise: LessonExercise) => {
    const answer = answers[exercise.id];

    if (
      answer === undefined ||
      (typeof answer === "string" && !answer.trim())
    ) {
      setExerciseError("Hãy chọn hoặc nhập đáp án trước khi kiểm tra.");
      return;
    }

    try {
      setExerciseError("");
      setCheckingExerciseId(exercise.id);
      const result = await checkLessonExerciseRequest(
        courseSlug,
        lessonSlug,
        exercise.id,
        answer,
      );
      setResults((currentResults) => ({
        ...currentResults,
        [exercise.id]: result,
      }));
      void recordExerciseAttemptRequest(
        courseSlug,
        lessonSlug,
        exercise.id,
        answer,
      ).catch(() => undefined);
      recordReview(
        `exercise:${exercise.id}`,
        "lesson",
        result.maxPoints > 0
          ? Math.round((result.pointsEarned / result.maxPoints) * 100)
          : result.isCorrect
            ? 100
            : 0,
        2,
      );
    } catch (reason) {
      setExerciseError(
        reason instanceof ApiError
          ? reason.message
          : "Không thể kiểm tra đáp án. Vui lòng thử lại.",
      );
    } finally {
      setCheckingExerciseId(null);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson) {
      return;
    }

    try {
      setIsSavingLessonProgress(true);
      await completeLessonRequest(courseSlug, lessonSlug, {
        progressPercent: 100,
        score:
          checkedResults.length > 0
            ? Math.round((correctAnswers / lesson.exercises.length) * 100)
            : 0,
        timeSpentMinutes: lesson.durationMinutes,
      });
    } catch {
      // Server sync is best-effort; local progress still updates below.
    } finally {
      completeLesson(lesson.id);
      setIsSavingLessonProgress(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-900/60" />
      </div>
    );
  }

  if (!lesson || error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
          <div className="text-6xl">📭</div>
          <h1 className="mt-5 text-3xl font-black">Không tìm thấy bài học</h1>
          <p className="mt-3 text-slate-400">{error}</p>
          <Link
            to={`/dashboard/courses/${courseSlug}`}
            className="mt-7 inline-flex rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
          >
            Quay lại khóa học
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = progress.completedLessonIds.includes(lesson.id);
  const checkedResults = Object.values(results);
  const correctAnswers = checkedResults.filter(
    (result) => result.isCorrect,
  ).length;
  const earnedPoints = checkedResults.reduce(
    (total, result) => total + result.pointsEarned,
    0,
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9">
      <Link
        to={`/dashboard/courses/${courseSlug}`}
        className="text-sm font-bold text-slate-400 hover:text-cyan-300"
      >
        ← {lesson.unit.course.title}
      </Link>

      <header className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-6 sm:p-9">
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-cyan-300">
            {lesson.unit.course.level}
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1.5 text-slate-300">
            {lesson.type}
          </span>
          {isCompleted && (
            <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-emerald-300">
              ✓ Đã hoàn thành
            </span>
          )}
        </div>
        <h1 className="mt-5 text-3xl font-black sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-4 leading-7 text-slate-400">{lesson.description}</p>
        <p className="mt-4 text-sm text-slate-500">
          ⏱️ {lesson.durationMinutes} phút · 📚 {lesson.vocabularies.length} từ ·
          ✅ {lesson.exercises.length} bài tập
        </p>
      </header>

      <main className="mt-6 space-y-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <h2 className="mb-6 text-2xl font-black">Nội dung bài học</h2>
          <ContentValue value={lesson.content} />
        </section>

        {lesson.vocabularies.length > 0 && (
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
            <h2 className="text-2xl font-black">Từ vựng</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {lesson.vocabularies.map((item) => (
                <article key={item.id} className="rounded-2xl bg-white/[0.035] p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black">{item.word}</h3>
                      <p className="text-sm text-cyan-300">{item.phonetic}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speak(item.word)}
                      aria-label={`Phát âm ${item.word}`}
                      className="h-10 w-10 rounded-xl bg-cyan-400/10"
                    >
                      🔊
                    </button>
                  </div>
                  <p className="mt-3 text-slate-300">{item.meaning}</p>
                  {item.example && (
                    <p className="mt-3 text-sm italic text-slate-500">
                      {item.example}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {lesson.exercises.length > 0 && (
          <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">Bài tập luyện tập</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Đã kiểm tra {checkedResults.length}/{lesson.exercises.length} câu
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-3 text-sm">
                <span className="font-black text-cyan-200">
                  {correctAnswers} đúng
                </span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="font-black text-violet-200">
                  {earnedPoints} điểm
                </span>
              </div>
            </div>

            {exerciseError && (
              <p
                role="alert"
                className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300"
              >
                {exerciseError}
              </p>
            )}

            <div className="mt-6 space-y-4">
              {lesson.exercises.map((exercise, index) => (
                <article key={exercise.id} className="rounded-2xl bg-white/[0.035] p-5">
                  <p className="text-xs font-black text-cyan-300">
                    CÂU {index + 1} · {exercise.points} ĐIỂM
                  </p>
                  <h3 className="mt-2 font-bold">{exercise.question}</h3>
                  {exercise.instructions && (
                    <p className="mt-2 text-sm text-slate-500">
                      {exercise.instructions}
                    </p>
                  )}
                  <div className="mt-4">
                    <ExerciseAnswerField
                      exercise={exercise}
                      value={answers[exercise.id]}
                      onChange={(answer) => {
                        setExerciseError("");
                        setAnswers((currentAnswers) => ({
                          ...currentAnswers,
                          [exercise.id]: answer,
                        }));
                        setResults((currentResults) => {
                          const nextResults = { ...currentResults };
                          delete nextResults[exercise.id];
                          return nextResults;
                        });
                      }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="button"
                      size="small"
                      variant="secondary"
                      isLoading={checkingExerciseId === exercise.id}
                      onClick={() => void handleCheckExercise(exercise)}
                    >
                      Kiểm tra
                    </Button>

                    {results[exercise.id] && (
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-black ${
                          results[exercise.id].isCorrect
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {results[exercise.id].isCorrect
                          ? `✓ +${results[exercise.id].pointsEarned} điểm`
                          : "Chưa chính xác"}
                      </span>
                    )}
                  </div>

                  {results[exercise.id] && (
                    <div
                      className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
                        results[exercise.id].isCorrect
                          ? "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-100/80"
                          : "border-amber-400/15 bg-amber-400/[0.05] text-amber-100/80"
                      }`}
                    >
                      <p>
                        <strong>Đáp án:</strong>{" "}
                        {formatAnswer(results[exercise.id].correctAnswer)}
                      </p>
                      {results[exercise.id].explanation && (
                        <p className="mt-1">
                          {results[exercise.id].explanation}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-gradient-to-r from-cyan-400/[0.08] to-violet-400/[0.08] p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div>
                <h3 className="font-black">Hoàn tất bài học</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Kiểm tra ít nhất một câu rồi ghi nhận bài học vào tiến độ cá nhân.
                </p>
              </div>
              <Button
                type="button"
                className="mt-4 w-full sm:mt-0 sm:w-auto"
                disabled={checkedResults.length === 0 || isCompleted}
                isLoading={isSavingLessonProgress}
                onClick={() => void handleCompleteLesson()}
              >
                {isCompleted ? "Đã hoàn thành ✓" : "Đánh dấu hoàn thành"}
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CourseLessonPage;
