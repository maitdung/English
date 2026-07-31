import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import { vocabularyWords } from "../../vocabulary/data/vocabularyCatalog";

type SkillId =
  | "vocabulary"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "grammar"
  | "test";

type SkillModule = {
  id: SkillId;
  icon: string;
  label: string;
  eyebrow: string;
  description: string;
  color: string;
};

const skillModules: SkillModule[] = [
  {
    id: "vocabulary",
    icon: "📚",
    label: "Từ vựng",
    eyebrow: "Build your word bank",
    description: "Từ theo chủ đề, cấp độ, ví dụ và lặp lại ngắt quãng.",
    color: "cyan",
  },
  {
    id: "listening",
    icon: "🎧",
    label: "Luyện nghe",
    eyebrow: "Train your ear",
    description: "Nghe câu mẫu, bắt từ khóa và kiểm tra phản xạ.",
    color: "blue",
  },
  {
    id: "speaking",
    icon: "🗣️",
    label: "Luyện nói",
    eyebrow: "Speak with confidence",
    description: "Shadowing, phát âm và mẫu câu giao tiếp tự nhiên.",
    color: "violet",
  },
  {
    id: "reading",
    icon: "📖",
    label: "Luyện đọc",
    eyebrow: "Read for meaning",
    description: "Đọc hiểu theo cấp độ, tìm ý chính và suy luận.",
    color: "emerald",
  },
  {
    id: "writing",
    icon: "🖋️",
    label: "Luyện viết",
    eyebrow: "Write with purpose",
    description: "Từ câu, email đến đoạn văn có phản hồi tức thì.",
    color: "amber",
  },
  {
    id: "grammar",
    icon: "⚙️",
    label: "Ngữ pháp",
    eyebrow: "Make it accurate",
    description: "Cấu trúc trọng tâm, lỗi thường gặp và bài tập ngắn.",
    color: "rose",
  },
  {
    id: "test",
    icon: "🏆",
    label: "Kiểm tra",
    eyebrow: "Measure your growth",
    description: "Quiz theo kỹ năng và mô phỏng mục tiêu TOEIC.",
    color: "orange",
  },
];

const readingQuestions = [
  {
    question: "What is the main purpose of the notice?",
    answers: [
      "To announce a change in office hours",
      "To advertise a new product",
      "To invite staff to a party",
      "To report a technical problem",
    ],
    correct: 0,
  },
  {
    question: "When will the new schedule begin?",
    answers: ["Today", "Next Monday", "Next month", "At the end of the year"],
    correct: 1,
  },
];

const listeningQuestion = {
  script:
    "The meeting has been moved to Thursday afternoon because the manager is travelling on Wednesday.",
  question: "Why was the meeting moved?",
  answers: [
    "The room was unavailable.",
    "The manager will be travelling.",
    "The team requested a new project.",
    "The office will close early.",
  ],
  correct: 1,
};

const grammarQuestion = {
  question: "If I _____ more time, I would join the speaking club.",
  answers: ["have", "had", "will have", "am having"],
  correct: 1,
};

const writingPrompt =
  "Write a short email to your manager asking to reschedule a meeting. Include a reason and suggest two alternative times.";

const speakingPhrase =
  "I understand your point. Could you give me an example?";

function colorClasses(color: string) {
  const colors: Record<string, string> = {
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    blue: "border-blue-400/25 bg-blue-400/10 text-blue-200",
    violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    rose: "border-rose-400/25 bg-rose-400/10 text-rose-200",
    orange: "border-orange-400/25 bg-orange-400/10 text-orange-200",
  };

  return colors[color] ?? colors.cyan;
}

