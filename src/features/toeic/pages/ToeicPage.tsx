import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import { knowledgeBooks } from "../../practice/data/knowledgeBooks";
import { practiceSets } from "../../practice/data/practiceCatalog";

const partConfigs = [
  {
    id: "part-1",
    part: "Part 1",
    title: "Mô tả hình ảnh",
    icon: "🖼️",
    setIds: ["toeic-part-1-photo-scenes"],
    focus: "Hành động, vị trí và trạng thái",
  },
  {
    id: "part-2",
    part: "Part 2",
    title: "Hỏi và đáp",
    icon: "💬",
    setIds: ["toeic-part-2-question-response", "toeic-part-2-reflex"],
    focus: "Từ để hỏi và phản xạ chức năng",
  },
  {
    id: "part-3",
    part: "Part 3",
    title: "Hội thoại",
    icon: "🎧",
    setIds: ["toeic-part-3-conversations"],
    focus: "Vấn đề, chi tiết và hành động tiếp theo",
  },
  {
    id: "part-4",
    part: "Part 4",
    title: "Bài nói ngắn",
    icon: "🎙️",
    setIds: ["toeic-part-4-talks"],
    focus: "Thông báo, mục đích và thay đổi lịch",
  },
  {
    id: "part-5",
    part: "Part 5",
    title: "Hoàn thành câu",
    icon: "✍️",
    setIds: ["toeic-part-5-grammar-vocabulary", "toeic-part-5-sprint"],
    focus: "Từ loại, thì, giới từ và collocation",
  },
  {
    id: "part-6",
    part: "Part 6",
    title: "Hoàn thành đoạn văn",
    icon: "📄",
    setIds: ["toeic-part-6-text-completion"],
    focus: "Mạch nghĩa, từ nối và ngữ cảnh email",
  },
  {
    id: "part-7",
    part: "Part 7",
    title: "Đọc hiểu",
    icon: "📚",
    setIds: ["toeic-part-7-reading-inbox"],
    focus: "Skim, chi tiết và suy luận",
  },
] as const;

const mockSetIds = ["toeic-full-mock-01", "toeic-mini-mix"];

