const overviewCards = [
  {
    label: "Bài học hoàn thành",
    value: "24",
    detail: "+6 trong tuần này",
    icon: "📘",
  },
  {
    label: "Từ vựng đã học",
    value: "486",
    detail: "+72 trong tuần này",
    icon: "📚",
  },
  {
    label: "Thời gian học",
    value: "12.5h",
    detail: "+3.2 giờ tuần này",
    icon: "⏱️",
  },
  {
    label: "Chuỗi học tập",
    value: "12 ngày",
    detail: "Kỷ lục: 18 ngày",
    icon: "🔥",
  },
];

const weeklyActivity = [
  { day: "T2", value: 42 },
  { day: "T3", value: 68 },
  { day: "T4", value: 54 },
  { day: "T5", value: 88 },
  { day: "T6", value: 72 },
  { day: "T7", value: 46 },
  { day: "CN", value: 64 },
];

const recentLessons = [
  {
    title: "Listening Part 2: Question & Response",
    category: "Luyện nghe",
    progress: 80,
    icon: "🎧",
  },
  {
    title: "Thì hiện tại hoàn thành",
    category: "Ngữ pháp",
    progress: 55,
    icon: "✍️",
  },
  {
    title: "Vocabulary: Office & Workplace",
    category: "Từ vựng",
    progress: 35,
    icon: "📚",
  },
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Tổng quan học tập
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Tiếp tục tiến bộ mỗi ngày
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Bạn đã hoàn thành 67% mục tiêu hôm nay. Chỉ còn một bài học nữa để
            duy trì chuỗi học tập.
          </p>
        </div>

        <button
          type="button"
          className="w-full rounded-2xl bg-cyan-400 px-6 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
        >
          Tiếp tục học →
        </button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="mt-2 text-3xl font-black">{card.value}</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl">
                {card.icon}
              </div>
            </div>

            <p className="mt-5 text-xs font-semibold text-emerald-300">
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Hoạt động tuần này</h2>
              <p className="mt-1 text-sm text-slate-500">
                Số phút học theo từng ngày
              </p>
            </div>

            <select className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none">
              <option>Tuần này</option>
              <option>Tuần trước</option>
            </select>
          </div>

          <div className="mt-8 flex h-64 items-end justify-between gap-3">
            {weeklyActivity.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="relative flex h-full w-full items-end overflow-hidden rounded-xl bg-white/[0.04]">
                  <div
                    className="w-full rounded-xl bg-gradient-to-t from-blue-600 to-cyan-300 transition hover:opacity-80"
                    style={{ height: `${item.value}%` }}
                  />

                  <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                    {item.value}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {item.day}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-5 sm:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Mục tiêu hôm nay
          </p>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#22d3ee_0deg,#22d3ee_240deg,#1e293b_240deg,#1e293b_360deg)]">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-900">
                <p className="text-4xl font-black">67%</p>
                <p className="mt-1 text-xs text-slate-500">Hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Bài học</span>
              <span className="font-bold">2 / 3</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Từ vựng</span>
              <span className="font-bold">18 / 20</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Thời gian</span>
              <span className="font-bold">32 / 45 phút</span>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Bài học gần đây</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tiếp tục từ vị trí bạn đã dừng
              </p>
            </div>

            <button
              type="button"
              className="text-sm font-bold text-cyan-400 transition hover:text-cyan-300"
            >
              Xem tất cả
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.title}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl">
                  {lesson.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{lesson.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {lesson.category}
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                  <p className="text-sm font-black text-cyan-300">
                    {lesson.progress}%
                  </p>

                  <button
                    type="button"
                    className="mt-0 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold transition hover:bg-white/10 sm:mt-2"
                  >
                    Học tiếp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7">
          <h2 className="text-xl font-black">Thành tích</h2>
          <p className="mt-1 text-sm text-slate-500">
            Các cột mốc gần đây của bạn
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                icon: "🔥",
                title: "Chuỗi 10 ngày",
                detail: "Học liên tục trong 10 ngày",
              },
              {
                icon: "⭐",
                title: "100 từ đầu tiên",
                detail: "Đã học thành công 100 từ",
              },
              {
                icon: "🎧",
                title: "Người nghe chăm chỉ",
                detail: "Hoàn thành 20 bài nghe",
              },
            ].map((achievement) => (
              <div
                key={achievement.title}
                className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                  {achievement.icon}
                </div>

                <div>
                  <p className="text-sm font-bold">{achievement.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {achievement.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;