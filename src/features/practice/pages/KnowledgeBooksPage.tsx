import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TelegramSupportButton from "../../../components/support/TelegramSupportButton";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import { fluentKnowledgeResource } from "../../learning-engine/data/knowledgeRegistry";
import {
  getPracticeSetsForChapter,
  knowledgeBooks,
  type KnowledgeBook,
  type KnowledgeChapter,
} from "../data/knowledgeBooks";
import { practiceSkillLabels } from "../types/practice";

const accentStyles: Record<
  KnowledgeBook["accent"],
  { border: string; badge: string; glow: string; bar: string }
> = {
  cyan: {
    border: "border-cyan-300/30",
    badge: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    glow: "from-cyan-400/20",
    bar: "from-cyan-300 to-blue-400",
  },
  blue: {
    border: "border-blue-300/30",
    badge: "border-blue-300/20 bg-blue-300/10 text-blue-200",
    glow: "from-blue-400/20",
    bar: "from-blue-300 to-violet-400",
  },
  violet: {
    border: "border-violet-300/30",
    badge: "border-violet-300/20 bg-violet-300/10 text-violet-200",
    glow: "from-violet-400/20",
    bar: "from-violet-300 to-fuchsia-400",
  },
  emerald: {
    border: "border-emerald-300/30",
    badge: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    glow: "from-emerald-400/20",
    bar: "from-emerald-300 to-cyan-400",
  },
  amber: {
    border: "border-amber-300/30",
    badge: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    glow: "from-amber-400/20",
    bar: "from-amber-300 to-orange-400",
  },
  rose: {
    border: "border-rose-300/30",
    badge: "border-rose-300/20 bg-rose-300/10 text-rose-200",
    glow: "from-rose-400/20",
    bar: "from-rose-300 to-violet-400",
  },
  orange: {
    border: "border-orange-300/30",
    badge: "border-orange-300/20 bg-orange-300/10 text-orange-200",
    glow: "from-orange-400/20",
    bar: "from-orange-300 to-amber-400",
  },
};

function chapterSets(chapter: KnowledgeChapter) {
  return getPracticeSetsForChapter(chapter.id);
}

function getChapterProgress(
  chapter: KnowledgeChapter,
  reviewRecords: ReturnType<
    typeof useLearningProgress
  >["progress"]["reviewRecords"],
) {
  const sets = chapterSets(chapter);
  const completed = sets.filter(
    (practiceSet) => reviewRecords[`practice:${practiceSet.id}`],
  ).length;
  const totalExercises = sets.reduce(
    (total, practiceSet) => total + practiceSet.exercises.length,
    0,
  );
  const scoreValues = sets
    .map(
      (practiceSet) => reviewRecords[`practice:${practiceSet.id}`]?.lastScore,
    )
    .filter((score): score is number => typeof score === "number");

  return {
    sets,
    completed,
    totalSets: sets.length,
    totalExercises,
    score:
      scoreValues.length > 0
        ? Math.round(
            scoreValues.reduce((total, score) => total + score, 0) /
              scoreValues.length,
          )
        : null,
    percent: sets.length > 0 ? Math.round((completed / sets.length) * 100) : 0,
  };
}

