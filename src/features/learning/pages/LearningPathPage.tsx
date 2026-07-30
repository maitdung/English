import Button from "../../../components/ui/Button/Button";

const learningStages = [
  {
    id: 1,
    title: "Nền tảng tiếng Anh",
    description:
      "Củng cố phát âm, từ loại, cấu trúc câu và những chủ điểm ngữ pháp cơ bản.",
    icon: "🌱",
    status: "completed",
    progress: 100,
    lessonsCompleted: 12,
    totalLessons: 12,
    duration: "6 giờ",
    topics: ["Phát âm cơ bản", "Từ loại", "Cấu trúc câu"],
  },
  {
    id: 2,
    title: "Giao tiếp hằng ngày",
    description:
      "Luyện nghe và phản xạ trong các tình huống quen thuộc của cuộc sống.",
    icon: "💬",
    status: "active",
    progress: 64,
    lessonsCompleted: 9,
    totalLessons: 14,
    duration: "8 giờ",
    topics: ["Chào hỏi", "Mua sắm", "Hỏi đường"],
  },
  {
    id: 3,
    title: "Từ vựng theo chủ đề",
    description:
      "Mở rộng vốn từ vựng thiết yếu cho công việc, học tập và giao tiếp.",
    icon: "📚",
    status: "available",
    progress: 18,
    lessonsCompleted: 3,
    totalLessons: 16,
    duration: "10 giờ",
    topics: ["Công sở", "Du lịch", "Giáo dục"],
  },
  {
    id: 4,
    title: "Ngữ pháp trung cấp",
    description:
      "Nắm chắc các thì, câu điều kiện, câu bị động và mệnh đề quan hệ.",
    icon: "✍️",
    status: "locked",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 18,
    duration: "12 giờ",
    topics: ["Các thì", "Câu điều kiện", "Mệnh đề"],
  },
  {
    id: 5,
    title: "Luyện nghe chuyên sâu",
    description:
      "Phát triển khả năng nghe hiểu hội thoại, thông báo và bài nói dài.",
    icon: "🎧",
    status: "locked",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 15,
    duration: "11 giờ",
    topics: ["Hội thoại", "Thông báo", "Bài nói"],
  },
  {
    id: 6,
    title: "Luyện thi TOEIC",
    description:
      "Làm quen cấu trúc đề thi và luyện chiến thuật cho từng phần TOEIC.",
    icon: "🏆",
    status: "locked",
    progress: 0,
    lessonsCompleted: 0,
    totalLessons: 24,
    duration: "18 giờ",
    topics: ["Listening", "Reading", "Luyện đề"],
  },
];

function getStatusText(status: string) {
  switch (status) {
    case "completed":
      return "Đã hoàn thành";
    case "active":
      return "Đang học";
    case "available":
      return "Có thể bắt đầu";
    default:
      return "Chưa mở khóa";
  }
}

function getStatusClassName(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "active":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    case "available":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-slate-500";
  }
}

