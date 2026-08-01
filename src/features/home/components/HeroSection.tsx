import { Link } from "react-router-dom";

const statistics = [
  {
    value: "7",
    label: "Kỹ năng tương tác",
  },
  {
    value: "A1–C2",
    label: "Khung trình độ",
  },
  {
    value: "500+",
    label: "Bài tập trong hệ thống",
  },
];

const dailyMix = [
  {
    icon: "🎧",
    title: "Nghe & bắt chi tiết",
    meta: "B1 · 4 lượt · 8 phút",
    color: "bg-blue-400/15 text-blue-100",
    status: "Tiếp theo",
  },
  {
    icon: "✦",
    title: "Xếp câu điều kiện",
    meta: "Ngữ pháp · 5 lượt · 7 phút",
    color: "bg-rose-400/15 text-rose-100",
    status: "Ôn lại",
  },
  {
    icon: "🗣️",
    title: "Shadowing tại công sở",
    meta: "Nói · 4 lượt · 6 phút",
    color: "bg-violet-400/15 text-violet-100",
    status: "Mới",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl motion-safe:animate-pulse" />
      <div className="animate-float absolute -left-40 top-52 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="animate-float-delayed absolute -right-40 top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="reveal-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-lg shadow-cyan-500/5 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,.9)]" />
            7 kỹ năng · A1–C2 · phản hồi tức thì
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Học ít lan man hơn.
            <span className="animate-gradient block bg-gradient-to-r from-cyan-200 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Thực hành nhiều hơn.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Lộ trình học tiếng Anh dành cho người Việt với bài nghe, nói, đọc,
            viết, ngữ pháp, từ vựng và TOEIC thật sự tương tác. Mỗi ngày hệ thống
            chọn một phiên ngắn, chấm ngay và lưu đúng điểm bạn cần ôn.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="premium-button inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-7 py-4 font-black text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Bắt đầu lộ trình miễn phí →
            </Link>

            <a
              href="#practice-demo"
              className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Thử bài tập ngay
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
            {statistics.map((item) => (
              <div key={item.label}>
                <p className="text-xl font-black text-white sm:text-2xl">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-up-delayed relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-violet-500/40 blur-xl" />

          <div className="premium-surface relative rounded-[32px] border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
                  Bản xem trước lộ trình
                </p>
                <h2 className="mt-2 text-xl font-black">Daily Mix · 21 phút</h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 font-black text-slate-950 shadow-lg shadow-cyan-500/15">
                3
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {dailyMix.map((item, index) => (
                <div
                  key={item.title}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 transition ${
                    index === 0
                      ? "border-cyan-300/25 bg-cyan-300/[0.07]"
                      : "border-white/10 bg-white/[0.025]"
                  }`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${item.color}`}>
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-black">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.meta}
                    </span>
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-black text-slate-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <div>
                <div className="flex items-center justify-between gap-3 text-xs font-bold">
                  <span className="text-slate-400">Mục tiêu 45 phút</span>
                  <span className="text-emerald-300">21 phút đã xếp</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[47%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
                </div>
              </div>
              <span className="text-2xl" aria-label="Chuỗi học tập">
                🔥
              </span>
            </div>

            <Link
              to="/login"
              className="premium-button mt-5 flex w-full items-center justify-center rounded-2xl bg-white py-3.5 font-bold text-slate-950 transition hover:bg-cyan-100"
            >
              Mở không gian học tập
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
