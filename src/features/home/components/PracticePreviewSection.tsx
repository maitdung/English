import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type PreviewMode = "listening" | "grammar" | "reading" | "writing";

type ChoicePreviewExercise = {
  eyebrow: string;
  instruction: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  audio?: string;
  passage?: string;
};

const previewModes: Array<{
  id: PreviewMode;
  label: string;
  icon: string;
  meta: string;
}> = [
  { id: "listening", label: "Nghe", icon: "🎧", meta: "Nghe & chọn" },
  { id: "grammar", label: "Ngữ pháp", icon: "✦", meta: "Điền cấu trúc" },
  { id: "reading", label: "Đọc", icon: "↗", meta: "Tìm ý chính" },
  { id: "writing", label: "Viết", icon: "✎", meta: "Viết có hướng dẫn" },
];

const choiceExercises: Record<
  Exclude<PreviewMode, "writing">,
  ChoicePreviewExercise
> = {
  listening: {
    eyebrow: "Listen for a detail",
    instruction: "Nghe thông báo và chọn thông tin chính xác.",
    audio:
      "Attention passengers. The ten thirty train to Brighton will now depart from platform six, not platform four.",
    prompt: "Where will the train to Brighton depart?",
    options: ["Platform 4", "Platform 6", "Platform 10"],
    correct: 1,
    explanation:
      "Cụm “will now depart from platform six” báo sân ga mới là số 6.",
  },
  grammar: {
    eyebrow: "Grammar in context",
    instruction: "Chọn dạng động từ phù hợp với tình huống.",
    prompt: "If the client _____ today, we will send the proposal tomorrow.",
    options: ["confirms", "confirmed", "will confirm"],
    correct: 0,
    explanation:
      "Câu điều kiện loại 1 dùng hiện tại đơn trong mệnh đề if: “If the client confirms…”.",
  },
  reading: {
    eyebrow: "Read for purpose",
    instruction: "Đọc ghi chú ngắn và xác định mục đích chính.",
    passage:
      "Hi team, the design review has moved to Friday at 2 p.m. Please add your comments to the shared file by Thursday afternoon so I can prepare the final version.",
    prompt: "Why did the writer send this message?",
    options: [
      "To cancel a project",
      "To update a meeting and request comments",
      "To share a finished design",
    ],
    correct: 1,
    explanation:
      "Tin nhắn vừa đổi lịch design review, vừa yêu cầu mọi người góp ý trước thứ Năm.",
  },
};

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

