import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";

const toeicParts = [
  {
    part: "Part 1",
    title: "Mô tả hình ảnh",
    questions: 6,
    icon: "🖼️",
    practiceSetId: "toeic-mini-mix",
  },
  {
    part: "Part 2",
    title: "Hỏi và đáp",
    questions: 25,
    icon: "💬",
    practiceSetId: "toeic-part-2-reflex",
  },
  {
    part: "Part 3",
    title: "Hội thoại",
    questions: 39,
    icon: "🎧",
    practiceSetId: "toeic-mini-mix",
  },
  {
    part: "Part 4",
    title: "Bài nói ngắn",
    questions: 30,
    icon: "🎙️",
    practiceSetId: "toeic-mini-mix",
  },
  {
    part: "Part 5",
    title: "Hoàn thành câu",
    questions: 30,
    icon: "✍️",
    practiceSetId: "toeic-part-5-sprint",
  },
  {
    part: "Part 6",
    title: "Hoàn thành đoạn văn",
    questions: 16,
    icon: "📄",
    practiceSetId: "toeic-mini-mix",
  },
  {
    part: "Part 7",
    title: "Đọc hiểu",
    questions: 54,
    icon: "📚",
    practiceSetId: "toeic-mini-mix",
  },
];

const mockTests = [
  {
    id: 1,
    title: "TOEIC Mini Mix",
    description: "Luyện nghe và đọc trong một phiên ngắn có chấm đáp án.",
    practiceSetId: "toeic-mini-mix",
  },
  {
    id: 2,
    title: "Ôn tập TOEIC tổng hợp",
    description: "Rà soát nhiều dạng câu hỏi trước khi luyện từng Part.",
    practiceSetId: "toeic-mini-mix",
  },
  {
    id: 3,
    title: "Listening Part 2 Reflex",
    description: "Tăng phản xạ nghe câu hỏi và chọn câu trả lời phù hợp.",
    practiceSetId: "toeic-part-2-reflex",
  },
];

function ToeicPage() {
  const navigate = useNavigate();
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
            Luyện từng Part bằng các bộ câu hỏi tương tác, chấm đáp án và xem
            giải thích ngay sau mỗi lượt làm.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/practice/toeic-mini-mix")}
        >
          Mở TOEIC Mini Mix →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-blue-500/10 p-5">
          <p className="text-sm text-slate-400">Bộ luyện sẵn sàng</p>
          <p className="mt-2 text-4xl font-black">3</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            TOEIC Mix · Part 2 · Part 5
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Mục tiêu tự chọn</p>
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
          <p className="mt-2 text-4xl font-black">Part 2</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Phản xạ hỏi và đáp
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Reading</p>
          <p className="mt-2 text-4xl font-black">Part 5</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Ngữ pháp và từ loại tốc độ
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
                    {item.questions} câu
                  </span>
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  {item.part}
                </p>

                <h3 className="mt-2 text-lg font-black">{item.title}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  Chọn để mở bộ luyện phù hợp
                </p>
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
              <p className="text-sm text-slate-500">Cấu trúc Part</p>
              <p className="mt-2 text-2xl font-black">
                {selectedPart.questions} câu
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-500">Hình thức</p>
              <p className="mt-2 text-2xl font-black">Có giải thích</p>
            </div>
          </div>

          <Button
            type="button"
            fullWidth
            className="mt-6"
            onClick={() =>
              navigate(`/dashboard/practice/${selectedPart.practiceSetId}`)
            }
          >
            Luyện {selectedPart.part}
          </Button>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-black">Bộ luyện TOEIC đề xuất</h2>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một bộ luyện thật để bắt đầu và nhận phản hồi ngay
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
                  {test.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm font-bold text-cyan-300 sm:text-right">
                  Chấm và giải thích sau mỗi câu
                </p>

                <Button
                  type="button"
                  onClick={() =>
                    navigate(`/dashboard/practice/${test.practiceSetId}`)
                  }
                >
                  Mở bộ luyện
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
