import { useMemo, useState } from "react";

import Button from "../../../components/ui/Button/Button";

type ListeningLesson = {
  id: number;
  title: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2";
  duration: number;
  progress: number;
  category: string;
  icon: string;
};

const listeningLessons: ListeningLesson[] = [
  {
    id: 1,
    title: "Greetings and Introductions",
    description: "Luyện nghe các đoạn hội thoại chào hỏi và giới thiệu bản thân.",
    level: "A1",
    duration: 8,
    progress: 100,
    category: "Giao tiếp",
    icon: "👋",
  },
  {
    id: 2,
    title: "Daily Activities",
    description: "Nghe và nhận biết các hoạt động thường ngày.",
    level: "A2",
    duration: 12,
    progress: 72,
    category: "Cuộc sống",
    icon: "☀️",
  },
  {
    id: 3,
    title: "At the Office",
    description: "Hội thoại trong môi trường làm việc và văn phòng.",
    level: "A2",
    duration: 15,
    progress: 45,
    category: "Công sở",
    icon: "💼",
  },
  {
    id: 4,
    title: "Travel Announcements",
    description: "Luyện nghe thông báo tại sân bay, nhà ga và khách sạn.",
    level: "B1",
    duration: 18,
    progress: 20,
    category: "Du lịch",
    icon: "✈️",
  },
  {
    id: 5,
    title: "News and Interviews",
    description: "Nghe các bản tin ngắn và cuộc phỏng vấn bằng tiếng Anh.",
    level: "B2",
    duration: 22,
    progress: 0,
    category: "Nâng cao",
    icon: "🎙️",
  },
  {
    id: 6,
    title: "Question and Response",
    description: "Luyện phản xạ với dạng câu hỏi và câu trả lời ngắn.",
    level: "B1",
    duration: 16,
    progress: 60,
    category: "TOEIC",
    icon: "❓",
  },
];

const levels = ["Tất cả", "A1", "A2", "B1", "B2"];

function ListeningPage() {
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [activeLesson, setActiveLesson] = useState<ListeningLesson>(
    listeningLessons[1],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const filteredLessons = useMemo(() => {
    if (selectedLevel === "Tất cả") {
      return listeningLessons;
    }

    return listeningLessons.filter(
      (lesson) => lesson.level === selectedLevel,
    );
  }, [selectedLevel]);

  const completedLessons = listeningLessons.filter(
    (lesson) => lesson.progress === 100,
  ).length;

  const totalMinutes = listeningLessons.reduce(
    (total, lesson) => total + lesson.duration,
    0,
  );

  const questions = [
    {
      question: "What time does the meeting begin?",
      answers: ["At nine o'clock", "In the meeting room", "With the manager"],
    },
    {
      question: "Where is the speaker going?",
      answers: ["To the airport", "At seven thirty", "By train"],
    },
    {
      question: "Why did the woman call?",
      answers: ["To confirm an appointment", "On Monday", "Her colleague"],
    },
  ];

  const handleToggleAudio = () => {
    setIsPlaying((current) => !current);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Luyện nghe
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Nghe hiểu tiếng Anh tự nhiên
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Luyện nghe theo cấp độ, cải thiện khả năng nhận biết âm thanh và
            phản xạ với hội thoại thực tế.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          className="w-full sm:w-auto"
          onClick={() => setActiveLesson(listeningLessons[1])}
        >
          Tiếp tục luyện nghe →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Bài nghe</p>
          <p className="mt-2 text-3xl font-black">
            {listeningLessons.length}
          </p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Đủ 4 cấp độ
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Đã hoàn thành</p>
          <p className="mt-2 text-3xl font-black">{completedLessons}</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Tiếp tục duy trì
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tổng thời lượng</p>
          <p className="mt-2 text-3xl font-black">{totalMinutes} phút</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Nội dung luyện tập
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-blue-500/10 p-5">
          <p className="text-sm text-slate-400">Chuỗi luyện nghe</p>
          <p className="mt-2 text-3xl font-black">7 ngày</p>
          <p className="mt-5 text-xs font-semibold text-amber-300">
            Kỷ lục 12 ngày
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-black">Danh sách bài nghe</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn bài phù hợp với trình độ của bạn
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                  selectedLevel === level
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  setActiveLesson(lesson);
                  setIsPlaying(false);
                }}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  activeLesson.id === lesson.id
                    ? "border-cyan-400/40 bg-cyan-400/[0.07]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
                    {lesson.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black">{lesson.title}</p>

                      <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-cyan-300">
                        {lesson.level}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {lesson.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-500">
                        {lesson.duration} phút · {lesson.category}
                      </span>

                      <span className="text-xs font-bold text-cyan-300">
                        {lesson.progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Đang luyện tập
              </p>

              <h2 className="mt-3 text-2xl font-black">
                {activeLesson.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {activeLesson.description}
              </p>
            </div>

            <span className="w-fit rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
              {activeLesson.level}
            </span>
          </div>

          <div className="mt-7 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleToggleAudio}
                aria-label={isPlaying ? "Tạm dừng" : "Phát bài nghe"}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400 text-3xl text-slate-950 transition hover:scale-105 hover:bg-cyan-300"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
            </div>

            <div className="mt-7">
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full bg-cyan-400 transition-all ${
                    isPlaying ? "w-2/3" : "w-1/4"
                  }`}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{isPlaying ? "01:04" : "00:24"}</span>
                <span>01:36</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black">
                Câu hỏi {currentQuestion + 1}/{questions.length}
              </p>

              <button
                type="button"
                onClick={() =>
                  setCurrentQuestion(
                    (currentQuestion + 1) % questions.length,
                  )
                }
                className="text-xs font-bold text-cyan-300"
              >
                Câu tiếp theo →
              </button>
            </div>

            <p className="mt-5 text-lg font-bold">
              {questions[currentQuestion].question}
            </p>

            <div className="mt-5 space-y-3">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={answer}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left text-sm transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-black">
                    {String.fromCharCode(65 + index)}
                  </span>

                  {answer}
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ListeningPage;