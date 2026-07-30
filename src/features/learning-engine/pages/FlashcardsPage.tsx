import { useState } from "react";

import Button from "../../../components/ui/Button/Button";
import { flashcards } from "../data/lessonCatalog";
import useLearningProgress from "../hooks/useLearningProgress";

function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { progress, reviewFlashcard } = useLearningProgress();

  const currentCard = flashcards[currentIndex];

  const handlePlayAudio = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentCard.word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = (remembered: boolean) => {
    if (remembered) {
      reviewFlashcard(currentCard.id);
    }

    setCurrentIndex((currentIndex + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const reviewedCount = progress.reviewedFlashcardIds.length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-9">
      <section className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Flashcard
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Ôn tập từ vựng
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Nhấn vào thẻ để xem nghĩa và câu mẫu.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-400">
            Thẻ {currentIndex + 1}/{flashcards.length}
          </span>

          <span className="font-bold text-emerald-300">
            Đã nhớ {reviewedCount} từ
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{
              width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped((currentValue) => !currentValue)}
          className="mt-7 flex min-h-[420px] w-full flex-col items-center justify-center rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-violet-500/10 p-7 text-center transition hover:border-cyan-400/40"
        >
          {!isFlipped ? (
            <>
              <span className="rounded-full bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {currentCard.topic}
              </span>

              <h2 className="mt-8 text-5xl font-black sm:text-6xl">
                {currentCard.word}
              </h2>

              <p className="mt-4 text-xl text-cyan-300">
                {currentCard.phonetic}
              </p>

              <p className="mt-10 text-sm font-semibold text-slate-500">
                Nhấn để xem nghĩa
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
                Nghĩa tiếng Việt
              </p>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl">
                {currentCard.meaning}
              </h2>

              <div className="mt-8 max-w-2xl rounded-2xl bg-white/[0.04] p-5">
                <p className="text-sm font-bold text-slate-500">
                  Câu mẫu
                </p>

                <p className="mt-3 text-lg leading-8 text-slate-200">
                  {currentCard.example}
                </p>
              </div>
            </>
          )}
        </button>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Button
            type="button"
            variant="danger"
            fullWidth
            onClick={() => handleNext(false)}
          >
            Chưa nhớ
          </Button>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handlePlayAudio}
          >
            🔊 Phát âm
          </Button>

          <Button
            type="button"
            fullWidth
            onClick={() => handleNext(true)}
          >
            Đã nhớ
          </Button>
        </div>
      </section>
    </div>
  );
}

export default FlashcardsPage;