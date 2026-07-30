import { useMemo, useState } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

type VocabularyStatus = "learning" | "mastered" | "review";

type VocabularyWord = {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  topic: string;
  status: VocabularyStatus;
  level: string;
};

const vocabularyWords: VocabularyWord[] = [
  {
    id: 1,
    word: "achievement",
    phonetic: "/əˈtʃiːvmənt/",
    meaning: "thành tựu, thành tích",
    example: "Completing the course was a great achievement.",
    topic: "Giáo dục",
    status: "mastered",
    level: "B1",
  },
  {
    id: 2,
    word: "appointment",
    phonetic: "/əˈpɔɪntmənt/",
    meaning: "cuộc hẹn",
    example: "I have an appointment with the manager at 2 p.m.",
    topic: "Công sở",
    status: "learning",
    level: "A2",
  },
  {
    id: 3,
    word: "available",
    phonetic: "/əˈveɪləbl/",
    meaning: "có sẵn, rảnh",
    example: "The meeting room is available this afternoon.",
    topic: "Công sở",
    status: "review",
    level: "A2",
  },
  {
    id: 4,
    word: "destination",
    phonetic: "/ˌdestɪˈneɪʃn/",
    meaning: "điểm đến",
    example: "Paris is a popular tourist destination.",
    topic: "Du lịch",
    status: "learning",
    level: "B1",
  },
  {
    id: 5,
    word: "environment",
    phonetic: "/ɪnˈvaɪrənmənt/",
    meaning: "môi trường",
    example: "We should protect the natural environment.",
    topic: "Cuộc sống",
    status: "mastered",
    level: "B1",
  },
  {
    id: 6,
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    meaning: "cải thiện",
    example: "Daily practice will improve your English.",
    topic: "Giáo dục",
    status: "learning",
    level: "A2",
  },
  {
    id: 7,
    word: "opportunity",
    phonetic: "/ˌɒpəˈtjuːnəti/",
    meaning: "cơ hội",
    example: "This job is a good opportunity to gain experience.",
    topic: "Công sở",
    status: "review",
    level: "B1",
  },
  {
    id: 8,
    word: "reservation",
    phonetic: "/ˌrezəˈveɪʃn/",
    meaning: "sự đặt chỗ",
    example: "I made a hotel reservation for two nights.",
    topic: "Du lịch",
    status: "mastered",
    level: "B1",
  },
  {
    id: 9,
    word: "schedule",
    phonetic: "/ˈʃedjuːl/",
    meaning: "lịch trình",
    example: "My work schedule is very busy this week.",
    topic: "Công sở",
    status: "learning",
    level: "A2",
  },
];

const topics = ["Tất cả", "Công sở", "Du lịch", "Giáo dục", "Cuộc sống"];

function getStatusLabel(status: VocabularyStatus) {
  switch (status) {
    case "mastered":
      return "Đã thuộc";
    case "review":
      return "Cần ôn tập";
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
    default:
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }
}

function VocabularyPage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(
    vocabularyWords[0],
  );

  const filteredWords = useMemo(() => {
    const normalizedSearchValue = searchValue.trim().toLowerCase();

    return vocabularyWords.filter((word) => {
      const matchesTopic =
        selectedTopic === "Tất cả" || word.topic === selectedTopic;

      const matchesSearch =
        normalizedSearchValue.length === 0 ||
        word.word.toLowerCase().includes(normalizedSearchValue) ||
        word.meaning.toLowerCase().includes(normalizedSearchValue);

      return matchesTopic && matchesSearch;
    });
  }, [searchValue, selectedTopic]);

  const masteredWords = vocabularyWords.filter(
    (word) => word.status === "mastered",
  ).length;

  const learningWords = vocabularyWords.filter(
    (word) => word.status === "learning",
  ).length;

  const reviewWords = vocabularyWords.filter(
    (word) => word.status === "review",
  ).length;

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
          onClick={() => console.log("Bắt đầu ôn tập")}
        >
          Ôn tập ngay →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng số từ</p>
          <p className="mt-2 text-3xl font-black">{vocabularyWords.length}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Trong kho từ hiện tại
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
            {topics.map((topic) => (
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
                    console.log("Ôn tập từ:", selectedWord.word)
                  }
                >
                  Luyện từ này
                </Button>
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