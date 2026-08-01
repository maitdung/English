import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import { practiceSets } from "../data/practiceCatalog";
import {
  practiceSkillLabels,
  practiceTypeLabels,
  type PracticeExercise,
  type WritingExercise,
} from "../types/practice";

const accentClasses = {
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-200",
  orange: "border-orange-400/25 bg-orange-400/10 text-orange-200",
};

function normalizeAnswer(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9'\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function speak(text: string, rate = 0.82) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

function writingResult(exercise: WritingExercise, value: string) {
  const normalizedValue = value.trim().toLocaleLowerCase();
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const checklist = exercise.checklist.map((item) => ({
    label: item.label,
    passed:
      !item.keywords?.length ||
      item.keywords.some((keyword) =>
        normalizedValue.includes(keyword.toLocaleLowerCase()),
      ),
  }));
  const passedChecks = checklist.filter((item) => item.passed).length;
  const score = Math.round(
    ((Number(wordCount >= exercise.minimumWords) + passedChecks) /
      (exercise.checklist.length + 1)) *
      100,
  );

  return { checklist, score, wordCount };
}

function PracticeSessionPage() {
  const { setId } = useParams();
  const { completeSkill, recordReview, saveQuizScore } = useLearningProgress();
  const practiceSet = practiceSets.find((item) => item.id === setId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [speakingRating, setSpeakingRating] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const exercise = practiceSet?.exercises[currentIndex];

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const resetAnswer = () => {
    setSelectedOption(null);
    setTextAnswer("");
    setSelectedTokens([]);
    setSpeakingRating(null);
    setIsChecked(false);
    setShowHint(false);
  };

  const selectedSentence = useMemo(() => {
    if (!exercise || exercise.type !== "reorder") {
      return "";
    }

    return selectedTokens.map((index) => exercise.tokens[index]).join(" ");
  }, [exercise, selectedTokens]);

  const answerReady = useMemo(() => {
    if (!exercise) return false;

    switch (exercise.type) {
      case "multiple-choice":
      case "listening-choice":
        return selectedOption !== null;
      case "fill-blank":
      case "dictation":
      case "guided-writing":
        return textAnswer.trim().length > 0;
      case "reorder":
        return selectedTokens.length === exercise.tokens.length;
      case "shadowing":
        return speakingRating !== null;
    }
  }, [exercise, selectedOption, selectedTokens.length, speakingRating, textAnswer]);

  const calculateScore = (currentExercise: PracticeExercise) => {
    switch (currentExercise.type) {
      case "multiple-choice":
      case "listening-choice":
        return selectedOption === currentExercise.correctAnswer ? 100 : 0;
      case "fill-blank":
      case "dictation": {
        const acceptedAnswers = [
          currentExercise.correctAnswer,
          ...(currentExercise.acceptedAnswers ?? []),
        ].map(normalizeAnswer);
        return acceptedAnswers.includes(normalizeAnswer(textAnswer)) ? 100 : 0;
      }
      case "reorder":
        return normalizeAnswer(selectedSentence) ===
          normalizeAnswer(currentExercise.correctAnswer)
          ? 100
          : 0;
      case "guided-writing":
        return writingResult(currentExercise, textAnswer).score;
      case "shadowing":
        return speakingRating ?? 0;
    }
  };

  const finishSession = (nextScores: Record<string, number>) => {
    if (!practiceSet) return;

    const scoreValues = Object.values(nextScores);
    const finalScore = Math.round(
      scoreValues.reduce((total, score) => total + score, 0) /
        Math.max(scoreValues.length, 1),
    );

    recordReview(
      `practice:${practiceSet.id}`,
      "quiz",
      finalScore,
      practiceSet.duration,
    );

    if (finalScore >= 60) {
      completeSkill(practiceSet.skill === "toeic" ? "test" : practiceSet.skill);
    }

    if (practiceSet.skill === "toeic") {
      saveQuizScore(finalScore);
    }

    setIsFinished(true);
  };

  const handlePrimaryAction = () => {
    if (!exercise || !practiceSet) return;

    if (!isChecked) {
      const score = calculateScore(exercise);
      setScores((currentScores) => ({
        ...currentScores,
        [exercise.id]: score,
      }));
      setIsChecked(true);
      return;
    }

    const nextScores = {
      ...scores,
      [exercise.id]: scores[exercise.id] ?? calculateScore(exercise),
    };

    if (currentIndex === practiceSet.exercises.length - 1) {
      finishSession(nextScores);
      return;
    }

    setCurrentIndex((index) => index + 1);
    resetAnswer();
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setScores({});
    setIsFinished(false);
    resetAnswer();
  };

  if (!practiceSet || !exercise) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-4xl">
          🧭
        </div>
        <h1 className="mt-6 text-3xl font-black">Không tìm thấy bộ bài</h1>
        <p className="mt-3 text-slate-400">
          Bộ bài này có thể đã được đổi tên hoặc chưa được phát hành.
        </p>
        <Link
          to="/dashboard/practice"
          className="mt-7 inline-flex rounded-2xl bg-cyan-300 px-6 py-3 font-black text-slate-950"
        >
          Về thư viện luyện tập
        </Link>
      </div>
    );
  }

  const finalScore = Math.round(
    Object.values(scores).reduce((total, score) => total + score, 0) /
      Math.max(Object.values(scores).length, 1),
  );
  const currentScore = scores[exercise.id];
  const isCorrect = currentScore >= 60;
  const writingFeedback =
    exercise.type === "guided-writing"
      ? writingResult(exercise, textAnswer)
      : null;

  if (isFinished) {
    const passedExercises = Object.values(scores).filter(
      (score) => score >= 60,
    ).length;
    const nextSet =
      practiceSets.find(
        (item) =>
          item.skill === practiceSet.skill && item.id !== practiceSet.id,
      ) ?? practiceSets.find((item) => item.id !== practiceSet.id);

    return (
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="relative overflow-hidden rounded-[36px] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 via-slate-900 to-cyan-400/10 p-7 text-center shadow-2xl shadow-black/20 sm:p-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-emerald-300/20 bg-emerald-300/10 text-4xl">
              {finalScore >= 80 ? "🏆" : finalScore >= 60 ? "✨" : "💪"}
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
              Hoàn thành phiên luyện
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">
              {finalScore >= 80
                ? "Bạn làm rất tốt!"
                : finalScore >= 60
                  ? "Một bước tiến đáng giá"
                  : "Luyện lại là cách tiến bộ nhanh nhất"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Bạn đã hoàn thành “{practiceSet.title}”. Kết quả được lưu vào tiến
              độ và dùng để sắp lịch ôn tiếp theo.
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-emerald-300">{finalScore}%</p>
                <p className="mt-1 text-xs text-slate-500">Điểm phiên</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black">{passedExercises}</p>
                <p className="mt-1 text-xs text-slate-500">Mục đạt yêu cầu</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black">+{practiceSet.duration}</p>
                <p className="mt-1 text-xs text-slate-500">Phút học</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {nextSet && (
                <Link
                  to={`/dashboard/practice/${nextSet.id}`}
                  className="premium-button rounded-2xl bg-cyan-300 px-6 py-3.5 font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  Bài tiếp theo →
                </Link>
              )}
              <Button type="button" variant="secondary" onClick={restartSession}>
                Làm lại bộ này
              </Button>
              <Link
                to="/dashboard/practice"
                className="rounded-2xl px-6 py-3.5 font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Về thư viện
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 sm:py-9">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/practice"
            aria-label="Quay lại thư viện luyện tập"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            ←
          </Link>
          <div>
            <p className="text-xs font-bold text-slate-500">
              {practiceSkillLabels[practiceSet.skill]} · {practiceSet.level}
            </p>
            <h1 className="mt-1 font-black sm:text-lg">{practiceSet.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <span>{practiceSet.duration} phút</span>
          <span aria-hidden="true">•</span>
          <span>
            Câu {currentIndex + 1}/{practiceSet.exercises.length}
          </span>
        </div>
      </header>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 transition-all duration-500"
          style={{
            width: `${((currentIndex + Number(isChecked)) / practiceSet.exercises.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 rounded-[32px] border border-white/10 bg-slate-900/65 p-5 shadow-2xl shadow-black/15 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-black ${accentClasses[practiceSet.accent]}`}
            >
              {practiceTypeLabels[exercise.type]}
            </span>
            {exercise.hint && !isChecked && (
              <button
                type="button"
                onClick={() => setShowHint((value) => !value)}
                className="text-xs font-black text-amber-300 transition hover:text-amber-200"
              >
                {showHint ? "Ẩn gợi ý" : "💡 Xem gợi ý"}
              </button>
            )}
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
            {exercise.instruction}
          </p>

          {showHint && exercise.hint && (
            <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/80">
              {exercise.hint}
            </div>
          )}

          {(exercise.type === "multiple-choice" ||
            exercise.type === "listening-choice") && (
            <section className="mt-5">
              {exercise.type === "listening-choice" && exercise.transcript && (
                <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-blue-400/15 bg-gradient-to-r from-blue-400/[0.08] to-cyan-400/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black">Nghe đoạn âm thanh</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Bạn có thể nghe lại nhiều lần trước khi trả lời.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="small"
                    onClick={() => speak(exercise.transcript ?? "")}
                  >
                    ▶ Phát audio
                  </Button>
                </div>
              )}
              <h2 className="text-xl font-black leading-8 sm:text-2xl">
                {exercise.prompt}
              </h2>
              <div className="mt-6 grid gap-3">
                {exercise.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isAnswer = exercise.correctAnswer === index;
                  const feedbackClass = isChecked
                    ? isAnswer
                      ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-50"
                      : isSelected
                        ? "border-red-400/40 bg-red-400/10 text-red-50"
                        : "border-white/8 bg-white/[0.015] text-slate-500"
                    : isSelected
                      ? "border-cyan-300/50 bg-cyan-300/10 text-white"
                      : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/25 hover:bg-white/[0.04]";

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isChecked}
                      onClick={() => setSelectedOption(index)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${feedbackClass}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-semibold">{option}</span>
                      {isChecked && isAnswer && (
                        <span className="ml-auto text-emerald-300">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {isChecked &&
                exercise.type === "listening-choice" &&
                exercise.transcript && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-300">
                      Transcript
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {exercise.transcript}
                    </p>
                  </div>
                )}
            </section>
          )}

          {(exercise.type === "fill-blank" || exercise.type === "dictation") && (
            <section className="mt-5">
              {exercise.type === "dictation" && exercise.audioText && (
                <div className="mb-6 rounded-3xl border border-blue-400/15 bg-blue-400/[0.06] p-6 text-center">
                  <button
                    type="button"
                    onClick={() => speak(exercise.audioText ?? "", 0.76)}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-400 text-2xl text-slate-950 shadow-xl shadow-blue-500/20 transition hover:scale-105 hover:bg-blue-300"
                    aria-label="Phát câu chính tả"
                  >
                    ▶
                  </button>
                  <p className="mt-4 text-sm text-slate-400">
                    Nghe câu và viết lại chính xác những gì bạn nghe được.
                  </p>
                </div>
              )}
              <h2 className="text-xl font-black leading-8 sm:text-2xl">
                {exercise.prompt}
              </h2>
              <input
                value={textAnswer}
                disabled={isChecked}
                onChange={(event) => setTextAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && answerReady && !isChecked) {
                    handlePrimaryAction();
                  }
                }}
                placeholder={exercise.placeholder ?? "Nhập câu trả lời..."}
                className={`mt-6 w-full rounded-2xl border bg-slate-950/50 px-5 py-4 text-base text-white outline-none transition placeholder:text-slate-600 ${
                  isChecked
                    ? isCorrect
                      ? "border-emerald-400/40"
                      : "border-red-400/40"
                    : "border-white/10 focus:border-cyan-300/50"
                }`}
              />
              {isChecked && (
                <p className="mt-3 text-sm text-slate-400">
                  Đáp án: <strong className="text-white">{exercise.correctAnswer}</strong>
                </p>
              )}
            </section>
          )}

          {exercise.type === "reorder" && (
            <section className="mt-5">
              <h2 className="text-xl font-black leading-8 sm:text-2xl">
                {exercise.prompt}
              </h2>
              <div className="mt-6 min-h-24 rounded-2xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.04] p-4">
                {selectedTokens.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTokens.map((tokenIndex) => (
                      <button
                        key={tokenIndex}
                        type="button"
                        disabled={isChecked}
                        onClick={() =>
                          setSelectedTokens((tokens) =>
                            tokens.filter((index) => index !== tokenIndex),
                          )
                        }
                        className="rounded-xl bg-cyan-300 px-3 py-2 text-sm font-black text-slate-950"
                      >
                        {exercise.tokens[tokenIndex]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-slate-600">
                    Chạm vào các từ bên dưới để tạo câu.
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {exercise.tokens.map((token, index) => (
                  <button
                    key={`${token}-${index}`}
                    type="button"
                    disabled={isChecked || selectedTokens.includes(index)}
                    onClick={() =>
                      setSelectedTokens((tokens) => [...tokens, index])
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-white/25 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    {token}
                  </button>
                ))}
              </div>
              {isChecked && !isCorrect && (
                <p className="mt-4 text-sm text-slate-400">
                  Thứ tự đúng: <strong className="text-white">{exercise.correctAnswer}</strong>
                </p>
              )}
            </section>
          )}

          {exercise.type === "guided-writing" && (
            <section className="mt-5">
              <h2 className="text-xl font-black leading-8 sm:text-2xl">
                {exercise.prompt}
              </h2>
              <textarea
                value={textAnswer}
                disabled={isChecked}
                onChange={(event) => setTextAnswer(event.target.value)}
                placeholder={exercise.placeholder}
                rows={9}
                className="mt-6 w-full resize-y rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/50"
              />
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span>
                  {writingFeedback?.wordCount ?? 0} từ · mục tiêu {exercise.minimumWords}+
                </span>
                <span>{exercise.checklist.length} tiêu chí phản hồi</span>
              </div>
              {isChecked && writingFeedback && (
                <div className="mt-5 space-y-4">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <p
                      className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                        writingFeedback.wordCount >= exercise.minimumWords
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                      }`}
                    >
                      {writingFeedback.wordCount >= exercise.minimumWords ? "✓" : "○"} Đủ
                      {" "}{exercise.minimumWords} từ
                    </p>
                    {writingFeedback.checklist.map((item) => (
                      <p
                        key={item.label}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                          item.passed
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                        }`}
                      >
                        {item.passed ? "✓" : "○"} {item.label}
                      </p>
                    ))}
                  </div>
                  <details className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <summary className="cursor-pointer text-sm font-black text-amber-300">
                      Xem bài tham khảo
                    </summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                      {exercise.sampleAnswer}
                    </p>
                  </details>
                </div>
              )}
            </section>
          )}

          {exercise.type === "shadowing" && (
            <section className="mt-5 text-center">
              <div className="rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-400/[0.08] to-blue-400/[0.04] p-6 sm:p-10">
                <p className="text-sm text-slate-500">{exercise.prompt}</p>
                <blockquote className="mx-auto mt-6 max-w-3xl text-2xl font-black leading-relaxed sm:text-4xl">
                  “{exercise.modelText}”
                </blockquote>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-7"
                  onClick={() => speak(exercise.modelText, 0.76)}
                >
                  🔊 Nghe câu mẫu
                </Button>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  [60, "Cần luyện thêm", "Tôi còn vấp hoặc bỏ âm"],
                  [80, "Khá rõ", "Tôi theo kịp nhịp câu"],
                  [100, "Tự nhiên", "Âm và ngữ điệu đều tốt"],
                ].map(([score, label, detail]) => (
                  <button
                    key={String(score)}
                    type="button"
                    disabled={isChecked}
                    onClick={() => setSpeakingRating(Number(score))}
                    className={`rounded-2xl border p-4 text-left transition ${
                      speakingRating === score
                        ? "border-violet-300/50 bg-violet-300/10"
                        : "border-white/10 bg-white/[0.025] hover:border-white/25"
                    }`}
                  >
                    <p className="font-black">{label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {exercise.focusPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </section>
          )}

          {isChecked && (
            <div
              className={`mt-7 rounded-2xl border p-5 ${
                isCorrect
                  ? "border-emerald-400/20 bg-emerald-400/[0.07]"
                  : "border-amber-400/20 bg-amber-400/[0.07]"
              }`}
              role="status"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`font-black ${
                      isCorrect ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    {currentScore >= 90
                      ? "Rất tốt!"
                      : isCorrect
                        ? "Đạt yêu cầu"
                        : "Gần đúng rồi — xem lại nhé"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {exercise.explanation}
                  </p>
                </div>
                <span className="shrink-0 rounded-xl bg-white/[0.06] px-3 py-2 text-sm font-black">
                  {currentScore}%
                </span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-600">
              Kết quả được lưu sau khi hoàn thành toàn bộ bộ bài.
            </p>
            <Button
              type="button"
              size="large"
              disabled={!answerReady}
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto"
            >
              {!isChecked
                ? exercise.type === "guided-writing" || exercise.type === "shadowing"
                  ? "Nhận phản hồi"
                  : "Kiểm tra đáp án"
                : currentIndex === practiceSet.exercises.length - 1
                  ? "Xem kết quả →"
                  : "Câu tiếp theo →"}
            </Button>
          </div>
        </main>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Tiến độ bộ bài
            </p>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {practiceSet.exercises.map((item, index) => {
                const savedScore = scores[item.id];
                const stateClass =
                  savedScore !== undefined
                    ? savedScore >= 60
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-amber-300 text-slate-950"
                    : index === currentIndex
                      ? "bg-cyan-300 text-slate-950"
                      : "bg-white/[0.05] text-slate-500";

                return (
                  <span
                    key={item.id}
                    className={`flex aspect-square items-center justify-center rounded-xl text-xs font-black ${stateClass}`}
                  >
                    {index + 1}
                  </span>
                );
              })}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Bộ bài này rèn
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {practiceSet.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Hoàn thành với 60% trở lên để ghi nhận kỹ năng và mở lịch ôn.
            </p>
          </article>
        </aside>
      </div>
    </div>
  );
}

export default PracticeSessionPage;
