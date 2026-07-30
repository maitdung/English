import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import { quizQuestions } from "../data/lessonCatalog";
import useLearningProgress from "../hooks/useLearningProgress";

function QuizPage() {
  const navigate = useNavigate();
  const { saveQuizScore } = useLearningProgress();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const hasSelectedAnswer = selectedAnswer !== undefined;

  const handleSelectAnswer = (answerIndex: number) => {
    if (showExplanation) {
      return;
    }

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: answerIndex,
    }));
  };

  const handleContinue = () => {
    if (!showExplanation) {
      setShowExplanation(true);
      return;
    }

    const isLastQuestion =
      currentQuestionIndex === quizQuestions.length - 1;

    if (isLastQuestion) {
      const correctAnswers = quizQuestions.filter(
        (question) =>
          selectedAnswers[question.id] === question.correctAnswer,
      ).length;

      const score = Math.round(
        (correctAnswers / quizQuestions.length) * 100,
      );

      saveQuizScore(score);

      navigate("/dashboard/quiz/result", {
        state: {
          score,
          correctAnswers,
          totalQuestions: quizQuestions.length,
        },
      });

      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    setShowExplanation(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8 sm:py-9">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Kiểm tra kiến thức
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Quiz tổng hợp
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Hoàn thành toàn bộ câu hỏi để xem kết quả.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-400">
            Câu {currentQuestionIndex + 1}/{quizQuestions.length}
          </span>

          <span className="font-bold text-cyan-300">
            {Object.keys(selectedAnswers).length} câu đã trả lời
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quizQuestions.length) *
                100
              }%`,
            }}
          />
        </div>

        <h2 className="mt-8 text-xl font-black leading-8 sm:text-2xl">
          {currentQuestion.question}
        </h2>

        <div className="mt-7 space-y-3">
          {currentQuestion.answers.map((answer, answerIndex) => {
            const isSelected = selectedAnswer === answerIndex;
            const isCorrect =
              currentQuestion.correctAnswer === answerIndex;

            let answerClassName =
              "border-white/10 bg-white/[0.025] hover:border-cyan-400/30";

            if (showExplanation && isCorrect) {
              answerClassName =
                "border-emerald-400/40 bg-emerald-400/10";
            } else if (showExplanation && isSelected && !isCorrect) {
              answerClassName = "border-red-400/40 bg-red-400/10";
            } else if (isSelected) {
              answerClassName =
                "border-cyan-400/50 bg-cyan-400/10";
            }

            return (
              <button
                key={answer}
                type="button"
                onClick={() => handleSelectAnswer(answerIndex)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${answerClassName}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-black">
                  {String.fromCharCode(65 + answerIndex)}
                </span>

                <span className="font-semibold">{answer}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] p-5">
            <p className="text-sm font-black text-cyan-300">
              Giải thích
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
          <Button
            type="button"
            size="large"
            disabled={!hasSelectedAnswer}
            onClick={handleContinue}
          >
            {!showExplanation
              ? "Kiểm tra đáp án"
              : currentQuestionIndex === quizQuestions.length - 1
                ? "Xem kết quả"
                : "Câu tiếp theo →"}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default QuizPage;