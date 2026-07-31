import { useEffect, useMemo, useState } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { useAuth } from "../../auth/context/AuthContext";
import useLearningProgress from "../../learning-engine/hooks/useLearningProgress";
import {
  vocabularyLevels,
  vocabularyTopics,
  vocabularyWords as catalogWords,
  type VocabularyStatus,
  type VocabularyWord,
} from "../data/vocabularyCatalog";

const VOCABULARY_PROGRESS_KEY = "mtd-lingo-vocabulary-progress";

function getStatusLabel(status: VocabularyStatus) {
  switch (status) {
    case "mastered":
      return "Đã thuộc";
    case "review":
      return "Cần ôn tập";
    case "new":
      return "Từ mới";
    default:
      return "Đang học";
  }
}

function getStatusClassName(status: VocabularyStatus) {
  switch (status) {
    case "mastered":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "review":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "new":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";
    default:
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }
}

function VocabularyPage() {
  const { user } = useAuth();
  const { recordReview } = useLearningProgress();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, VocabularyStatus>
  >({});
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(
    catalogWords[0],
  );
  const progressKey = user
    ? `${VOCABULARY_PROGRESS_KEY}:${user.id}`
    : VOCABULARY_PROGRESS_KEY;

  useEffect(() => {
    try {
      const storedProgress = JSON.parse(
        window.localStorage.getItem(progressKey) ?? "{}",
      ) as Record<string, VocabularyStatus>;
      setStatusOverrides(storedProgress);
    } catch {
      window.localStorage.removeItem(progressKey);
    }
  }, [progressKey]);

  const words = useMemo(
    () =>
      catalogWords.map((word) => ({
        ...word,
        status: statusOverrides[String(word.id)] ?? word.status,
      })),
    [statusOverrides],
  );

  useEffect(() => {
    setSelectedWord((currentWord) =>
      currentWord
        ? words.find((word) => word.id === currentWord.id) ?? currentWord
        : words[0] ?? null,
    );
  }, [words]);

  const filteredWords = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return words.filter((word) => {
      const matchesTopic =
        selectedTopic === "Tất cả" || word.topic === selectedTopic;
      const matchesLevel =
        selectedLevel === "Tất cả" || word.level === selectedLevel;

      const matchesSearch =
        normalizedSearchValue.length === 0 ||
        word.word.toLowerCase().includes(normalizedSearchValue) ||
        word.meaning.toLowerCase().includes(normalizedSearchValue);

      return matchesTopic && matchesLevel && matchesSearch;
    });
  }, [searchValue, selectedLevel, selectedTopic, words]);

  const masteredWords = words.filter(
    (word) => word.status === "mastered",
  ).length;

  const learningWords = words.filter(
    (word) => word.status === "learning",
  ).length;

  const reviewWords = words.filter(
    (word) => word.status === "review",
  ).length;

  const updateWordStatus = (wordId: number, status: VocabularyStatus) => {
    const nextOverrides = {
      ...statusOverrides,
      [String(wordId)]: status,
    };
    setStatusOverrides(nextOverrides);
    window.localStorage.setItem(
      progressKey,
      JSON.stringify(nextOverrides),
    );
    setSelectedWord((currentWord) =>
      currentWord?.id === wordId
        ? { ...currentWord, status }
        : currentWord,
    );
    recordReview(
      `vocabulary:${wordId}`,
      "vocabulary",
      status === "mastered" ? 100 : status === "learning" ? 75 : 35,
    );
  };

  const handleReviewNow = () => {
    const reviewWord =
      words.find((word) => word.status === "review") ??
      words.find((word) => word.status === "learning") ??
      words.find((word) => word.status === "new");

    if (reviewWord) {
      setSelectedWord(reviewWord);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  const handlePlayAudio = (word: string) => {
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
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Kho từ vựng
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Học từ mới hiệu quả mỗi ngày
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Tìm kiếm, luyện phát âm và theo dõi trạng thái ghi nhớ của từng từ
            trong kho từ vựng cá nhân.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          className="w-full sm:w-auto"
          onClick={handleReviewNow}
        >
          Ôn tập ngay →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng số từ</p>
          <p className="mt-2 text-3xl font-black">{words.length}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            12 chủ đề · A1–C2
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đã thuộc</p>
          <p className="mt-2 text-3xl font-black">{masteredWords}</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Tiếp tục duy trì
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đang học</p>
          <p className="mt-2 text-3xl font-black">{learningWords}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Đang trong tiến trình
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-violet-500/10 p-5">
          <p className="text-sm text-slate-400">Cần ôn tập</p>
          <p className="mt-2 text-3xl font-black">{reviewWords}</p>
          <p className="mt-5 text-xs font-semibold text-amber-300">
            Nên ôn lại hôm nay
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
          <Input
            id="vocabulary-search"
            label="Tìm kiếm từ vựng"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt..."
            rightElement={<span aria-hidden="true">🔍</span>}
          />

          <div className="flex flex-wrap gap-2">
            {vocabularyTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  selectedTopic === topic
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {topic}
              </button>
              ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {vocabularyLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
                  selectedLevel === level
                    ? "border-violet-300 bg-violet-300 text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-white"
                }`}
              >
                {level === "Tất cả" ? "Mọi cấp độ" : level}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">Danh sách từ vựng</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tìm thấy {filteredWords.length} từ
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredWords.length > 0 ? (
              filteredWords.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => setSelectedWord(word)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedWord?.id === word.id
                      ? "border-cyan-400/40 bg-cyan-400/[0.07]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-lg font-black">{word.word}</p>

                        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-slate-400">
                          {word.level}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-cyan-300">
                        {word.phonetic}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        {word.meaning}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {word.topic}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClassName(
                          word.status,
                        )}`}
                      >
                        {getStatusLabel(word.status)}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-5 py-12 text-center">
                <div className="text-4xl">🔎</div>

                <p className="mt-4 font-bold">Không tìm thấy từ phù hợp</p>

                <p className="mt-2 text-sm text-slate-500">
                  Hãy đổi từ khóa hoặc chọn chủ đề khác.
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-5 sm:p-7 xl:sticky xl:top-24">
          {selectedWord ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-black sm:text-4xl">
                      {selectedWord.word}
                    </h2>

                    <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-400">
                      {selectedWord.level}
                    </span>
                  </div>

                  <p className="mt-2 text-cyan-300">
                    {selectedWord.phonetic}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAudio(selectedWord.word)}
                  aria-label={`Phát âm từ ${selectedWord.word}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl transition hover:bg-cyan-400/20"
                >
                  🔊
                </button>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Nghĩa tiếng Việt
                </p>

                <p className="mt-3 text-xl font-bold">
                  {selectedWord.meaning}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Câu mẫu
                </p>

                <p className="mt-3 leading-7 text-slate-200">
                  {selectedWord.example}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400">
                  Chủ đề: {selectedWord.topic}
                </span>

                <span
                  className={`rounded-xl border px-3 py-2 text-xs font-bold ${getStatusClassName(
                    selectedWord.status,
                  )}`}
                >
                  {getStatusLabel(selectedWord.status)}
                </span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => handlePlayAudio(selectedWord.word)}
                >
                  Nghe phát âm
                </Button>

                <Button
                  type="button"
                  fullWidth
                  onClick={() =>
                    updateWordStatus(selectedWord.id, "learning")
                  }
                >
                  Luyện từ này
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => updateWordStatus(selectedWord.id, "review")}
                  className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-400/20"
                >
                  Ôn lại
                </button>
                <button
                  type="button"
                  onClick={() => updateWordStatus(selectedWord.id, "mastered")}
                  className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200 transition hover:bg-emerald-400/20"
                >
                  Đã thuộc
                </button>
                <button
                  type="button"
                  onClick={() => updateWordStatus(selectedWord.id, "new")}
                  className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs font-bold text-violet-200 transition hover:bg-violet-400/20"
                >
                  Đặt lại
                </button>
              </div>
            </>
          ) : (
            <div className="py-14 text-center">
              <div className="text-5xl">📚</div>

              <p className="mt-5 text-xl font-black">
                Chọn một từ để xem chi tiết
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default VocabularyPage;