function LearningPathPage() {
  const completedStages = learningStages.filter(
    (stage) => stage.status === "completed",
  ).length;

  const totalLessons = learningStages.reduce(
    (total, stage) => total + stage.totalLessons,
    0,
  );

  const completedLessons = learningStages.reduce(
    (total, stage) => total + stage.lessonsCompleted,
    0,
  );

  const totalProgress = Math.round((completedLessons / totalLessons) * 100);

  const handleStageAction = (stageTitle: string) => {
    console.log("Mở chặng học:", stageTitle);
  };

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Lộ trình cá nhân
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Con đường chinh phục tiếng Anh
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Hoàn thành từng chặng theo đúng thứ tự để xây dựng nền tảng vững
            chắc và phát triển toàn diện các kỹ năng.
          </p>
        </div>

        <Button
          type="button"
          size="large"
          onClick={() => handleStageAction("Giao tiếp hằng ngày")}
          className="w-full sm:w-auto"
        >
          Tiếp tục chặng hiện tại →
        </Button>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Tiến độ tổng thể</p>
          <p className="mt-2 text-3xl font-black">{totalProgress}%</p>

          <div
            className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-label="Tiến độ tổng thể"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={totalProgress}
          >
            <div
              className="h-full rounded-full bg-cyan-400"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Chặng hoàn thành</p>
          <p className="mt-2 text-3xl font-black">
            {completedStages} / {learningStages.length}
          </p>
          <p className="mt-5 text-xs font-semibold text-emerald-300">
            Tiếp tục duy trì tiến độ
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Bài học hoàn thành</p>
          <p className="mt-2 text-3xl font-black">
            {completedLessons} / {totalLessons}
          </p>
          <p className="mt-5 text-xs font-semibold text-cyan-300">
            Còn {totalLessons - completedLessons} bài học
          </p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-violet-500/10 p-5">
          <p className="text-sm text-slate-400">Chặng hiện tại</p>
          <p className="mt-2 text-xl font-black">Giao tiếp hằng ngày</p>
          <p className="mt-5 text-xs font-semibold text-violet-300">
            Hoàn thành 64%
          </p>
        </article>
      </section>

      <section className="mt-8">
        <div>
          <h2 className="text-2xl font-black">Các chặng học</h2>

          <p className="mt-2 text-sm text-slate-500">
            Hoàn thành chặng trước để mở khóa nội dung tiếp theo.
          </p>
        </div>

        <div className="relative mt-7 space-y-5">
          <div className="absolute bottom-10 left-7 top-10 hidden w-px bg-gradient-to-b from-emerald-400 via-cyan-400 to-slate-800 lg:block" />

          {learningStages.map((stage, index) => {
            const isLocked = stage.status === "locked";

            return (
              <article
                key={stage.id}
                className={`relative rounded-3xl border p-5 transition sm:p-6 lg:ml-16 ${
                  isLocked
                    ? "border-white/[0.06] bg-slate-900/30 opacity-70"
                    : "border-white/10 bg-slate-900/60 hover:-translate-y-0.5 hover:border-cyan-400/20"
                }`}
              >
                <div
                  className={`absolute -left-[65px] top-7 hidden h-14 w-14 items-center justify-center rounded-2xl border text-xl lg:flex ${
                    stage.status === "completed"
                      ? "border-emerald-400/30 bg-emerald-400/10"
                      : stage.status === "active"
                        ? "border-cyan-400/40 bg-cyan-400/15"
                        : "border-white/10 bg-slate-900"
                  }`}
                >
                  {stage.status === "completed"
                    ? "✓"
                    : isLocked
                      ? "🔒"
                      : stage.icon}
                </div>

                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        Chặng {index + 1}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClassName(
                          stage.status,
                        )}`}
                      >
                        {getStatusText(stage.status)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-xl lg:hidden">
                        {isLocked ? "🔒" : stage.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl font-black sm:text-2xl">
                          {stage.title}
                        </h3>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {stage.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between gap-4 text-xs">
                        <span className="font-semibold text-slate-500">
                          {stage.lessonsCompleted}/{stage.totalLessons} bài học
                        </span>

                        <span className="font-black text-cyan-300">
                          {stage.progress}%
                        </span>
                      </div>

                      <div
                        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"
                        role="progressbar"
                        aria-label={`Tiến độ ${stage.title}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={stage.progress}
                      >
                        <div
                          className={`h-full rounded-full ${
                            stage.status === "completed"
                              ? "bg-emerald-400"
                              : "bg-cyan-400"
                          }`}
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-4 border-t border-white/10 pt-5 xl:w-52 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <div className="flex items-center justify-between text-sm xl:block">
                      <span className="text-slate-500">Thời lượng</span>
                      <p className="font-bold xl:mt-1">{stage.duration}</p>
                    </div>

                    {isLocked ? (
                      <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        disabled
                      >
                        Chưa mở khóa
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant={
                          stage.status === "completed" ? "secondary" : "primary"
                        }
                        fullWidth
                        onClick={() => handleStageAction(stage.title)}
                      >
                        {stage.status === "completed"
                          ? "Xem lại"
                          : stage.status === "active"
                            ? "Học tiếp"
                            : "Bắt đầu học"}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default LearningPathPage;