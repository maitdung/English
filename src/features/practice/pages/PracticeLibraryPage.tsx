import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import { practiceSets } from "../data/practiceCatalog";
import {
  practiceSkillLabels,
  practiceTypeLabels,
  type PracticeLevel,
  type PracticeSet,
  type PracticeSkill,
} from "../types/practice";

type AccentStyle = {
  badge: string;
  icon: string;
  border: string;
  glow: string;
  text: string;
};

const accentStyles: Record<PracticeSet["accent"], AccentStyle> = {
  cyan: {
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    icon: "bg-cyan-400/10 text-cyan-200",
    border: "hover:border-cyan-300/35",
    glow: "from-cyan-500/20 via-cyan-500/[0.04] to-transparent",
    text: "text-cyan-300",
  },
  blue: {
    badge: "border-blue-400/20 bg-blue-400/10 text-blue-200",
    icon: "bg-blue-400/10 text-blue-200",
    border: "hover:border-blue-300/35",
    glow: "from-blue-500/20 via-blue-500/[0.04] to-transparent",
    text: "text-blue-300",
  },
  violet: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    icon: "bg-violet-400/10 text-violet-200",
    border: "hover:border-violet-300/35",
    glow: "from-violet-500/20 via-violet-500/[0.04] to-transparent",
    text: "text-violet-300",
  },
  emerald: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    icon: "bg-emerald-400/10 text-emerald-200",
    border: "hover:border-emerald-300/35",
    glow: "from-emerald-500/20 via-emerald-500/[0.04] to-transparent",
    text: "text-emerald-300",
  },
  amber: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    icon: "bg-amber-400/10 text-amber-200",
    border: "hover:border-amber-300/35",
    glow: "from-amber-500/20 via-amber-500/[0.04] to-transparent",
    text: "text-amber-300",
  },
  rose: {
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    icon: "bg-rose-400/10 text-rose-200",
    border: "hover:border-rose-300/35",
    glow: "from-rose-500/20 via-rose-500/[0.04] to-transparent",
    text: "text-rose-300",
  },
  orange: {
    badge: "border-orange-400/20 bg-orange-400/10 text-orange-200",
    icon: "bg-orange-400/10 text-orange-200",
    border: "hover:border-orange-300/35",
    glow: "from-orange-500/20 via-orange-500/[0.04] to-transparent",
    text: "text-orange-300",
  },
};

const skillOptions = Object.keys(practiceSkillLabels) as PracticeSkill[];
const levelOptions: PracticeLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi-VN");
}

function getExerciseTypeLabels(practiceSet: PracticeSet): string[] {
  return [
    ...new Set(
      practiceSet.exercises.map(
        (exercise) => practiceTypeLabels[exercise.type],
      ),
    ),
  ];
}