function PracticePreviewSection() {
  const [activeMode, setActiveMode] = useState<PreviewMode>("listening");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [writingValue, setWritingValue] = useState("");
  const [writingChecked, setWritingChecked] = useState(false);

  const activeExercise =
    activeMode === "writing" ? null : choiceExercises[activeMode];
  const writingScore = useMemo(() => {
    const normalized = writingValue.toLocaleLowerCase();
    const words = writingValue.trim()
      ? writingValue.trim().split(/\s+/).length
      : 0;
    const checks = [
      words >= 25,
      /because|since|due to/.test(normalized),
      /monday|tuesday|wednesday|thursday|friday|\d/.test(normalized),
    ];

    return { words, checks, score: Math.round((checks.filter(Boolean).length / 3) * 100) };
  }, [writingValue]);

  const selectMode = (mode: PreviewMode) => {
    setActiveMode(mode);
    setSelectedAnswer(null);
    setIsChecked(false);
    setWritingChecked(false);
  };

  return (
    <section
      id="practice-demo"
      className="relative overflow-hidden border-y border-white/10 bg-slate-950/70"
    >
      <div className="pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-300">
            Học bằng cách thực hành
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Không phải chỉ lật thẻ từ vựng
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-slate-400">
            Mỗi phiên học kết hợp nhiều kiểu tương tác: nghe bắt chi tiết, đọc
            hiểu, xếp câu, điền từ, nói đuổi và viết có hướng dẫn. Thử một bài
            ngay tại đây — không cần đăng nhập.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              ["7", "kỹ năng"],
              ["60+", "lượt luyện mới"],
              ["A1–C2", "cấp độ"],
              ["Tức thì", "phản hồi"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="text-xl font-black text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 font-black text-cyan-300 transition hover:text-cyan-200"
          >
            Mở toàn bộ phòng luyện <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/25 backdrop-blur">
          <div className="border-b border-white/10 p-3 sm:p-4">
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="tablist"
              aria-label="Chọn dạng bài thử"
            >
              {previewModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={activeMode === mode.id}
                  onClick={() => selectMode(mode.id)}
                  className={`rounded-2xl px-3 py-3 text-left transition ${
                    activeMode === mode.id
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2 font-black">
                    <span aria-hidden="true">{mode.icon}</span> {mode.label}
                  </span>
                  <span
                    className={`mt-1 block text-[10px] ${
                      activeMode === mode.id ? "text-slate-500" : "text-slate-600"
                    }`}
                  >
                    {mode.meta}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {activeExercise ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    {activeExercise.eyebrow}
                  </p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-500">
                    B1 · 2 phút
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  {activeExercise.instruction}
                </p>

                {activeExercise.audio && (
                  <button
                    type="button"
                    onClick={() => speak(activeExercise.audio ?? "")}
                    className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-blue-400/15 bg-gradient-to-r from-blue-400/10 to-cyan-400/5 p-4 text-left transition hover:border-blue-300/30"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-400 font-black text-slate-950">
                      ▶
                    </span>
                    <span>
                      <span className="block font-black">Phát đoạn nghe</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        Giọng Anh-Mỹ · nghe lại không giới hạn
                      </span>
                    </span>
                    <span className="ml-auto flex items-end gap-1" aria-hidden="true">
                      {[3, 6, 9, 5, 8, 4, 7, 3].map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="w-1 rounded-full bg-blue-300/60"
                          style={{ height: `${height * 2}px` }}
                        />
                      ))}
                    </span>
                  </button>
                )}

                {activeExercise.passage && (
                  <blockquote className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-5 text-sm leading-7 text-slate-300">
                    {activeExercise.passage}
                  </blockquote>
                )}

                <h3 className="mt-6 text-xl font-black leading-8">
                  {activeExercise.prompt}
                </h3>
                <div className="mt-5 grid gap-3">
                  {activeExercise.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = activeExercise.correct === index;
                    const stateClass = isChecked
                      ? isCorrect
                        ? "border-emerald-400/40 bg-emerald-400/10"
                        : isSelected
                          ? "border-red-400/35 bg-red-400/10"
                          : "border-white/8 bg-white/[0.015] text-slate-600"
                      : isSelected
                        ? "border-cyan-300/50 bg-cyan-300/10"
                        : "border-white/10 bg-white/[0.025] hover:border-white/25";

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={isChecked}
                        onClick={() => setSelectedAnswer(index)}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left text-sm font-semibold transition ${stateClass}`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {isChecked && isCorrect && (
                          <span className="ml-auto text-emerald-300">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isChecked && (
                  <div
                    className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
                      selectedAnswer === activeExercise.correct
                        ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-100"
                        : "border-amber-400/20 bg-amber-400/[0.07] text-amber-100"
                    }`}
                    role="status"
                  >
                    <strong>
                      {selectedAnswer === activeExercise.correct
                        ? "Chính xác. "
                        : "Chưa đúng. "}
                    </strong>
                    {activeExercise.explanation}
                  </div>
                )}

                <button
                  type="button"
                  disabled={selectedAnswer === null}
                  onClick={() => setIsChecked(true)}
                  className="premium-button mt-6 w-full rounded-2xl bg-cyan-300 px-5 py-3.5 font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isChecked ? "Đã nhận phản hồi ✓" : "Kiểm tra đáp án"}
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Guided email
                  </p>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-500">
                    B1 · 5 phút
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black leading-8">
                  Write a short email asking to move Friday’s meeting. Give a
                  reason and suggest a new time.
                </h3>
                <textarea
                  value={writingValue}
                  onChange={(event) => {
                    setWritingValue(event.target.value);
                    setWritingChecked(false);
                  }}
                  rows={6}
                  placeholder="Hi Alex, could we move Friday's meeting because..."
                  className="mt-5 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/50"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{writingScore.words} từ · mục tiêu 25+</span>
                  <span>3 tiêu chí</span>
                </div>

                {writingChecked && (
                  <div className="mt-5 grid gap-2 sm:grid-cols-3" role="status">
                    {[
                      ["Đủ 25 từ", writingScore.checks[0]],
                      ["Có lý do", writingScore.checks[1]],
                      ["Có thời gian mới", writingScore.checks[2]],
                    ].map(([label, passed]) => (
                      <p
                        key={String(label)}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                          passed
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {passed ? "✓" : "○"} {label}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  disabled={!writingValue.trim()}
                  onClick={() => setWritingChecked(true)}
                  className="premium-button mt-6 w-full rounded-2xl bg-amber-300 px-5 py-3.5 font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {writingChecked
                    ? `Phản hồi: ${writingScore.score}%`
                    : "Nhận phản hồi bài viết"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PracticePreviewSection;