function KnowledgeBooksPage() {
  const { progress } = useLearningProgress();
  const [selectedBookId, setSelectedBookId] = useState(knowledgeBooks[0]?.id);

  const selectedBook =
    knowledgeBooks.find((book) => book.id === selectedBookId) ??
    knowledgeBooks[0];

  const bookMetrics = useMemo(() => {
    return knowledgeBooks.map((book) => {
      const allSets = book.chapters.flatMap(chapterSets);
      const completedSets = allSets.filter(
        (practiceSet) => progress.reviewRecords[`practice:${practiceSet.id}`],
      ).length;
      const exerciseCount = allSets.reduce(
        (total, practiceSet) => total + practiceSet.exercises.length,
        0,
      );

      return {
        bookId: book.id,
        completedSets,
        totalSets: allSets.length,
        exerciseCount,
        percent:
          allSets.length > 0
            ? Math.round((completedSets / allSets.length) * 100)
            : 0,
      };
    });
  }, [progress.reviewRecords]);

  const totalExercises = bookMetrics.reduce(
    (total, metric) => total + metric.exerciseCount,
    0,
  );
  const totalChapters = knowledgeBooks.reduce(
    (total, book) => total + book.chapters.length,
    0,
  );

  if (!selectedBook) {
    return null;
  }

  const selectedMetrics =
    bookMetrics.find((metric) => metric.bookId === selectedBook.id) ??
    bookMetrics[0];
  const selectedAccent = accentStyles[selectedBook.accent];

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="premium-surface relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-950/90 to-violet-500/15 p-6 shadow-2xl shadow-black/20 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl"
        />
        <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <span aria-hidden="true">📚</span>
              Sách kiến thức
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Học như đọc một quyển sách — luôn có chương tiếp theo
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Mỗi kỹ năng được chia thành chương ngắn, có mục tiêu, bài luyện và
              checkpoint. Bạn không còn phải tự hỏi “hôm nay học gì”; chỉ cần mở
              chương kế tiếp và làm một phiên có phản hồi.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[560px]">
            {[
              [String(knowledgeBooks.length), "quyển sách"],
              [String(totalChapters), "chương"],
              [String(totalExercises), "bài tập"],
              ["A1–C2", "cấp độ"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-4 text-center backdrop-blur"
              >
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-1 text-2xl font-black text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Chọn lộ trình
              </p>
              <h2 className="mt-2 text-2xl font-black">7 quyển sách</h2>
            </div>
            <Link
              to="/dashboard/practice"
              className="text-xs font-black text-cyan-300 hover:text-cyan-200"
            >
              Xem tất cả bài →
            </Link>
          </div>

          {knowledgeBooks.map((book) => {
            const metric = bookMetrics.find((item) => item.bookId === book.id);
            const accent = accentStyles[book.accent];
            const isSelected = book.id === selectedBook.id;

            return (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedBookId(book.id)}
                className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  isSelected
                    ? `${accent.border} bg-white/[0.07] shadow-xl shadow-black/15`
                    : "border-white/10 bg-slate-900/55 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    {book.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-black text-white">
                        {book.title}
                      </span>
                      <span className="text-xs font-black text-slate-500">
                        {metric?.percent ?? 0}%
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {book.subtitle}
                    </span>
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${accent.bar}`}
                    style={{ width: `${metric?.percent ?? 0}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{book.chapters.length} chương</span>
                  <span>{metric?.exerciseCount ?? 0} bài tập</span>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="min-w-0">
          <section
            className={`premium-surface relative overflow-hidden rounded-[32px] border ${selectedAccent.border} bg-gradient-to-br ${selectedAccent.glow} via-slate-900/80 to-slate-950 p-6 sm:p-8`}
          >
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${selectedAccent.badge}`}
                  >
                    {practiceSkillLabels[selectedBook.skill]} ·{" "}
                    {selectedBook.levelRange}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-400">
                    {selectedBook.chapters.length} chương
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                  {selectedBook.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                  {selectedBook.description}
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center">
                <p className="text-3xl font-black text-white">
                  {selectedMetrics?.percent ?? 0}%
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  đã hoàn thành
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {selectedBook.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-300"
                >
                  <span className="mr-2 text-emerald-300">✓</span>
                  {outcome}
                </div>
              ))}
            </div>
          </section>

          <section
            className="mt-6 space-y-4"
            aria-labelledby="chapters-heading"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Mục lục
                </p>
                <h2 id="chapters-heading" className="mt-2 text-2xl font-black">
                  Đi từng chương, không bỏ bước
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {selectedMetrics?.completedSets ?? 0}/
                {selectedMetrics?.totalSets ?? 0} bộ đã luyện
              </p>
            </div>

            {selectedBook.chapters.map((chapter, index) => {
              const chapterProgress = getChapterProgress(
                chapter,
                progress.reviewRecords,
              );
              const nextSet =
                chapterProgress.sets.find(
                  (practiceSet) =>
                    !progress.reviewRecords[`practice:${practiceSet.id}`],
                ) ?? chapterProgress.sets[0];

              return (
                <article
                  key={chapter.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-white/20 sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${selectedAccent.badge}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {chapter.title}
                          </h3>
                          {chapterProgress.completed ===
                            chapterProgress.totalSets &&
                            chapterProgress.totalSets > 0 && (
                              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-black text-emerald-200">
                                ✓ Đã xong
                              </span>
                            )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {chapter.summary}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                            CEFR {chapter.level}
                          </span>
                          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                            {chapter.estimatedMinutes} phút
                          </span>
                          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5">
                            {chapterProgress.totalExercises} bài tập
                          </span>
                          {chapterProgress.score !== null && (
                            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1.5 text-cyan-200">
                              Điểm {chapterProgress.score}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {nextSet && (
                      <Link
                        to={`/dashboard/practice/${nextSet.id}`}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
                      >
                        {chapterProgress.completed === chapterProgress.totalSets
                          ? "Ôn lại chương →"
                          : "Mở chương →"}
                      </Link>
                    )}
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {chapterProgress.sets.map((practiceSet) => {
                      const record =
                        progress.reviewRecords[`practice:${practiceSet.id}`];
                      return (
                        <Link
                          key={practiceSet.id}
                          to={`/dashboard/practice/${practiceSet.id}`}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black text-slate-200">
                              {practiceSet.title}
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                              {practiceSet.exercises.length} bài ·{" "}
                              {practiceSet.duration} phút
                            </span>
                          </span>
                          <span
                            className={`shrink-0 text-xs font-black ${record ? "text-emerald-300" : "text-cyan-300"}`}
                          >
                            {record ? `${record.lastScore}%` : "Bắt đầu"}
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-4 text-sm leading-6 text-amber-100/80">
                    <span aria-hidden="true">🎯</span>
                    <span>
                      <strong className="font-black text-amber-200">
                        Checkpoint:
                      </strong>{" "}
                      {chapter.checkpoint ??
                        "Hoàn thành toàn bộ bài trong chương rồi quay lại ôn sau 48 giờ."}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 rounded-3xl border border-violet-300/15 bg-violet-300/[0.05] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                  Phương pháp học được chọn lọc
                </p>
                <h2 className="mt-2 text-xl font-black">
                  Active recall · phản hồi · ôn lặp lại
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Các chương áp dụng nguyên tắc thiết kế học từ{" "}
                  {fluentKnowledgeResource.title}; kết quả vẫn được lưu bằng
                  tiến độ của MTD Lingo Pro.
                </p>
              </div>
              <a
                href={fluentKnowledgeResource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/25 bg-violet-300/10 px-4 py-2.5 text-sm font-black text-violet-200 transition hover:bg-violet-300/20"
              >
                Xem nguồn MIT →
              </a>
            </div>
          </section>
        </main>
      </section>

      <TelegramSupportButton
        variant="inline"
        label="Cần hỗ trợ? Chat Telegram"
      />
    </div>
  );
}

export default KnowledgeBooksPage;
