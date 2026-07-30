import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import { getCoursesRequest } from "../../../lib/api/courses-api";
import type {
  CourseLevel,
  CourseListItem,
} from "../types/course";

const levels: Array<"ALL" | CourseLevel> = [
  "ALL",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const levelLabels: Record<"ALL" | CourseLevel, string> = {
  ALL: "Tất cả",
  A1: "A1 — Mới bắt đầu",
  A2: "A2 — Sơ cấp",
  B1: "B1 — Trung cấp",
  B2: "B2 — Trung cao cấp",
  C1: "C1 — Nâng cao",
  C2: "C2 — Thành thạo",
};

const courseIcons: Record<CourseLevel, string> = {
  A1: "🌱",
  A2: "🌿",
  B1: "🚀",
  B2: "🎯",
  C1: "🏆",
  C2: "👑",
};

function CoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<
    "ALL" | CourseLevel
  >("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const timer = window.setTimeout(() => {
      const loadCourses = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const response = await getCoursesRequest({
            search: searchValue,
            level:
              selectedLevel === "ALL" ? undefined : selectedLevel,
            page: 1,
            limit: 50,
          });

          if (!isCancelled) {
            setCourses(response.data);
          }
        } catch (error) {
          if (isCancelled) {
            return;
          }

          if (error instanceof ApiError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage(
              "Không thể tải danh sách khóa học. Vui lòng thử lại.",
            );
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

      void loadCourses();
    }, 300);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchValue, selectedLevel]);

  const totalLessons = courses.reduce(
    (total, course) => total + course.lessonCount,
    0,
  );

  const totalUnits = courses.reduce(
    (total, course) => total + course.unitCount,
    0,
  );

  const totalHours = courses.reduce(
    (total, course) => total + course.estimatedHours,
    0,
  );

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Khám phá khóa học
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Học tiếng Anh theo lộ trình rõ ràng
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Nội dung khóa học được tải trực tiếp từ hệ thống học tập,
          sắp xếp theo trình độ CEFR từ A1 đến C2.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Khóa học hiện có</p>
          <p className="mt-2 text-3xl font-black">
            {isLoading ? "—" : courses.length}
          </p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Dữ liệu từ PostgreSQL
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng chương học</p>
          <p className="mt-2 text-3xl font-black">
            {isLoading ? "—" : totalUnits}
          </p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Lộ trình được tổ chức theo unit
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng bài học</p>
          <p className="mt-2 text-3xl font-black">
            {isLoading ? "—" : totalLessons}
          </p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Từ vựng, ngữ pháp và kỹ năng
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-5">
          <p className="text-sm text-slate-400">Thời lượng ước tính</p>
          <p className="mt-2 text-3xl font-black">
            {isLoading ? "—" : `${totalHours} giờ`}
          </p>
          <p className="mt-5 text-xs font-semibold text-amber-300">
            Học theo tốc độ cá nhân
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px] lg:items-end">
          <Input
            id="course-search"
            label="Tìm kiếm khóa học"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Nhập tên hoặc mô tả khóa học..."
            rightElement={<span aria-hidden="true">🔍</span>}
          />

          <div>
            <label
              htmlFor="course-level"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Trình độ
            </label>

            <select
              id="course-level"
              value={selectedLevel}
              onChange={(event) =>
                setSelectedLevel(
                  event.target.value as "ALL" | CourseLevel,
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/60"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {levelLabels[level]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">
              Danh sách khóa học
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isLoading
                ? "Đang tải dữ liệu..."
                : `Tìm thấy ${courses.length} khóa học`}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
            <p className="font-bold text-red-300">
              Không thể tải khóa học
            </p>

            <p className="mt-2 text-sm text-red-200/80">
              {errorMessage}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              Kiểm tra backend có đang chạy ở cổng 3001 không.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[470px] animate-pulse rounded-3xl border border-white/10 bg-slate-900/60"
              />
            ))}
          </div>
        )}

        {!isLoading && !errorMessage && courses.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-500/20 via-slate-900 to-violet-500/15">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-7xl transition duration-300 group-hover:scale-110">
                      {courseIcons[course.level]}
                    </div>
                  )}

                  <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1.5 text-xs font-black text-cyan-300 backdrop-blur">
                    CEFR {course.level}
                  </span>

                  {course.publishedAt && (
                    <span className="absolute left-4 top-4 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300 backdrop-blur">
                      Đã xuất bản
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                    English {course.level}
                  </p>

                  <h3 className="mt-3 text-xl font-black">
                    {course.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                    {course.shortDescription ??
                      "Khóa học tiếng Anh theo lộ trình có cấu trúc."}
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                      <p className="text-lg font-black">
                        {course.unitCount}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Unit
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                      <p className="text-lg font-black">
                        {course.lessonCount}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Bài học
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-3 text-center">
                      <p className="text-lg font-black">
                        {course.estimatedHours}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Giờ
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/dashboard/courses/${course.slug}`}
                    className="mt-6 flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                  >
                    Xem lộ trình học →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && !errorMessage && courses.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-5 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-5 text-xl font-black">
              Không tìm thấy khóa học
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Hãy thay đổi từ khóa hoặc trình độ đang chọn.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setSelectedLevel("ALL");
              }}
              className="mt-5 text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default CoursesPage;