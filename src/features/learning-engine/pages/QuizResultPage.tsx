import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import useLearningProgress from "../hooks/useLearningProgress";

type QuizResultState = {
  score?: number;
  correctAnswers?: number;
  totalQuestions?: number;
};

function QuizResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { progress } = useLearningProgress();

  const result = (location.state ?? {}) as QuizResultState;

  const score = result.score ?? progress.quizHighScore;
  const correctAnswers = result.correctAnswers ?? 0;
  const totalQuestions = result.totalQuestions ?? 5;

  const resultMessage =
    score >= 80
      ? "Xuất sắc! Bạn đã nắm rất chắc kiến thức."
      : score >= 60
        ? "Khá tốt! Hãy ôn thêm một chút để cải thiện."
        : "Bạn nên xem lại bài học và thử lại lần nữa.";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-6 text-center sm:p-10">
        <div className="text-7xl">
          {score >= 80 ? "🏆" : score >= 60 ? "⭐" : "📚"}
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
          Kết quả bài kiểm tra
        </p>

        <h1 className="mt-4 text-6xl font-black text-white">
          {score}%
        </h1>

        <p className="mt-5 text-lg font-bold text-slate-200">
          {resultMessage}
        </p>

        <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/[0.04] p-5">
            <p className="text-2xl font-black">{correctAnswers}</p>
            <p className="mt-1 text-xs text-slate-500">Câu đúng</p>
          </div>

          <div className="rounded-2xl bg-white/[0.04] p-5">
            <p className="text-2xl font-black">
              {totalQuestions - correctAnswers}
            </p>
            <p className="mt-1 text-xs text-slate-500">Câu sai</p>
          </div>

          <div className="rounded-2xl bg-white/[0.04] p-5">
            <p className="text-2xl font-black">
              {progress.quizHighScore}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Điểm cao nhất
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate("/dashboard/quiz")}
          >
            Làm lại Quiz
          </Button>

          <Link
            to="/dashboard/flashcards"
            className="flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Ôn Flashcard
          </Link>
        </div>
      </section>
    </div>
  );
}

export default QuizResultPage;