function PracticeLibraryPage() {
  const { progress } = useLearningProgress();
  const [searchValue, setSearchValue] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<"all" | PracticeSkill>(
    "all",
  );
  const [selectedLevel, setSelectedLevel] = useState<"all" | PracticeLevel>(
    "all",
  );

  const catalogMetrics = useMemo(() => {
    const completedRecords = practiceSets.flatMap((practiceSet) => {
      const record = progress.reviewRecords[`practice:${practiceSet.id}`];
      return record ? [record] : [];
    });
    const exerciseTypes = new Set(
      practiceSets.flatMap((practiceSet) =>
        practiceSet.exercises.map((exercise) => exercise.type),
      ),
    );
    const coveredSkills = new Set(
      practiceSets.map((practiceSet) => practiceSet.skill),
    );
    const averageScore =
      completedRecords.length > 0
        ? Math.round(
            completedRecords.reduce(
              (total, record) => total + record.lastScore,
              0,
            ) / completedRecords.length,
          )
        : 0;

    return {
      completedCount: completedRecords.length,
      averageScore,
      totalExercises: practiceSets.reduce(
        (total, practiceSet) => total + practiceSet.exercises.length,
        0,
      ),
      totalMinutes: practiceSets.reduce(
        (total, practiceSet) => total + practiceSet.duration,
        0,
      ),
      exerciseTypeCount: exerciseTypes.size,
      skillCount: coveredSkills.size,
    };
  }, [progress.reviewRecords]);

  const dailyPracticeSet = useMemo(() => {
    if (practiceSets.length === 0) {
      return null;
    }

    const unfinishedFeaturedSets = practiceSets.filter(
      (practiceSet) =>
        practiceSet.featured &&
        !progress.reviewRecords[`practice:${practiceSet.id}`],
    );
    const unfinishedSets = practiceSets.filter(
      (practiceSet) =>
        !progress.reviewRecords[`practice:${practiceSet.id}`],
    );
    const candidates =
      unfinishedFeaturedSets.length > 0
        ? unfinishedFeaturedSets
        : unfinishedSets.length > 0
          ? unfinishedSets
          : practiceSets.filter((practiceSet) => practiceSet.featured).length > 0
            ? practiceSets.filter((practiceSet) => practiceSet.featured)
            : practiceSets;
    const today = new Date();
    const daySeed = Math.floor(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).getTime() / 86_400_000,
    );

    return candidates[daySeed % candidates.length] ?? practiceSets[0];
  }, [progress.reviewRecords]);

  const filteredPracticeSets = useMemo(() => {
    const normalizedSearch = normalizeSearchText(searchValue.trim());

    return practiceSets.filter((practiceSet) => {
      const matchesSkill =
        selectedSkill === "all" || practiceSet.skill === selectedSkill;
      const matchesLevel =
        selectedLevel === "all" || practiceSet.level === selectedLevel;
      const searchableContent = normalizeSearchText(
        [
          practiceSet.title,
          practiceSet.description,
          practiceSkillLabels[practiceSet.skill],
          practiceSet.level,
          ...practiceSet.tags,
          ...getExerciseTypeLabels(practiceSet),
        ].join(" "),
      );
      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableContent.includes(normalizedSearch);

      return matchesSkill && matchesLevel && matchesSearch;
    });
  }, [searchValue, selectedLevel, selectedSkill]);

  const hasActiveFilters =
    searchValue.trim().length > 0 ||
    selectedSkill !== "all" ||
    selectedLevel !== "all";

  const resetFilters = () => {
    setSearchValue("");
    setSelectedSkill("all");
    setSelectedLevel("all");
  };

  const dailyRecord = dailyPracticeSet
    ? progress.reviewRecords[`practice:${dailyPracticeSet.id}`]
    : undefined;
  const dailyAccent = dailyPracticeSet
    ? accentStyles[dailyPracticeSet.accent]
    : accentStyles.cyan;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="premium-surface relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-950/90 to-violet-500/15 p-6 shadow-2xl shadow-black/20 sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl"
        />

        <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.8)]"
              />
              Thư viện luyện tập
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Luyện đúng kỹ năng, tiến bộ qua từng phiên ngắn
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Chọn bộ bài theo mục tiêu và trình độ của bạn. Mỗi phiên kết hợp
              nhiều dạng tương tác, có phản hồi tức thì và ghi lại kết quả để lần
              học sau bắt đầu đúng chỗ cần cải thiện.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {dailyPracticeSet && (
                <Link
                  to={`/dashboard/practice/${dailyPracticeSet.id}`}
                  className="premium-button inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
                >
                  Luyện bài hôm nay →
                </Link>
              )}
              <a
                href="#practice-library"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Khám phá thư viện
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[560px]">
            {[
              [String(practiceSets.length), "bộ bài"],
              [String(catalogMetrics.totalExercises), "bài tập"],
              [String(catalogMetrics.exerciseTypeCount), "dạng luyện"],
              [String(catalogMetrics.skillCount), "kỹ năng"],
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

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đã luyện</p>
          <p className="mt-2 text-3xl font-black">
            {catalogMetrics.completedCount}
            <span className="ml-2 text-base text-slate-500">
              / {practiceSets.length}
            </span>
          </p>
          <p className="mt-4 text-xs font-semibold text-emerald-300">
            Theo tiến độ tài khoản này
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Điểm gần nhất trung bình</p>
          <p className="mt-2 text-3xl font-black">
            {catalogMetrics.completedCount > 0
              ? `${catalogMetrics.averageScore}%`
              : "—"}
          </p>
          <p className="mt-4 text-xs font-semibold text-cyan-300">
            Tính từ các bộ bài đã làm
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng thời lượng</p>
          <p className="mt-2 text-3xl font-black">
            {catalogMetrics.totalMinutes} phút
          </p>
          <p className="mt-4 text-xs font-semibold text-violet-300">
            Học theo phiên ngắn, dễ duy trì
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-violet-500/10 p-5">
          <p className="text-sm text-slate-400">Chuỗi học hiện tại</p>
          <p className="mt-2 text-3xl font-black">{progress.streakDays} ngày</p>
          <p className="mt-4 text-xs font-semibold text-amber-300">
            Một phiên hôm nay để giữ nhịp
          </p>
        </article>
      </section>

      {dailyPracticeSet && (
        <section
          aria-labelledby="daily-practice-heading"
          className={`premium-surface relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${dailyAccent.glow} p-6 sm:p-8`}
        >
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 text-[220px] opacity-[0.05] grayscale"
          >
            {dailyPracticeSet.icon}
          </div>

          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <span
                aria-hidden="true"
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${dailyAccent.icon}`}
              >
                {dailyPracticeSet.icon}
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-200">
                    Gợi ý hôm nay
                  </span>
                  {dailyPracticeSet.featured && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300">
                      Nổi bật
                    </span>
                  )}
                  {dailyRecord && (
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                      ✓ Đã luyện · {dailyRecord.lastScore}%
                    </span>
                  )}
                </div>

                <h2
                  id="daily-practice-heading"
                  className="mt-4 text-2xl font-black sm:text-3xl"
                >
                  {dailyPracticeSet.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                  {dailyPracticeSet.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
                  <span className={`rounded-xl border px-3 py-2 ${dailyAccent.badge}`}>
                    {practiceSkillLabels[dailyPracticeSet.skill]}
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    CEFR {dailyPracticeSet.level}
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {dailyPracticeSet.duration} phút
                  </span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    {dailyPracticeSet.exercises.length} bài tập
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/dashboard/practice/${dailyPracticeSet.id}`}
              aria-label={`${dailyRecord ? "Luyện lại" : "Bắt đầu"} ${dailyPracticeSet.title}`}
              className="premium-button inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-6 py-3 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100 lg:w-auto"
            >
              {dailyRecord ? "Luyện lại →" : "Bắt đầu ngay →"}
            </Link>
          </div>
        </section>
      )}

      <section
        id="practice-library"
        aria-labelledby="practice-library-heading"
        className="scroll-mt-24"
      >
        <div className="premium-surface mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(280px,1fr)_1.5fr] xl:items-end">
            <Input
              id="practice-search"
              type="search"
              label="Tìm bộ bài"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tên bài, kỹ năng, chủ đề hoặc dạng luyện..."
              rightElement={<span aria-hidden="true">⌕</span>}
            />

            <div className="space-y-4">
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-200">
                  Kỹ năng
                </legend>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={selectedSkill === "all"}
                    onClick={() => setSelectedSkill("all")}
                    className={`rounded-xl border px-3 py-2 text-xs font-black transition sm:px-4 sm:text-sm ${
                      selectedSkill === "all"
                        ? "border-cyan-300 bg-cyan-300 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    Tất cả
                  </button>
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      aria-pressed={selectedSkill === skill}
                      onClick={() => setSelectedSkill(skill)}
                      className={`rounded-xl border px-3 py-2 text-xs font-black transition sm:px-4 sm:text-sm ${
                        selectedSkill === skill
                          ? "border-cyan-300 bg-cyan-300 text-slate-950"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {practiceSkillLabels[skill]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-slate-200">
                  Trình độ
                </legend>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={selectedLevel === "all"}
                    onClick={() => setSelectedLevel("all")}
                    className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                      selectedLevel === "all"
                        ? "border-violet-300 bg-violet-300 text-slate-950"
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                    }`}
                  >
                    Mọi cấp độ
                  </button>
                  {levelOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      aria-pressed={selectedLevel === level}
                      onClick={() => setSelectedLevel(level)}
                      className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                        selectedLevel === level
                          ? "border-violet-300 bg-violet-300 text-slate-950"
                          : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Học theo mục tiêu
            </p>
            <h2
              id="practice-library-heading"
              className="mt-2 text-2xl font-black sm:text-3xl"
            >
              Tất cả bộ bài luyện tập
            </h2>
          </div>
          <p
            aria-live="polite"
            className="text-sm font-semibold text-slate-400"
          >
            {filteredPracticeSets.length} kết quả
          </p>
        </div>

        {filteredPracticeSets.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredPracticeSets.map((practiceSet) => {
              const record =
                progress.reviewRecords[`practice:${practiceSet.id}`];
              const accent = accentStyles[practiceSet.accent];
              const exerciseLabels = getExerciseTypeLabels(practiceSet);

              return (
                <article
                  key={practiceSet.id}
                  className={`premium-surface group relative flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 transition ${accent.border}`}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${accent.glow}`}
                  />

                  <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        aria-hidden="true"
                        className={`flex h-13 w-13 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105 ${accent.icon}`}
                      >
                        {practiceSet.icon}
                      </span>

                      <div className="flex flex-wrap justify-end gap-2">
                        {practiceSet.featured && (
                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-200">
                            Nổi bật
                          </span>
                        )}
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-black ${
                            record
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                              : "border-white/10 bg-white/5 text-slate-400"
                          }`}
                        >
                          {record ? "✓ Đã luyện" : "Chưa làm"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold">
                      <span className={`rounded-lg border px-2.5 py-1 ${accent.badge}`}>
                        {practiceSkillLabels[practiceSet.skill]}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300">
                        {practiceSet.level}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black leading-7">
                      <Link
                        to={`/dashboard/practice/${practiceSet.id}`}
                        aria-label={`${record ? "Luyện lại" : "Bắt đầu"} ${practiceSet.title}`}
                        className="rounded-md after:absolute after:inset-0"
                      >
                        {practiceSet.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                      {practiceSet.description}
                    </p>

                    <div className="relative z-10 mt-5 flex flex-wrap gap-2">
                      {exerciseLabels.slice(0, 3).map((label) => (
                        <span
                          key={label}
                          className="rounded-lg bg-white/[0.045] px-2.5 py-1.5 text-[11px] font-semibold text-slate-400"
                        >
                          {label}
                        </span>
                      ))}
                      {exerciseLabels.length > 3 && (
                        <span className="rounded-lg bg-white/[0.045] px-2.5 py-1.5 text-[11px] font-semibold text-slate-500">
                          +{exerciseLabels.length - 3} dạng
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-6">
                      {record && (
                        <div className="mb-5">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold text-slate-500">
                              Điểm lần gần nhất
                            </span>
                            <span className={`font-black ${accent.text}`}>
                              {record.lastScore}%
                            </span>
                          </div>
                          <div
                            role="progressbar"
                            aria-label={`Điểm gần nhất của ${practiceSet.title}`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={record.lastScore}
                            className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                              style={{ width: `${record.lastScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                        <p className="text-xs font-semibold text-slate-500">
                          {practiceSet.duration} phút · {practiceSet.exercises.length}{" "}
                          bài tập
                        </p>
                        <span
                          aria-hidden="true"
                          className={`text-sm font-black transition group-hover:translate-x-1 ${accent.text}`}
                        >
                          {record ? "Luyện lại →" : "Bắt đầu →"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-5 py-16 text-center">
            <div aria-hidden="true" className="text-5xl">
              🔎
            </div>
            <h3 className="mt-5 text-xl font-black">
              {practiceSets.length === 0
                ? "Thư viện đang được cập nhật"
                : "Chưa tìm thấy bộ bài phù hợp"}
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {practiceSets.length === 0
                ? "Các bộ bài luyện tập sẽ xuất hiện tại đây ngay khi nội dung được xuất bản."
                : "Thử từ khóa khác hoặc mở rộng kỹ năng và cấp độ đang chọn."}
            </p>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                className="mt-5"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default PracticeLibraryPage;
