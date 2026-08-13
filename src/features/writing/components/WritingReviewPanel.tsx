import { useState } from "react";

import type { WritingReview } from "../../../lib/api/writing-api";

type WritingReviewPanelProps = {
  review: WritingReview | null;
  isLoading?: boolean;
};

function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

function reviewDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Vừa xong";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function sourceDetails(source: string): {
  label: string;
  className: string;
  caveat: string | null;
} {
  const normalizedSource = source.toLowerCase();

  if (normalizedSource === "fallback") {
    return {
      label: "Chấm cục bộ · heuristic",
      className: "border-amber-300/20 bg-amber-300/10 text-amber-200",
      caveat:
        "Kết quả này được tạo bằng quy tắc thống kê cơ bản khi nhà cung cấp AI không khả dụng. Hãy xem đây là gợi ý nhanh, không phải phân tích AI chuyên sâu.",
    };
  }

  const labels: Record<string, string> = {
    openai: "Xử lý bởi OpenAI",
    xai: "Xử lý bởi xAI",
    gemini: "Xử lý bởi Google Gemini",
  };

  return {
    label: labels[normalizedSource] ?? "Xử lý bởi nhà cung cấp AI",
    className: "border-violet-300/20 bg-violet-300/10 text-violet-200",
    caveat: null,
  };
}

function ReviewSkeleton() {
  return (
    <div
      className="space-y-5 p-5 sm:p-7"
      role="status"
      aria-live="polite"
      aria-label="Đang phân tích bài viết"
    >
      <div className="flex items-center gap-5">
        <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-white/[0.07]" />
        <div className="w-full space-y-3">
          <div className="h-4 w-28 animate-pulse rounded-full bg-cyan-300/10" />
          <div className="h-7 w-3/4 animate-pulse rounded-lg bg-white/[0.07]" />
          <div className="h-4 w-full animate-pulse rounded bg-white/[0.05]" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]"
          />
        ))}
      </div>
      <span className="sr-only">AI Coach đang đọc và chấm bài…</span>
    </div>
  );
}

