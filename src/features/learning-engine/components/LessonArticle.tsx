import Button from "../../../components/ui/Button/Button";
import type { LessonSection } from "../types/learning";

type LessonArticleProps = {
  section: LessonSection;
  isLastSection: boolean;
  onComplete: () => void;
};

function LessonArticle({
  section,
  isLastSection,
  onComplete,
}: LessonArticleProps) {
  const handlePlayWord = (word: string) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85;

    window.speechSynthesis.speak(utterance);
  };

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
      <h2 className="text-2xl font-black sm:text-3xl">
        {section.title}
      </h2>

      <div className="mt-6 space-y-4">
        {section.content.map((paragraph) => (
          <p
            key={paragraph}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 text-sm leading-7 text-slate-300 sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {section.vocabulary && section.vocabulary.length > 0 && (
        <section className="mt-8">
          <h3 className="text-xl font-black">Từ vựng trong bài</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {section.vocabulary.map((item) => (
              <article
                key={item.word}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black">{item.word}</p>
                    <p className="mt-1 text-sm text-cyan-300">
                      {item.phonetic}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayWord(item.word)}
                    aria-label={`Phát âm từ ${item.word}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 transition hover:bg-cyan-400/20"
                  >
                    🔊
                  </button>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  {item.meaning}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
        <Button type="button" size="large" onClick={onComplete}>
          {isLastSection ? "Hoàn thành bài học" : "Hoàn thành và tiếp tục →"}
        </Button>
      </div>
    </article>
  );
}

export default LessonArticle;