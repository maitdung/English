import { Link } from "react-router-dom";

const skills = [
  {
    icon: "🎧",
    title: "Luyện nghe",
    description:
      "Luyện phản xạ nghe qua hội thoại thực tế và các dạng bài TOEIC.",
    lessonCount: "Hội thoại + nghe hiểu",
  },
  {
    icon: "🗣️",
    title: "Luyện nói & phát âm",
    description:
      "Cải thiện phát âm, trọng âm và ngữ điệu qua từng chủ đề.",
    lessonCount: "Ngữ âm + phản xạ",
  },
  {
    icon: "📚",
    title: "Từ vựng",
    description:
      "Ghi nhớ từ vựng bằng flashcard và phương pháp lặp lại ngắt quãng.",
    lessonCount: "Theo chủ đề & cấp độ",
  },
  {
    icon: "✍️",
    title: "Ngữ pháp",
    description:
      "Học ngữ pháp từ cơ bản đến nâng cao với bài tập thực hành.",
    lessonCount: "Giải thích + thực hành",
  },
  {
    icon: "📖",
    title: "Luyện đọc",
    description:
      "Tăng tốc độ đọc hiểu với nội dung được phân chia theo trình độ.",
    lessonCount: "Đọc nhanh + đọc sâu",
  },
  {
    icon: "🖋️",
    title: "Luyện viết",
    description:
      "Viết câu, email và đoạn văn theo khung; nâng cấp từ vựng và cách diễn đạt.",
    lessonCount: "Từ câu đến bài luận",
  },
  {
    icon: "🧪",
    title: "Kiểm tra năng lực",
    description:
      "Quiz theo bài, kiểm tra kỹ năng và báo cáo điểm mạnh, điểm cần cải thiện.",
    lessonCount: "Phản hồi tức thì",
  },
  {
    icon: "🏆",
    title: "Luyện thi TOEIC",
    description:
      "Làm quen 7 Part, luyện chiến thuật thời gian và mô phỏng bài thi thực tế.",
    lessonCount: "Listening + Reading",
  },
];

const roadmap = [
  {
    number: "01",
    title: "Kiểm tra trình độ",
    description:
      "Thực hiện bài kiểm tra đầu vào để xác định chính xác trình độ hiện tại.",
  },
  {
    number: "02",
    title: "Nhận lộ trình cá nhân",
    description:
      "Hệ thống đề xuất nội dung và mục tiêu học phù hợp với năng lực của bạn.",
  },
  {
    number: "03",
    title: "Học và luyện tập",
    description:
      "Hoàn thành bài học ngắn mỗi ngày và củng cố kiến thức bằng bài tập.",
  },
  {
    number: "04",
    title: "Theo dõi tiến bộ",
    description:
      "Xem báo cáo học tập, điểm mạnh và những kỹ năng cần tiếp tục cải thiện.",
  },
];

function LearningSection() {
  return (
    <>
      <section id="skills" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">
              Học toàn diện
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Mọi kỹ năng bạn cần trên một nền tảng
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Nội dung được chia thành từng bài học ngắn, giúp bạn dễ dàng duy
              trì thói quen và nhìn thấy sự tiến bộ mỗi ngày.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <article
                key={skill.title}
                className="premium-surface group rounded-3xl border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/5 text-2xl transition group-hover:bg-cyan-400/10">
                  {skill.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">{skill.title}</h3>

                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-400">
                  {skill.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-cyan-300">
                    {skill.lessonCount}
                  </span>

                  <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-400">
              Lộ trình học
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Không còn học tiếng Anh một cách mơ hồ
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              MTD Lingo giúp bạn biết mình đang ở đâu, cần học gì và đã tiến bộ
              như thế nào. Mỗi bước đều có mục tiêu rõ ràng.
            </p>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <p className="text-sm font-bold text-cyan-300">
                Mục tiêu đầu tiên
              </p>

              <p className="mt-2 text-2xl font-black">
                15 phút học tập mỗi ngày
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Một kế hoạch nhỏ nhưng đều đặn sẽ hiệu quả hơn việc học nhiều
                giờ rồi bỏ dở.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.map((step) => (
              <article
                key={step.number}
                className="premium-surface flex gap-5 rounded-3xl border border-white/10 bg-slate-900/50 p-5 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-sm font-black text-violet-300">
                  {step.number}
                </div>

                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20 px-6 py-14 text-center sm:px-10">
          <div className="absolute inset-0 bg-slate-950/20" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Bắt đầu ngay hôm nay
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black sm:text-5xl">
              Biến tiếng Anh thành kỹ năng bạn tự tin sử dụng
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
              Tạo tài khoản miễn phí và bắt đầu bài kiểm tra trình độ đầu tiên
              của bạn.
            </p>

            <Link
              to="/register"
              className="premium-button mt-8 inline-flex rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
            >
              Tạo tài khoản miễn phí
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default LearningSection;