function EmptyReview() {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.06] text-4xl shadow-[0_0_60px_rgba(34,211,238,0.12)]">
        <span aria-hidden="true">✎</span>
        <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-400 text-sm font-black text-slate-950">
          AI
        </span>
      </div>
      <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
        Writing Intelligence
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
        Phản hồi sâu, không chỉ sửa lỗi
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
        Gửi bài để nhận điểm tổng, ước lượng CEFR, rubric chi tiết, câu sửa,
        từ vựng nâng cấp và một phiên bản viết tốt hơn.
      </p>
      <div className="mt-7 grid w-full max-w-sm grid-cols-3 gap-2 text-left text-xs text-slate-400">
        {[
          ["01", "Chẩn đoán"],
          ["02", "Giải thích"],
          ["03", "Nâng cấp"],
        ].map(([number, label]) => (
          <div
            key={number}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
          >
            <span className="block font-black text-cyan-300">{number}</span>
            <span className="mt-1 block">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WritingReviewPanel({
  review,
  isLoading = false,
}: WritingReviewPanelProps) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (!review) {
    return <EmptyReview />;
  }

  const score = clampScore(review.overallScore);
  const source = sourceDetails(review.source);

  const copyImprovedVersion = async () => {
    if (!review.improvedVersion) {
      return;
    }

    try {
      await navigator.clipboard.writeText(review.improvedVersion);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="p-5 sm:p-7">
      <section className="flex flex-col gap-6 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center">
        <div
          className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full p-[7px]"
          style={{
            background: `conic-gradient(#22d3ee ${score * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
          }}
          role="img"
          aria-label={`Điểm tổng ${score} trên 100`}
        >
          <div className="grid h-full w-full place-items-center rounded-full bg-slate-950 shadow-inner shadow-black/50">
            <div className="text-center">
              <strong className="block text-4xl font-black tracking-[-0.06em] text-white">
                {score}
              </strong>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
              CEFR {review.cefrEstimate || "—"}
            </span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1 text-xs font-bold text-slate-400">
              {reviewDate(review.reviewedAt)}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${source.className}`}
            >
              {source.label}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
            Bản phân tích của bạn
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            {review.summaryVi || "Bài viết đã được phân tích thành công."}
          </p>
          {source.caveat && (
            <p className="mt-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-3 py-2.5 text-xs leading-5 text-amber-100/80">
              {source.caveat}
            </p>
          )}
        </div>
      </section>

      {review.content && (
        <details className="group border-b border-white/[0.08] py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-sm font-black text-slate-300 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300/40">
            <span>Bài viết đã gửi</span>
            <span className="text-xs text-slate-500 transition group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="mt-4 rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4">
            {review.prompt && (
              <p className="border-b border-white/[0.06] pb-3 text-xs leading-6 text-slate-500">
                <strong className="text-slate-300">Đề bài: </strong>
                {review.prompt}
              </p>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {review.content}
            </p>
            <p className="mt-3 text-[11px] font-bold text-slate-600">
              {(review.wordCount ?? review.content.trim().split(/\s+/u).length).toLocaleString("vi-VN")} từ
              {review.targetWords ? ` · mục tiêu ${review.targetWords} từ` : ""}
            </p>
          </div>
        </details>
      )}

      {review.criteria.length > 0 && (
        <section className="border-b border-white/[0.08] py-7">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                Rubric
              </p>
              <h3 className="mt-2 text-lg font-black text-white">
                Năng lực theo tiêu chí
              </h3>
            </div>
            <span className="text-xs text-slate-500">Thang điểm 100</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {review.criteria.map((criterion, index) => {
              const criterionScore = clampScore(criterion.score);

              return (
                <article
                  key={`${criterion.name}-${index}`}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-black text-slate-100">
                      {criterion.name}
                    </h4>
                    <strong className="text-lg font-black text-cyan-300">
                      {criterionScore}
                    </strong>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                      style={{ width: `${criterionScore}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {criterion.feedbackVi}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {(review.strengths.length > 0 || review.priorities.length > 0) && (
        <section className="grid gap-4 border-b border-white/[0.08] py-7 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.045] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Điểm mạnh
            </p>
            <ul className="mt-4 space-y-3">
              {review.strengths.map((strength, index) => (
                <li
                  key={`${strength}-${index}`}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-emerald-300"
                  >
                    ✓
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              Ưu tiên tiếp theo
            </p>
            <ol className="mt-4 space-y-3">
              {review.priorities.map((priority, index) => (
                <li
                  key={`${priority}-${index}`}
                  className="flex gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-300/10 text-[11px] font-black text-amber-300">
                    {index + 1}
                  </span>
                  <span>{priority}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {review.corrections.length > 0 && (
        <section className="border-b border-white/[0.08] py-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-300">
            Corrections
          </p>
          <h3 className="mt-2 text-lg font-black text-white">
            Sửa đúng và hiểu vì sao
          </h3>
          <div className="mt-4 space-y-3">
            {review.corrections.map((correction, index) => (
              <article
                key={`${correction.original}-${index}`}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]"
              >
                <div className="grid sm:grid-cols-2">
                  <div className="border-b border-white/[0.07] p-4 sm:border-b-0 sm:border-r">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-300">
                      Bản gốc
                    </span>
                    <p className="mt-2 text-sm leading-6 text-slate-400 line-through decoration-rose-400/50">
                      {correction.original}
                    </p>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-300">
                      Gợi ý
                    </span>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-100">
                      {correction.suggestion}
                    </p>
                  </div>
                </div>
                {correction.explanationVi && (
                  <p className="border-t border-white/[0.07] bg-black/10 px-4 py-3 text-xs leading-6 text-slate-400">
                    <span className="font-black text-slate-300">Vì sao: </span>
                    {correction.explanationVi}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {review.improvedVersion && (
        <section className="border-b border-white/[0.08] py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Improved version
              </p>
              <h3 className="mt-2 text-lg font-black text-white">
                Phiên bản tham khảo
              </h3>
            </div>
            <button
              type="button"
              onClick={copyImprovedVersion}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-slate-300 transition hover:border-cyan-300/30 hover:text-cyan-200"
              aria-live="polite"
            >
              {copied ? "Đã sao chép ✓" : "Sao chép"}
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.035] p-5 text-sm leading-7 text-slate-200">
            <p className="whitespace-pre-wrap">{review.improvedVersion}</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Hãy đọc, so sánh rồi tự viết lại; đừng chỉ chép nguyên văn bản mẫu.
          </p>
        </section>
      )}

      {review.vocabularySuggestions.length > 0 && (
        <section className="pt-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
            Vocabulary upgrade
          </p>
          <h3 className="mt-2 text-lg font-black text-white">
            Từ vựng đáng thêm vào kho
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {review.vocabularySuggestions.map((item, index) => (
              <article
                key={`${item.word}-${index}`}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="text-base font-black text-violet-200">
                    {item.word}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    New
                  </span>
                </div>
                {item.meaningVi && (
                  <p className="mt-2 text-xs font-bold text-slate-300">
                    {item.meaningVi}
                  </p>
                )}
                {item.example && (
                  <p className="mt-2 text-xs italic leading-6 text-slate-500">
                    “{item.example}”
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default WritingReviewPanel;
