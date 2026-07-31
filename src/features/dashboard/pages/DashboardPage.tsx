import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import { getCoursesRequest } from "../../../lib/api/courses-api";
import {
  getDailyPlan,
  getTodayActivity,
} from "../../learning-engine/data/dailyLearning";
import { useAuth } from "../../auth/context/AuthContext";
import {
  flashcards,
  lessons,
} from "../../learning-engine/data/lessonCatalog";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";

const trackedSkillIds = [
  "vocabulary",
  "listening",
  "speaking",
  "reading",
  "writing",
  "grammar",
  "test",
];

const staticLessonIds = new Set(lessons.map((lesson) => lesson.id));

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useLearningProgress();
  const [backendLessonCount, setBackendLessonCount] = useState(0);
  const todayPlan = useMemo(() => getDailyPlan(progress), [progress]);
  const todayActivity = useMemo(
    () => getTodayActivity(progress),
    [progress],
  );
  const weeklyActivity = useMemo(() => {
    const items: Array<{ day: string; value: number }> = [];
    const now = new Date();

    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - offset);
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
      const activity = progress.dailyActivity[key];
      items.push({
        day: new Intl.DateTimeFormat("vi-VN", {
          weekday: "short",
        })
          .format(date)
          .replace(".", ""),
        value: Math.min(
          100,
          activity ? Math.max(activity.minutes * 2, 4) : 4,
        ),
      });
    }

    return items;
  }, [progress.dailyActivity]);

  useEffect(() => {
    let cancelled = false;

    getCoursesRequest({ limit: 50 })
      .then((response) => {
        if (!cancelled) {
          setBackendLessonCount(
            response.data.reduce(
              (total, course) => total + course.lessonCount,
              0,
            ),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBackendLessonCount(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const completedLessonIds = useMemo(
    () => [...new Set(progress.completedLessonIds)],
    [progress.completedLessonIds],
  );

  const completedLessons = useMemo(
    () =>
      lessons.filter((lesson) =>
        completedLessonIds.includes(lesson.id),
      ),
    [completedLessonIds],
  );

  const reviewedFlashcards = useMemo(
    () =>
      flashcards.filter((flashcard) =>
        progress.reviewedFlashcardIds.includes(flashcard.id),
      ),
    [progress.reviewedFlashcardIds],
  );

  const completedLessonCount = completedLessonIds.length;
  const completedBackendLessonCount = completedLessonIds.filter(
    (lessonId) => !staticLessonIds.has(lessonId),
  ).length;
  const totalLessonCount = lessons.length + backendLessonCount;
  const safeTotalLessonCount = Math.max(
    totalLessonCount,
    completedLessonCount,
  );
  const reviewedFlashcardCount = reviewedFlashcards.length;

  const totalLearningMinutes = completedLessons.reduce(
    (totalMinutes, lesson) => totalMinutes + lesson.duration,
    0,
  );

  const totalLearningItems =
    safeTotalLessonCount +
    flashcards.length +
    trackedSkillIds.length +
    1;

  const completedSkillCount = trackedSkillIds.filter((skillId) =>
    progress.completedSkillIds.includes(skillId),
  ).length;

  const completedLearningItems =
    completedLessonCount +
    reviewedFlashcardCount +
    completedSkillCount +
    (progress.quizHighScore > 0 ? 1 : 0);

  const overallProgress =
    totalLearningItems > 0
      ? Math.min(
          100,
          Math.round(
            (completedLearningItems / totalLearningItems) * 100,
          ),
        )
      : 0;

  const lessonGoal = Math.min(completedLessonCount, 1);
  const vocabularyGoal = Math.min(reviewedFlashcardCount, 5);
  const quizGoal = progress.quizHighScore >= 60 ? 1 : 0;

  const goalProgress = Math.round(
    ((lessonGoal + vocabularyGoal / 5 + quizGoal) / 3) * 100,
  );

  const goalDegrees = Math.round((goalProgress / 100) * 360);

  const overviewCards = [
    {
      label: "Bài học hoàn thành",
      value: String(completedLessonCount),
      detail:
        completedLessonCount > 0
          ? `${completedLessonCount}/${safeTotalLessonCount} bài trong chương trình`
          : "Chưa hoàn thành bài học nào",
      icon: "📘",
    },
    {
      label: "Từ vựng đã học",
      value: String(reviewedFlashcardCount),
      detail:
        reviewedFlashcardCount > 0
          ? `${reviewedFlashcardCount}/${flashcards.length} từ đã ghi nhớ`
          : "Bắt đầu học bằng Flashcard",
      icon: "📚",
    },
    {
      label: "Thời gian học",
      value:
        totalLearningMinutes >= 60
          ? `${(totalLearningMinutes / 60).toFixed(1)}h`
          : `${totalLearningMinutes} phút`,
      detail:
        totalLearningMinutes > 0
          ? "Tính theo bài học đã hoàn thành"
          : "Chưa ghi nhận thời gian học",
      icon: "⏱️",
    },
    {
      label: "Điểm Quiz cao nhất",
      value:
        progress.quizHighScore > 0
          ? `${progress.quizHighScore}%`
          : "0%",
      detail:
        progress.quizHighScore >= 80
          ? "Kết quả rất tốt"
          : progress.quizHighScore >= 60
            ? "Đã đạt yêu cầu"
            : progress.quizHighScore > 0
              ? "Hãy thử lại để cải thiện"
              : "Chưa thực hiện Quiz",
      icon: "🏆",
    },
  ];

  const achievements = useMemo(() => {
    const unlockedAchievements: Array<{
      icon: string;
      title: string;
      detail: string;
    }> = [];

    if (completedLessonCount >= 1) {
      unlockedAchievements.push({
        icon: "📘",
        title: "Bài học đầu tiên",
        detail: "Hoàn thành bài học đầu tiên trên MTD Lingo Pro",
      });
    }

    if (reviewedFlashcardCount >= 1) {
      unlockedAchievements.push({
        icon: "🃏",
        title: "Từ vựng đầu tiên",
        detail: "Ghi nhớ Flashcard đầu tiên",
      });
    }

    if (reviewedFlashcardCount >= 5) {
      unlockedAchievements.push({
        icon: "📚",
        title: "Người học chăm chỉ",
        detail: "Đã ghi nhớ ít nhất 5 từ vựng",
      });
    }

    if (progress.quizHighScore >= 60) {
      unlockedAchievements.push({
        icon: "⭐",
        title: "Vượt qua Quiz",
        detail: `Điểm Quiz cao nhất: ${progress.quizHighScore}%`,
      });
    }

    if (completedSkillCount >= 3) {
      unlockedAchievements.push({
        icon: "✨",
        title: "Học đa kỹ năng",
        detail: `Đã hoàn thành ${completedSkillCount} phòng luyện kỹ năng`,
      });
    }

    if (progress.quizHighScore >= 80) {
      unlockedAchievements.push({
        icon: "🏆",
        title: "Quiz xuất sắc",
        detail: "Đạt từ 80% trong bài kiểm tra tổng hợp",
      });
    }

    return unlockedAchievements;
  }, [
    completedLessonCount,
    completedSkillCount,
    progress.quizHighScore,
    reviewedFlashcardCount,
  ]);

  const handleContinueLearning = () => {
    const nextLesson = lessons.find(
      (lesson) =>
        !progress.completedLessonIds.includes(lesson.id),
    );

    if (nextLesson) {
      navigate(`/dashboard/lessons/${nextLesson.id}`);
      return;
    }

    if (completedBackendLessonCount < backendLessonCount) {
      navigate("/dashboard/courses");
      return;
    }

    navigate("/dashboard/flashcards");
  };

  const handleOpenLesson = (lessonId: string) => {
    navigate(`/dashboard/lessons/${lessonId}`);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Tổng quan học tập
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {completedLearningItems === 0
              ? `Chào mừng ${user?.fullName || "học viên"}!`
              : "Tiếp tục tiến bộ mỗi ngày"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            {completedLearningItems === 0
              ? "Tài khoản của bạn chưa có tiến độ học tập. Hãy hoàn thành bài học đầu tiên để bắt đầu hành trình."
              : `Bạn đã hoàn thành ${overallProgress}% nội dung hiện có. Tiếp tục học để mở khóa thêm thành tích.`}
          </p>
        </div>

        <Button
          type="button"
          size="large"
          onClick={handleContinueLearning}
          className="w-full sm:w-auto"
        >
          {completedLearningItems === 0
            ? "Bắt đầu học →"
            : "Tiếp tục học →"}
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-slate-900/80"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{card.label}</p>

                <p className="mt-2 text-3xl font-black">
                  {card.value}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl">
                {card.icon}
              </div>
            </div>

            <p className="mt-5 text-xs font-semibold text-emerald-300">
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.08] via-slate-900/70 to-violet-500/[0.08] p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Kế hoạch hôm nay
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Học mới, ôn cũ, tiến bộ đều
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {todayPlan.length > 0
                ? `${todayPlan.length} nhiệm vụ được chọn theo lịch ôn cá nhân.`
                : "Bạn đã hoàn tất kế hoạch hôm nay — ngày mai sẽ có nội dung mới."}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-xl bg-emerald-400/10 px-3 py-2 font-black text-emerald-300">
              🔥 {progress.streakDays} ngày liên tiếp
            </span>
            <span className="rounded-xl bg-white/5 px-3 py-2 text-slate-400">
              {todayActivity.minutes} phút hôm nay
            </span>
          </div>
        </div>

        {todayPlan.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {todayPlan.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.route)}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                    {item.isReview ? "Ôn lại" : "Từ mới"}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {item.level ?? "A1"}
                  </span>
                </div>
                <p className="mt-3 truncate font-black">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {item.subtitle}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Hoạt động tuần này
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Biểu đồ hoạt động sẽ được cập nhật khi có lịch sử học
              </p>
            </div>

            <span className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-400">
              Tuần này
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end justify-between gap-2 sm:gap-3">
            {weeklyActivity.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="relative flex h-full w-full items-end overflow-hidden rounded-xl bg-white/[0.04]">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-blue-600 to-cyan-300 transition"
                    style={{
                      height:
                        item.value > 0
                          ? `${item.value}%`
                          : "4px",
                    }}
                  />

                  <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] font-bold text-slate-500">
                    {item.value}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {item.day}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Mục tiêu khởi động
          </p>

          <div className="mt-6 flex items-center justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#22d3ee 0deg, #22d3ee ${goalDegrees}deg, #1e293b ${goalDegrees}deg, #1e293b 360deg)`,
              }}
              role="progressbar"
              aria-label="Tiến độ mục tiêu khởi động"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={goalProgress}
            >
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-900">
                <p className="text-4xl font-black">
                  {goalProgress}%
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Hoàn thành
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Hoàn thành bài học
              </span>

              <span className="font-bold">{lessonGoal} / 1</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Ghi nhớ từ vựng
              </span>

              <span className="font-bold">
                {vocabularyGoal} / 5
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">
                Quiz đạt ít nhất 60%
              </span>

              <span className="font-bold">{quizGoal} / 1</span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">
                Bài học đã hoàn thành
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Danh sách bài học của tài khoản hiện tại
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/learning")}
              className="shrink-0 text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
            >
              Xem lộ trình
            </button>
          </div>

          {completedLessonCount > 0 ? (
            <div className="mt-6 space-y-4">
              {completedBackendLessonCount > 0 && (
                <div className="flex flex-col gap-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.05] p-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                    🎓
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">
                      Khóa học theo cấp độ
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {completedBackendLessonCount} bài học đã được ghi
                      nhận từ thư viện khóa học
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => navigate("/dashboard/courses")}
                  >
                    Mở khóa học
                  </Button>
                </div>
              )}
              {completedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/20 hover:bg-white/[0.04] sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-xl">
                    ✓
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {lesson.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {lesson.category} · {lesson.duration} phút
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-full rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="text-sm font-black text-emerald-300">
                      100%
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="small"
                      onClick={() => handleOpenLesson(lesson.id)}
                      className="sm:mt-2"
                    >
                      Xem lại
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
              <div className="text-5xl">📖</div>

              <h3 className="mt-4 text-lg font-black">
                Chưa có bài học hoàn thành
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Hoàn thành bài học đầu tiên để dữ liệu xuất hiện tại đây.
              </p>

              <Button
                type="button"
                className="mt-5"
                onClick={handleContinueLearning}
              >
                Học bài đầu tiên
              </Button>
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <h2 className="text-xl font-black">Thành tích</h2>

          <p className="mt-1 text-sm text-slate-500">
            Thành tích được mở khóa từ tiến độ thật
          </p>

          {achievements.length > 0 ? (
            <div className="mt-6 space-y-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.title}
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 transition hover:bg-white/[0.05]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                    {achievement.icon}
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      {achievement.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {achievement.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center">
              <div className="text-5xl">🔒</div>

              <h3 className="mt-4 font-black">
                Chưa mở khóa thành tích
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Học bài, ghi nhớ Flashcard hoặc làm Quiz để nhận thành
                tích đầu tiên.
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;
