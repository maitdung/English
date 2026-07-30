import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import { getCourseById } from "../data/courses";

function CourseDetailPage() {
  const { courseId = "" } = useParams();
  const course = getCourseById(courseId);
  const [openedModuleId, setOpenedModuleId] = useState<number>(1);

  const courseStatistics = useMemo(() => {
    if (!course) {
      return {
        totalLessons: 0,
        completedLessons: 0,
        totalMinutes: 0,
      };
    }

    const lessons = course.modules.flatMap((module) => module.lessons);

    return {
      totalLessons: lessons.length,
      completedLessons: lessons.filter((lesson) => lesson.completed).length,
      totalMinutes: lessons.reduce(
        (total, lesson) => total + lesson.duration,
        0,
      ),
    };
  }, [course]);

  if (!course) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
          <div className="text-6xl">📭</div>

          <h1 className="mt-6 text-3xl font-black">
            Không tìm thấy khóa học
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Khóa học bạn đang truy cập không tồn tại hoặc đã được thay đổi.
          </p>

          <Link
            to="/dashboard/courses"
            className="mt-7 inline-flex rounded-2xl bg-cyan-400 px-6 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const firstAvailableLesson = course.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => !lesson.locked && !lesson.completed);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <Link
        to="/dashboard/courses"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-cyan-300"
      >
        ← Danh sách khóa học
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10">
        <div className="grid lg:grid-cols-[1fr_0.45fr]">
          <div className="p-6 sm:p-8 xl:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-black text-cyan-300">
                {course.category}
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300">
                {course.level}
              </span>

              {course.featured && (
                <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-black text-amber-300">
                  Khóa học nổi bật
                </span>
              )}
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight sm:text-4xl xl:text-5xl">
              {course.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>⭐ {course.rating} đánh giá</span>
              <span>👥 {course.students} học viên</span>
              <span>📚 {course.totalLessons} bài học</span>
              <span>⏱️ {course.duration} giờ</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {course.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-72 items-center justify-center border-t border-white/10 bg-slate-950/30 p-8 lg:border-l lg:border-t-0">
            <div className="text-center">
              <div className="text-8xl">{course.icon}</div>
              <p className="mt-5 text-sm font-bold text-slate-400">
                MTD Lingo Pro
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Nội dung khóa học
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {course.modules.length} chương ·{" "}
                  {courseStatistics.totalLessons} bài học ·{" "}
                  {courseStatistics.totalMinutes} phút
                </p>
              </div>

              <p className="text-sm font-bold text-cyan-300">
                Hoàn thành {course.progress}%
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {course.modules.map((module, moduleIndex) => {
                const isOpened = openedModuleId === module.id;
                const completedLessons = module.lessons.filter(
                  (lesson) => lesson.completed,
                ).length;

                return (
                  <section
                    key={module.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenedModuleId(isOpened ? 0 : module.id)
                      }
                      className="flex w-full items-center justify-between gap-5 p-5 text-left transition hover:bg-white/[0.03]"
                    >
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                          Chương {moduleIndex + 1}
                        </p>

                        <h3 className="mt-2 text-lg font-black">
                          {module.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {module.description}
                        </p>

                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          {completedLessons}/{module.lessons.length} bài đã
                          hoàn thành
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-lg transition ${
                          isOpened ? "rotate-180" : ""
                        }`}
                      >
                        ⌄
                      </span>
                    </button>

                    {isOpened && (
                      <div className="border-t border-white/10">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            type="button"
                            disabled={lesson.locked}
                            onClick={() =>
                              console.log("Mở bài học:", lesson.title)
                            }
                            className="flex w-full items-center gap-4 border-b border-white/[0.06] p-4 text-left transition last:border-b-0 enabled:hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                                lesson.completed
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : lesson.locked
                                    ? "bg-white/5 text-slate-500"
                                    : "bg-cyan-400/10 text-cyan-300"
                              }`}
                            >
                              {lesson.completed
                                ? "✓"
                                : lesson.locked
                                  ? "🔒"
                                  : lessonIndex + 1}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold">{lesson.title}</p>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>{lesson.type}</span>
                                <span>{lesson.duration} phút</span>
                              </div>
                            </div>

                            {!lesson.locked && (
                              <span className="shrink-0 text-sm font-bold text-cyan-300">
                                {lesson.completed ? "Xem lại" : "Bắt đầu"} →
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6 xl:sticky xl:top-24">
          <h2 className="text-xl font-black">Tiến độ của bạn</h2>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[14px] border-slate-800" />

              <div
                className="absolute inset-0 rounded-full bg-[conic-gradient(#22d3ee_var(--course-progress),transparent_0)]"
                style={
                  {
                    "--course-progress": `${course.progress * 3.6}deg`,
                  } as React.CSSProperties
                }
              />

              <div className="absolute inset-[14px] rounded-full bg-slate-900" />

              <div className="relative text-center">
                <p className="text-3xl font-black">{course.progress}%</p>
                <p className="mt-1 text-xs text-slate-500">Hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Bài hoàn thành</span>
              <span className="font-black">
                {courseStatistics.completedLessons}/
                {courseStatistics.totalLessons}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Thời lượng</span>
              <span className="font-black">{course.duration} giờ</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Trình độ</span>
              <span className="font-black">{course.level}</span>
            </div>
          </div>

          <Button
            type="button"
            fullWidth
            size="large"
            className="mt-7"
            disabled={!firstAvailableLesson && course.progress === 100}
            onClick={() =>
              console.log(
                "Tiếp tục bài:",
                firstAvailableLesson?.title ?? "Đã hoàn thành",
              )
            }
          >
            {course.progress === 100 ? "Đã hoàn thành" : "Tiếp tục học"}
          </Button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Tiến độ hiện được lưu bằng dữ liệu mẫu. Backend sẽ được kết nối ở
            bước sau.
          </p>
        </aside>
      </section>
    </div>
  );
}

export default CourseDetailPage;