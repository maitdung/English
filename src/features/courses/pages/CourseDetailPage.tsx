import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ApiError } from "../../../lib/api/api-client";
import { getCourseDetailRequest } from "../../../lib/api/courses-api";
import type { CourseDetail } from "../types/course";

const lessonTypeLabels: Record<string, string> = {
  VOCABULARY: "Từ vựng",
  GRAMMAR: "Ngữ pháp",
  READING: "Đọc hiểu",
  LISTENING: "Luyện nghe",
  SPEAKING: "Luyện nói",
  WRITING: "Luyện viết",
  QUIZ: "Kiểm tra",
};

const lessonTypeIcons: Record<string, string> = {
  VOCABULARY: "📚",
  GRAMMAR: "✍️",
  READING: "📖",
  LISTENING: "🎧",
  SPEAKING: "🎙️",
  WRITING: "📝",
  QUIZ: "✅",
};

function CourseDetailPage() {
  const { courseSlug = "" } = useParams();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [openedUnitId, setOpenedUnitId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadCourse = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getCourseDetailRequest(courseSlug);

        if (isCancelled) {
          return;
        }

        setCourse(response);
        setOpenedUnitId(response.units[0]?.id ?? null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            "Không thể tải thông tin khóa học. Vui lòng thử lại.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    if (courseSlug) {
      void loadCourse();
    } else {
      setErrorMessage("Đường dẫn khóa học không hợp lệ.");
      setIsLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [courseSlug]);

  const statistics = useMemo(() => {
    if (!course) {
      return {
        lessonCount: 0,
        vocabularyCount: 0,
        exerciseCount: 0,
        durationMinutes: 0,
      };
    }

    return course.units.reduce(
      (result, unit) => {
        for (const lesson of unit.lessons) {
          result.lessonCount += 1;
          result.vocabularyCount += lesson.vocabularyCount;
          result.exerciseCount += lesson.exerciseCount;
          result.durationMinutes += lesson.durationMinutes;
        }

        return result;
      },
      {
        lessonCount: 0,
        vocabularyCount: 0,
        exerciseCount: 0,
        durationMinutes: 0,
      },
    );
  }, [course]);

  const firstLesson = course?.units.flatMap((unit) => unit.lessons).at(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-8">
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60" />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="h-[500px] animate-pulse rounded-3xl border border-white/10 bg-slate-900/60" />
          <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60" />
        </div>
      </div>
    );
  }

  if (!course || errorMessage) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
          <div className="text-6xl">📭</div>

          <h1 className="mt-6 text-3xl font-black">Không tìm thấy khóa học</h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {errorMessage ??
              "Khóa học này không tồn tại hoặc chưa được xuất bản."}
          </p>

          <Link
            to="/dashboard/courses"
            className="mt-7 inline-flex rounded-2xl bg-cyan-400 px-6 py-3.5 font-black text-slate-950"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <Link
        to="/dashboard/courses"
        className="inline-flex text-sm font-bold text-slate-400 transition hover:text-cyan-300"
      >
        ← Quay lại danh sách khóa học
      </Link>

      <section className="premium-surface mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300">
                CEFR {course.level}
              </span>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                Đã xuất bản
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black sm:text-5xl">
              {course.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {course.description ??
                course.shortDescription ??
                "Khóa học tiếng Anh theo lộ trình có cấu trúc."}
            </p>

            <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-300">
              <span>📂 {course.units.length} unit</span>
              <span>📖 {statistics.lessonCount} bài học</span>
              <span>📚 {statistics.vocabularyCount} từ vựng</span>
              <span>✅ {statistics.exerciseCount} bài tập</span>
            </div>

            {firstLesson && (
              <Link
                to={`/dashboard/courses/${course.slug}/lessons/${firstLesson.slug}`}
                className="premium-button mt-8 inline-flex rounded-2xl bg-cyan-400 px-7 py-4 text-base font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Bắt đầu bài học đầu tiên →
              </Link>
            )}
          </div>

          <div className="flex min-h-64 items-center justify-center border-t border-white/10 bg-slate-950/30 text-8xl lg:border-l lg:border-t-0">
            {course.thumbnailUrl ? (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              "🎓"
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="premium-surface rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400">
              Nội dung khóa học
            </p>

            <h2 className="mt-2 text-2xl font-black">Lộ trình học</h2>
          </div>

          <div className="mt-6 space-y-4">
            {course.units.map((unit, unitIndex) => {
              const isOpened = openedUnitId === unit.id;

              return (
                <section
                  key={unit.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenedUnitId(isOpened ? null : unit.id)}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-white/[0.05]"
                  >
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                        Unit {unitIndex + 1}
                      </p>

                      <h3 className="mt-2 text-lg font-black">{unit.title}</h3>

                      {unit.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {unit.description}
                        </p>
                      )}

                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        {unit.lessons.length} bài học
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-xl transition ${
                        isOpened ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </button>

                  {isOpened && (
                    <div className="border-t border-white/10">
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <Link
                          key={lesson.id}
                          to={`/dashboard/courses/${course.slug}/lessons/${lesson.slug}`}
                          className="flex items-center gap-4 border-b border-white/[0.06] p-4 transition last:border-b-0 hover:bg-white/[0.04] sm:px-5"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                            {lessonTypeIcons[lesson.type] ?? "📖"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-bold">
                              {lessonIndex + 1}. {lesson.title}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>
                                {lessonTypeLabels[lesson.type] ?? lesson.type}
                              </span>

                              <span>⏱️ {lesson.durationMinutes} phút</span>

                              <span>📚 {lesson.vocabularyCount} từ</span>

                              <span>✅ {lesson.exerciseCount} bài tập</span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            {lesson.isFree && (
                              <span className="block text-[11px] font-black text-emerald-300">
                                MIỄN PHÍ
                              </span>
                            )}

                            <span className="mt-1 block text-sm font-bold text-cyan-300">
                              Học ngay →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </article>

        <aside className="premium-surface h-fit rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 xl:sticky xl:top-24">
          <h2 className="text-xl font-black">Tổng quan khóa học</h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Trình độ</span>
              <span className="font-black text-cyan-300">{course.level}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Unit</span>
              <span className="font-black">{course.units.length}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Bài học</span>
              <span className="font-black">{statistics.lessonCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Từ vựng</span>
              <span className="font-black">{statistics.vocabularyCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Bài tập</span>
              <span className="font-black">{statistics.exerciseCount}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Thời lượng nội dung</span>
              <span className="font-black">
                {statistics.durationMinutes} phút
              </span>
            </div>
          </div>

          {firstLesson && (
            <Link
              to={`/dashboard/courses/${course.slug}/lessons/${firstLesson.slug}`}
              className="premium-button mt-7 flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Bắt đầu học
            </Link>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Tiến độ cá nhân sẽ được ghi nhận ở module tiếp theo.
          </p>
        </aside>
      </section>
    </div>
  );
}

export default CourseDetailPage;