function ToeicPage() {
  const navigate = useNavigate();
  const [targetScore, setTargetScore] = useState(800);
  const [selectedPartId, setSelectedPartId] = useState("part-2");

  const toeicSets = useMemo(
    () => practiceSets.filter((item) => item.skill === "toeic"),
    [],
  );
  const toeicBook = knowledgeBooks.find((book) => book.id === "book-toeic");
  const selectedPart =
    partConfigs.find((part) => part.id === selectedPartId) ?? partConfigs[0];
  const selectedSets = toeicSets.filter((set) =>
    selectedPart.setIds.some((setId) => setId === set.id),
  );
  const selectedQuestions = selectedSets.reduce(
    (total, set) => total + set.exercises.length,
    0,
  );
  const totalQuestions = toeicSets.reduce(
    (total, set) => total + set.exercises.length,
    0,
  );
  const firstSelectedSet = selectedSets[0];

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Luyện thi TOEIC · 7 Parts
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Chinh phục mục tiêu TOEIC
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Đi theo từng chương như một quyển sách: nghe ảnh, phản xạ, hội
            thoại, bài nói, ngữ pháp, điền đoạn và đọc hiểu. Câu nghe có audio
            transcript; mọi câu đều có đáp án và giải thích ngay sau khi nộp.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          className="w-full sm:w-auto"
          onClick={() => navigate("/dashboard/practice/toeic-full-mock-01")}
        >
          Làm Mini Mock 01 →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-blue-500/10 p-5">
          <p className="text-sm text-slate-400">Bộ luyện offline</p>
          <p className="mt-2 text-4xl font-black">{toeicSets.length}</p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Phủ đủ Part 1 → Part 7
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Câu hỏi có giải thích</p>
          <p className="mt-2 text-4xl font-black">{totalQuestions}</p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Nghe lại transcript bất cứ lúc nào
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Mục tiêu tự chọn</p>
          <p className="mt-2 text-4xl font-black">{targetScore}</p>

          <select
            aria-label="Chọn mục tiêu TOEIC"
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

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-slate-900 to-orange-500/10 p-5">
          <p className="text-sm text-slate-400">Lộ trình</p>
          <p className="mt-2 text-4xl font-black">
            {toeicBook?.chapters.length ?? 8}
          </p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            chương học như một quyển sách
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Luyện tập theo từng Part</h2>
              <p className="mt-1 text-sm text-slate-500">
                Chọn một chương để xem đúng số câu và bộ luyện tương ứng
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {totalQuestions} câu trong thư viện
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {partConfigs.map((part) => {
              const sets = toeicSets.filter((set) =>
                part.setIds.some((setId) => setId === set.id),
              );
              const questionCount = sets.reduce(
                (total, set) => total + set.exercises.length,
                0,
              );

              return (
                <button
                  key={part.id}
                  type="button"
                  aria-pressed={selectedPart.id === part.id}
                  onClick={() => setSelectedPartId(part.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selectedPart.id === part.id
                      ? "border-cyan-400/40 bg-cyan-400/[0.07]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-xl">
                      {part.icon}
                    </div>

                    <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-bold text-cyan-300">
                      {questionCount} câu
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    {part.part}
                  </p>

                  <h3 className="mt-2 text-lg font-black">{part.title}</h3>

                  <p className="mt-2 text-sm text-slate-500">{part.focus}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Chương đang chọn
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
              <p className="text-sm text-slate-500">Câu trong chương</p>
              <p className="mt-2 text-2xl font-black">{selectedQuestions}</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-500">Bộ luyện</p>
              <p className="mt-2 text-2xl font-black">
                {selectedSets.length} bộ
              </p>
            </div>
          </div>

          <Button
            type="button"
            fullWidth
            className="mt-6"
            disabled={!firstSelectedSet}
            onClick={() =>
              firstSelectedSet &&
              navigate(`/dashboard/practice/${firstSelectedSet.id}`)
            }
          >
            Luyện {selectedPart.part}
          </Button>
        </article>
      </section>

      {toeicBook && (
        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">
                {toeicBook.subtitle}
              </p>
              <h2 className="mt-2 text-xl font-black">Lộ trình 8 chương</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Mỗi chương có mục tiêu, checkpoint và bộ bài riêng; hãy quay
                lại sau 48 giờ để ôn những câu chưa chắc.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard/practice")}
            >
              Xem toàn thư viện
            </Button>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-4">
            {toeicBook.chapters.map((chapter, index) => {
              const chapterSet = practiceSets.find((set) =>
                chapter.setIds.includes(set.id),
              );
              const chapterQuestionCount = chapter.setIds.reduce(
                (total, setId) =>
                  total +
                  (practiceSets.find((set) => set.id === setId)?.exercises
                    .length ?? 0),
                0,
              );

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() =>
                    chapterSet &&
                    navigate(`/dashboard/practice/${chapterSet.id}`)
                  }
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.04]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black text-orange-300">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {chapterQuestionCount} câu
                    </span>
                  </div>
                  <h3 className="mt-3 font-black">{chapter.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {chapter.summary}
                  </p>
                  <p className="mt-3 text-xs font-bold text-cyan-300">
                    {chapter.estimatedMinutes} phút · {chapter.level}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-black">Bộ mock và ôn tập đề xuất</h2>
          <p className="mt-1 text-sm text-slate-500">
            Làm từng Part trước, sau đó kiểm tra khả năng chuyển kỹ năng trong
            Mini Mock.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {mockSetIds.map((setId) => {
            const set = toeicSets.find((item) => item.id === setId);
            if (!set) return null;

            return (
              <article
                key={set.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">{set.icon}</span>
                    <span className="text-xs font-bold text-cyan-300">
                      {set.exercises.length} câu · {set.duration} phút
                    </span>
                  </div>
                  <h3 className="mt-4 font-black">{set.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {set.description}
                  </p>
                </div>
                <Button
                  type="button"
                  className="mt-5"
                  onClick={() => navigate(`/dashboard/practice/${set.id}`)}
                >
                  Mở bộ luyện
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ToeicPage;
