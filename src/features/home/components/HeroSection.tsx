const statistics = [
  {
    value: "1.200+",
    label: "Bài học",
  },
  {
    value: "8.500+",
    label: "Từ vựng",
  },
  {
    value: "150+",
    label: "Đề luyện tập",
  },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -left-40 top-52 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-40 top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Học tiếng Anh thông minh hơn mỗi ngày
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Làm chủ tiếng Anh với một
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              lộ trình rõ ràng
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Học từ vựng, ngữ pháp, phát âm và luyện đề TOEIC trên cùng một nền
            tảng. Theo dõi tiến độ từng ngày và tập trung vào những kỹ năng bạn
            còn yếu.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              className="rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Bắt đầu học ngay →
            </button>

            <button
              type="button"
              className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 font-bold text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Xem lộ trình học
            </button>
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

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-violet-500/40 blur-xl" />

          <div className="relative rounded-[32px] border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Xin chào, MTD 👋</p>
                <h2 className="mt-1 text-xl font-bold">Tiếp tục hành trình</h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-bold">
                M
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Mục tiêu hôm nay</p>
                  <p className="mt-1 font-bold">Hoàn thành 3 bài học</p>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  67%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Bạn đã hoàn thành 2 trên 3 bài học.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-transparent p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-xl">
                  🎧
                </div>

                <p className="mt-5 text-sm text-slate-400">Bài học tiếp theo</p>
                <p className="mt-1 font-bold">Listening Part 2</p>
                <p className="mt-2 text-xs text-slate-500">12 phút · Cơ bản</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-transparent p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-xl">
                  🔥
                </div>

                <p className="mt-5 text-sm text-slate-400">Chuỗi học tập</p>
                <p className="mt-1 text-2xl font-black">12 ngày</p>
                <p className="mt-2 text-xs text-slate-500">
                  Kỷ lục của bạn: 18 ngày
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-2xl bg-white py-3.5 font-bold text-slate-950 transition hover:bg-slate-200"
            >
              Tiếp tục bài học
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;