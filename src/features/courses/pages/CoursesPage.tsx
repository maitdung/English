import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../components/ui/Input/Input";
import { courses, type CourseLevel } from "../data/courses";

const categories = [
  "Tất cả",
  "Nền tảng",
  "Giao tiếp",
  "Từ vựng",
  "Luyện nghe",
  "TOEIC",
];

const levels: Array<"Tất cả" | CourseLevel> = [
  "Tất cả",
  "Cơ bản",
  "Trung cấp",
  "Nâng cao",
];

function CoursesPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState<
    "Tất cả" | CourseLevel
  >("Tất cả");

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.shortDescription.toLowerCase().includes(normalizedSearch) ||
        course.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "Tất cả" ||
        course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "Tất cả" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchValue, selectedCategory, selectedLevel]);

  const inProgressCourses = courses.filter(
    (course) => course.progress > 0 && course.progress < 100,
  ).length;

  const completedCourses = courses.filter(
    (course) => course.progress === 100,
  ).length;

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Khám phá khóa học
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Chọn khóa học phù hợp với bạn
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Học theo mục tiêu, trình độ và kỹ năng bạn muốn cải thiện. Mỗi khóa
          học đều có lộ trình rõ ràng và hệ thống theo dõi tiến độ.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng khóa học</p>
          <p className="mt-2 text-3xl font-black">{courses.length}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Nhiều chủ đề khác nhau
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đang học</p>
          <p className="mt-2 text-3xl font-black">{inProgressCourses}</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Tiếp tục duy trì tiến độ
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đã hoàn thành</p>
          <p className="mt-2 text-3xl font-black">{completedCourses}</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Khóa học hoàn tất
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-5">
          <p className="text-sm text-slate-400">Tổng bài học</p>
          <p className="mt-2 text-3xl font-black">
            {courses.reduce(
              (total, course) => total + course.totalLessons,
              0,
            )}
          </p>
          <p className="mt-5 text-xs font-semibold text-amber-300">
            Nội dung đang cập nhật
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
          <Input
            id="course-search"
            label="Tìm kiếm khóa học"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Nhập tên hoặc chủ đề khóa học..."
            rightElement={<span aria-hidden="true">🔍</span>}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="course-category"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Chủ đề
              </label>

              <select
                id="course-category"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/60"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
                    event.target.value as "Tất cả" | CourseLevel,
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/60"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Danh sách khóa học</h2>

            <p className="mt-1 text-sm text-slate-500">
              Tìm thấy {filteredCourses.length} khóa học
            </p>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 transition hover:-translate-y-1 hover:border-cyan-400/25"
              >
                <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-500/20 via-slate-900 to-violet-500/15">
                  <div className="text-7xl transition duration-300 group-hover:scale-110">
                    {course.icon}
                  </div>

                  {course.featured && (
                    <span className="absolute left-4 top-4 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-black text-amber-300">
                      Nổi bật
                    </span>
                  )}

                  <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-slate-300">
                    {course.level}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                      {course.category}
                    </span>

                    <span className="text-xs font-bold text-amber-300">
                      ⭐ {course.rating}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black">
                    {course.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                    {course.shortDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {course.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 text-xs text-slate-500">
                    <span>📚 {course.totalLessons} bài</span>
                    <span>⏱️ {course.duration} giờ</span>
                    <span>👥 {course.students}</span>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">
                        Tiến độ
                      </span>

                      <span className="font-black text-cyan-300">
                        {course.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${
                          course.progress === 100
                            ? "bg-emerald-400"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/dashboard/courses/${course.id}`}
                    className="mt-6 flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                  >
                    {course.progress === 100
                      ? "Xem lại khóa học"
                      : course.progress > 0
                        ? "Tiếp tục học"
                        : "Xem khóa học"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-5 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-5 text-xl font-black">
              Không tìm thấy khóa học
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Hãy thay đổi từ khóa hoặc bộ lọc đang chọn.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setSelectedCategory("Tất cả");
                setSelectedLevel("Tất cả");
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