import { Link } from "react-router-dom";

const terms = [
  [
    "Tài khoản của bạn",
    "Hãy cung cấp thông tin hợp lệ, giữ bí mật thông tin đăng nhập và chỉ sử dụng tài khoản của chính bạn. Bạn chịu trách nhiệm với hoạt động được thực hiện từ phiên đăng nhập của mình.",
  ],
  [
    "Mục đích học tập",
    "MTD Lingo Pro hỗ trợ tự học tiếng Anh. Điểm CEFR, sửa bài, bài mẫu và phản hồi AI là gợi ý giáo dục, có thể chưa chính xác hoặc chưa phù hợp mọi ngữ cảnh; chúng không thay thế giáo viên, giám khảo hay tư vấn chuyên môn.",
  ],
  [
    "Nội dung bạn gửi",
    "Bạn giữ trách nhiệm với nội dung mình nhập. Không gửi nội dung vi phạm quyền của người khác, mã độc, thông tin tuyệt mật hoặc dữ liệu cá nhân nhạy cảm không cần thiết. Bạn cho phép hệ thống xử lý nội dung trong phạm vi cần để cung cấp tính năng bạn chủ động sử dụng.",
  ],
  [
    "AI và tính sẵn sàng",
    "Một số tính năng dùng nhà cung cấp AI bên thứ ba hoặc bộ chấm heuristic dự phòng. Kết quả, tốc độ và tính sẵn sàng có thể thay đổi. Nguồn xử lý Writing được ghi trên kết quả để bạn đánh giá đúng mức độ tin cậy.",
  ],
  [
    "Sử dụng hợp lý",
    "Không cố vượt kiểm soát truy cập, khai thác lỗ hổng, làm gián đoạn dịch vụ, tự động gửi khối lượng lớn hoặc dùng nền tảng để gây hại. Hệ thống có thể giới hạn tần suất để bảo vệ người học và hạ tầng.",
  ],
  [
    "Dữ liệu và thay đổi",
    "Cách xử lý dữ liệu được mô tả trong Chính sách quyền riêng tư. Tính năng hoặc điều khoản có thể được cập nhật; ngày cập nhật sẽ được hiển thị trên trang này. Nếu không đồng ý với phiên bản hiện hành, bạn nên ngừng sử dụng tính năng liên quan và xóa dữ liệu qua công cụ có sẵn.",
  ],
];

function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_80%_8%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_24%_0%,rgba(139,92,246,0.14),transparent_32%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl font-black tracking-tight">
            MTD <span className="text-cyan-300">Lingo Pro</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-black">
            <Link
              to="/privacy"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-slate-300 transition hover:text-white"
            >
              Quyền riêng tư
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-cyan-300 px-4 py-2.5 text-slate-950 transition hover:bg-cyan-200"
            >
              Tạo tài khoản
            </Link>
          </div>
        </nav>

        <header className="pb-10 pt-20 sm:pb-14 sm:pt-28">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
            Terms · bản dễ đọc
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Học chủ động, dùng có trách nhiệm.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            Khi tạo tài khoản hoặc tiếp tục sử dụng MTD Lingo Pro, bạn đồng ý
            với các nguyên tắc dưới đây và Chính sách quyền riêng tư hiện hành.
          </p>
          <p className="mt-4 text-xs font-bold text-slate-600">
            Cập nhật: 13/08/2026
          </p>
        </header>

        <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-900/65 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          {terms.map(([title, body], index) => (
            <article
              key={title}
              className="grid gap-4 border-b border-white/[0.07] p-6 last:border-b-0 sm:grid-cols-[70px_1fr] sm:p-8"
            >
              <span className="text-sm font-black tracking-[0.18em] text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-xl font-black text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[1.75rem] border border-violet-300/15 bg-violet-300/[0.045] p-6 sm:p-8">
          <h2 className="text-xl font-black">Trước khi đồng ý</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Hãy đọc thêm cách Writing, Speaking, phiên đăng nhập và lưu trữ
            trình duyệt hoạt động trong{" "}
            <Link
              to="/privacy"
              className="font-black text-cyan-300 underline decoration-cyan-300/30 underline-offset-4"
            >
              Chính sách quyền riêng tư
            </Link>
            . Trang này không đưa ra tuyên bố chứng nhận tuân thủ pháp lý.
          </p>
        </section>

        <footer className="flex flex-col gap-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Câu hỏi về điều khoản? Dùng kênh hỗ trợ hiển thị trong ứng dụng.</p>
          <div className="flex gap-4 font-bold">
            <Link to="/privacy" className="hover:text-white">Quyền riêng tư</Link>
            <Link to="/" className="hover:text-white">Trang chủ</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default TermsPage;