function speak(text: string, rate = 0.86) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function SkillsHubPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { progress, completeSkill } = useLearningProgress();
  const requestedSkill = searchParams.get("skill");
  const initialSkill = skillModules.some(
    (module) => module.id === requestedSkill,
  )
    ? (requestedSkill as SkillId)
    : "vocabulary";
  const [selectedSkill, setSelectedSkill] =
    useState<SkillId>(initialSkill);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checkedAnswer, setCheckedAnswer] = useState<number | null>(null);
  const [readingIndex, setReadingIndex] = useState(0);
  const [writingText, setWritingText] = useState("");
  const [writingChecked, setWritingChecked] = useState(false);
  const [isShadowing, setIsShadowing] = useState(false);
  const [isTranscriptVisible, setIsTranscriptVisible] =
    useState(false);
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const shadowingTimeoutRef = useRef<number | null>(null);

  const activeModule =
    skillModules.find((module) => module.id === selectedSkill) ??
    skillModules[0];
  const isCurrentSkillCompleted =
    progress.completedSkillIds.includes(selectedSkill) ||
    (selectedSkill === "test" && progress.quizHighScore >= 60);
  const levelWords = useMemo(
    () =>
      vocabularyWords
        .filter((word) => word.level === selectedLevel)
        .slice(0, 8),
    [selectedLevel],
  );

  useEffect(() => {
    if (
      requestedSkill &&
      skillModules.some((module) => module.id === requestedSkill)
    ) {
      setSelectedSkill(requestedSkill as SkillId);
    }
  }, [requestedSkill]);

  useEffect(
    () => () => {
      if (shadowingTimeoutRef.current !== null) {
        window.clearTimeout(shadowingTimeoutRef.current);
      }
    },
    [],
  );

  const resetExercise = (skill: SkillId) => {
    if (shadowingTimeoutRef.current !== null) {
      window.clearTimeout(shadowingTimeoutRef.current);
      shadowingTimeoutRef.current = null;
    }

    setIsShadowing(false);
    setSelectedSkill(skill);
    setSearchParams({ skill });
    setSelectedAnswer(null);
    setCheckedAnswer(null);
    setWritingChecked(false);
    setIsTranscriptVisible(false);
  };

  const currentReadingQuestion = readingQuestions[readingIndex];
  const exerciseQuestion =
    selectedSkill === "reading"
      ? currentReadingQuestion
      : selectedSkill === "listening"
        ? listeningQuestion
        : grammarQuestion;

  const checkAnswer = () => {
    if (selectedAnswer !== null) {
      setCheckedAnswer(selectedAnswer);

      if (selectedAnswer === exerciseQuestion.correct) {
        completeSkill(selectedSkill);
      }
    }
  };

  const writingScore = useMemo(() => {
    const normalized = writingText.trim();
    const wordCount = normalized ? normalized.split(/\s+/).length : 0;
    const hasGreeting = /hi|hello|dear/i.test(normalized);
    const hasReason = /because|unavailable|schedule|sorry|conflict/i.test(
      normalized,
    );
    const hasTime = /\b\d{1,2}(:\d{2})?\s?(am|pm)?\b/i.test(normalized);
    return {
      wordCount,
      checks: [wordCount >= 35, hasGreeting, hasReason, hasTime],
    };
  }, [writingText]);

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-950/80 to-violet-500/15 p-6 shadow-2xl shadow-black/20 sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,.8)]" />
              Skills studio
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Một phòng tập cho mọi kỹ năng
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Chọn kỹ năng, làm một bài ngắn, nhận phản hồi và quay lại lộ trình.
              Mỗi phiên chỉ 10–15 phút nhưng được thiết kế để tạo tiến bộ thật.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["7", "khu luyện"],
              ["A1–C2", "cấp độ"],
              ["10′", "mỗi phiên"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur"
              >
                <p className="text-xl font-black">{value}</p>
                <p className="mt-1 text-[11px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[310px_1fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900/65 p-4 shadow-xl shadow-black/10 xl:sticky xl:top-24">
          <div className="px-3 pb-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Chọn kỹ năng
            </p>
          </div>
          <div className="space-y-2">
            {skillModules.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => resetExercise(module.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                  selectedSkill === module.id
                    ? `${colorClasses(module.color)} shadow-lg`
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl transition group-hover:scale-105">
                  {module.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black">{module.label}</span>
                  <span className="mt-0.5 block truncate text-[11px] opacity-60">
                    {module.eyebrow}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4">
            <p className="text-xs font-black text-cyan-200">Gợi ý hôm nay</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Làm 1 bài nghe, ôn 8 từ và viết 40 từ để giữ nhịp học.
            </p>
            <Link
              to="/dashboard/learning"
              className="mt-3 inline-flex text-xs font-black text-cyan-300 hover:text-cyan-200"
            >
              Xem lộ trình →
            </Link>
          </div>
        </aside>

        <main className="min-w-0 rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/10 sm:p-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={`text-xs font-black uppercase tracking-[0.18em] ${colorClasses(activeModule.color).split(" ").at(-1)}`}>
                {activeModule.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {activeModule.icon} {activeModule.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {activeModule.description}
              </p>
              {isCurrentSkillCompleted && (
                <span className="mt-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200">
                  ✓ Đã hoàn thành phiên luyện
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-black transition ${
                    selectedLevel === level
                      ? "bg-white text-slate-950"
                      : "bg-white/5 text-slate-500 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </header>

          {selectedSkill === "vocabulary" && (
            <section className="mt-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {levelWords.map((word) => (
                  <article
                    key={word.id}
                    className="premium-surface rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black">{word.word}</h3>
                        <p className="mt-1 text-xs text-cyan-300">
                          {word.phonetic}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speak(word.word)}
                        aria-label={`Phát âm ${word.word}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm transition hover:bg-cyan-400/20"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{word.meaning}</p>
                    <p className="mt-2 text-xs italic leading-5 text-slate-500">
                      {word.example}
                    </p>
                  </article>
                ))}
              </div>
              <Link
                to="/dashboard/vocabulary"
                className="mt-6 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-black text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Mở toàn bộ kho từ →
              </Link>
              <Button
                type="button"
                variant="secondary"
                className="ml-3 mt-6"
                onClick={() => completeSkill("vocabulary")}
              >
                ✓ Đã ôn xong 8 từ
              </Button>
            </section>
          )}

          {(selectedSkill === "reading" ||
            selectedSkill === "listening" ||
            selectedSkill === "grammar") && (
            <section className="mt-7">
              {selectedSkill === "reading" && (
                <article className="rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.04] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                      Reading bite · {readingIndex + 1}/
                      {readingQuestions.length}
                    </p>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                      {selectedLevel} · 180 words
                    </span>
                  </div>
                  <p className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm leading-8 text-slate-200">
                    Starting next Monday, the customer-support team will work
                    from 8:30 a.m. to 5:30 p.m. The new schedule is designed to
                    provide faster responses during the busiest hours. Staff
                    members may swap shifts with a colleague after informing
                    their supervisor.
                  </p>
                </article>
              )}

              {selectedSkill === "listening" && (
                <article className="rounded-3xl border border-blue-400/15 bg-blue-400/[0.04] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                      Listen & catch the reason
                    </p>
                    <Button
                      type="button"
                      size="small"
                      onClick={() => speak(listeningQuestion.script, 0.78)}
                    >
                      ▶ Nghe câu mẫu
                    </Button>
                  </div>
                  <p className="mt-5 text-sm text-slate-500">
                    Nghe ít nhất hai lần, ghi lại từ khóa trước khi xem đáp án.
                  </p>
                  <p className="mt-4 rounded-2xl border border-dashed border-blue-400/20 bg-slate-950/40 p-4 text-sm italic text-slate-500">
                    {isTranscriptVisible
                      ? listeningQuestion.script
                      : "Transcript sẽ hiện sau khi bạn chọn “Hiện transcript”."}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setIsTranscriptVisible(
                        (currentValue) => !currentValue,
                      )
                    }
                    className="mt-3 text-xs font-black text-blue-300 hover:text-blue-200"
                  >
                    {isTranscriptVisible
                      ? "Ẩn transcript"
                      : "Hiện transcript →"}
                  </button>
                </article>
              )}

              <article className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Quick check
                    </p>
                    <h3 className="mt-3 text-lg font-black">
                      {exerciseQuestion.question}
                    </h3>
                  </div>
                  {checkedAnswer !== null && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        checkedAnswer === exerciseQuestion.correct
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-red-400/10 text-red-300"
                      }`}
                    >
                      {checkedAnswer === exerciseQuestion.correct
                        ? "Chính xác"
                        : "Thử lại"}
                    </span>
                  )}
                </div>
                <div className="mt-5 grid gap-3">
                  {exerciseQuestion.answers.map((answer, index) => (
                    <button
                      key={answer}
                      type="button"
                      onClick={() => {
                        setSelectedAnswer(index);
                        setCheckedAnswer(null);
                      }}
                      className={`rounded-2xl border p-4 text-left text-sm transition ${
                        selectedAnswer === index
                          ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                          : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {answer}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Kiểm tra đáp án
                  </Button>
                  {selectedSkill === "reading" && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setReadingIndex(
                          (readingIndex + 1) % readingQuestions.length,
                        );
                        setSelectedAnswer(null);
                        setCheckedAnswer(null);
                      }}
                    >
                      Đoạn tiếp theo →
                    </Button>
                  )}
                </div>
              </article>
            </section>
          )}

          {selectedSkill === "speaking" && (
            <section className="mt-7">
              <article className="rounded-3xl border border-violet-400/15 bg-violet-400/[0.04] p-6 text-center sm:p-10">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                  Shadowing challenge
                </p>
                <p className="mx-auto mt-7 max-w-2xl text-2xl font-black leading-relaxed sm:text-4xl">
                  “{speakingPhrase}”
                </p>
                <p className="mt-4 text-sm text-slate-500">
                  Nghe mẫu → nói theo 3 lần → tự đánh giá độ rõ và ngữ điệu.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => speak(speakingPhrase)}
                  >
                    🔊 Nghe mẫu
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (isShadowing) {
                        if (shadowingTimeoutRef.current !== null) {
                          window.clearTimeout(
                            shadowingTimeoutRef.current,
                          );
                          shadowingTimeoutRef.current = null;
                        }

                        setIsShadowing(false);
                        completeSkill("speaking");
                        return;
                      }

                      setIsShadowing(true);
                      shadowingTimeoutRef.current = window.setTimeout(() => {
                        setIsShadowing(false);
                        shadowingTimeoutRef.current = null;
                        completeSkill("speaking");
                      }, 10_000);
                    }}
                  >
                    {isShadowing ? "⏹ Đang luyện..." : "🎙 Bắt đầu nói"}
                  </Button>
                </div>
              </article>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Âm cuối", "Đọc rõ phụ âm cuối"],
                  ["Trọng âm", "Nhấn đúng từ khóa"],
                  ["Ngữ điệu", "Lên xuống tự nhiên"],
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <p className="font-black">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSkill === "writing" && (
            <section className="mt-7">
              <article className="rounded-3xl border border-amber-400/15 bg-amber-400/[0.04] p-5 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                  Guided writing · Email
                </p>
                <h3 className="mt-4 text-xl font-black leading-8">
                  {writingPrompt}
                </h3>
                <textarea
                  value={writingText}
                  onChange={(event) => {
                    setWritingText(event.target.value);
                    setWritingChecked(false);
                  }}
                  placeholder="Dear ..., I am writing to ask if we could..."
                  rows={8}
                  className="mt-6 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/50"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>{writingScore.wordCount} từ · mục tiêu tối thiểu 35 từ</span>
                  <button
                    type="button"
                    onClick={() =>
                      setWritingText(
                        "Dear Ms. Lan,\n\nI am writing to ask if we could reschedule our meeting because I have a client call at 2 p.m. Could we meet at 10 a.m. on Tuesday or 3 p.m. on Wednesday?\n\nBest regards,\nMinh",
                      )
                    }
                    className="font-black text-amber-300 hover:text-amber-200"
                  >
                    Xem bài mẫu
                  </button>
                </div>
                <Button
                  type="button"
                  className="mt-5"
                  onClick={() => {
                    setWritingChecked(true);

                    if (
                      writingScore.checks.filter(Boolean).length >= 3
                    ) {
                      completeSkill("writing");
                    }
                  }}
                >
                  Nhận phản hồi
                </Button>
                {writingChecked && (
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {[
                      ["Đủ độ dài", writingScore.checks[0]],
                      ["Có lời chào", writingScore.checks[1]],
                      ["Nêu lý do", writingScore.checks[2]],
                      ["Đề xuất thời gian", writingScore.checks[3]],
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
              </article>
            </section>
          )}

          {selectedSkill === "test" && (
            <section className="mt-7 grid gap-4 md:grid-cols-2">
              {[
                [
                  "Diagnostic test",
                  "20 câu · 15 phút",
                  "Đo trình độ A1–C2",
                  "/dashboard/quiz",
                ],
                [
                  "Vocabulary sprint",
                  "30 câu · 10 phút",
                  "Từ vựng theo chủ đề",
                  "/dashboard/quiz",
                ],
                [
                  "TOEIC mini test",
                  "50 câu · 45 phút",
                  "Listening + Reading",
                  "/dashboard/toeic",
                ],
                [
                  "Weekly review",
                  "40 câu · 20 phút",
                  "Ôn lại lỗi thường gặp",
                  "/dashboard/quiz",
                ],
              ].map(([title, meta, detail, route]) => (
                <article
                  key={title}
                  className="premium-surface rounded-3xl border border-white/10 bg-white/[0.025] p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/10 text-2xl">
                    🧪
                  </span>
                  <h3 className="mt-5 text-xl font-black">{title}</h3>
                  <p className="mt-2 text-sm font-bold text-orange-200">{meta}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-6"
                    onClick={() => navigate(route)}
                  >
                    Bắt đầu →
                  </Button>
                </article>
              ))}
            </section>
          )}
        </main>
      </section>
    </div>
  );
}

export default SkillsHubPage;
