import { useState } from "react";

import Button from "../../../components/ui/Button/Button";

const toeicParts = [
  {
    part: "Part 1",
    title: "Mô tả hình ảnh",
    questions: 6,
    progress: 100,
    score: 92,
    icon: "🖼️",
  },
  {
    part: "Part 2",
    title: "Hỏi và đáp",
    questions: 25,
    progress: 78,
    score: 84,
    icon: "💬",
  },
  {
    part: "Part 3",
    title: "Hội thoại",
    questions: 39,
    progress: 54,
    score: 76,
    icon: "🎧",
  },
  {
    part: "Part 4",
    title: "Bài nói ngắn",
    questions: 30,
    progress: 30,
    score: 70,
    icon: "🎙️",
  },
  {
    part: "Part 5",
    title: "Hoàn thành câu",
    questions: 30,
    progress: 68,
    score: 81,
    icon: "✍️",
  },
  {
    part: "Part 6",
    title: "Hoàn thành đoạn văn",
    questions: 16,
    progress: 42,
    score: 74,
    icon: "📄",
  },
  {
    part: "Part 7",
    title: "Đọc hiểu",
    questions: 54,
    progress: 22,
    score: 67,
    icon: "📚",
  },
];

const mockTests = [
  {
    id: 1,
    title: "Đề thi thử TOEIC số 01",
    duration: "120 phút",
    questions: 200,
    score: 725,
    status: "Đã hoàn thành",
  },
  {
    id: 2,
    title: "Đề thi thử TOEIC số 02",
    duration: "120 phút",
    questions: 200,
    score: null,
    status: "Chưa làm",
  },
  {
    id: 3,
    title: "Mini Test Listening",
    duration: "45 phút",
    questions: 50,
    score: 390,
    status: "Đã hoàn thành",
  },
];

function ToeicPage() {
  const [targetScore, setTargetScore] = useState(800);
  const [selectedPart, setSelectedPart] = useState(toeicParts[1]);

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Luyện thi TOEIC
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Chinh phục mục tiêu TOEIC
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Luyện tập từng phần, theo dõi điểm số và làm đề thi thử theo cấu
            trúc TOEIC hoàn chỉnh.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          className="w-full sm:w-auto"
          onClick={() => console.log("Bắt đầu thi thử")}
        >
          Bắt đầu thi thử →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-blue-500/10 p-5">
          <p className="text-sm text-slate-400">Điểm hiện tại</p>
          <p className="mt-2 text-4xl font-black">725</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            +45 điểm trong tháng
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Mục tiêu</p>
          <p className="mt-2 text-4xl font-black">{targetScore}</p>

          <select
            value={targetScore}
            onChange={(event) => setTargetScore(Number(event.target.value))}
            className="mt-4 rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
          >
            <option value={650}>650 điểm</option>
            <option value={750}>750 điểm</option>
            <option value={800}>800 điểm</option>
            <option value={900}>900 điểm</option>
          </select>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Listening</p>
          <p className="mt-2 text-4xl font-black">390</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Mục tiêu 450
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Reading</p>
          <p className="mt-2 text-4xl font-black">335</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Mục tiêu 350
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div>
            <h2 className="text-xl font-black">Luyện tập theo từng Part</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn kỹ năng bạn cần cải thiện
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {toeicParts.map((item) => (
              <button
                key={item.part}
                type="button"
                onClick={() => setSelectedPart(item)}
                className={`rounded-2xl border p-5 text-left transition ${
                  selectedPart.part === item.part
                    ? "border-cyan-400/40 bg-cyan-400/[0.07]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                    {item.icon}
                  </div>

                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-cyan-300">
                    {item.score}%
                  </span>
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  {item.part}
                </p>

                <h3 className="mt-2 text-lg font-black">{item.title}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  {item.questions} câu hỏi
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Phần đang chọn
          </p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
              {selectedPart.icon}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-500">
                {selectedPart.part}
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {selectedPart.title}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-500">Tiến độ</p>
              <p className="mt-2 text-2xl font-black">
                {selectedPart.progress}%
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-500">Độ chính xác</p>
              <p className="mt-2 text-2xl font-black">
                {selectedPart.score}%
              </p>
            </div>
          </div>

          <Button
            type="button"
            fullWidth
            className="mt-6"
            onClick={() =>
              console.log("Luyện tập:", selectedPart.part)
            }
          >
            Luyện {selectedPart.part}
          </Button>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-black">Đề thi thử gần đây</h2>
          <p className="mt-1 text-sm text-slate-500">
            Luyện tập trong điều kiện giống kỳ thi thật
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {mockTests.map((test) => (
            <article
              key={test.id}
              className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h3 className="font-black">{test.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {test.duration} · {test.questions} câu hỏi
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="sm:text-right">
                  <p className="text-xs text-slate-500">{test.status}</p>
                  <p className="mt-1 font-black text-cyan-300">
                    {test.score ? `${test.score} điểm` : "Chưa có điểm"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant={test.score ? "secondary" : "primary"}
                  onClick={() => console.log("Mở đề:", test.title)}
                >
                  {test.score ? "Làm lại" : "Bắt đầu"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ToeicPage;