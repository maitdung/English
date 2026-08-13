import { Link } from "react-router-dom";

const sections = [
  {
    number: "01",
    title: "Dữ liệu tài khoản",
    body: "Khi bạn đăng ký, hệ thống dùng thông tin tài khoản và tiến độ để xác thực, cá nhân hóa không gian học và giữ dữ liệu đúng chủ sở hữu. Mật khẩu được xử lý ở máy chủ; ứng dụng trình duyệt lưu phiên đăng nhập theo lựa chọn ghi nhớ của bạn.",
  },
  {
    number: "02",
    title: "Writing Studio",
    body: "Chỉ khi bạn đánh dấu đồng ý và gửi bài, đề bài, nội dung, mục tiêu và kết quả chấm mới được lưu vào tài khoản. Thời hạn mặc định hiện tại là tối đa 365 ngày; cấu hình hiển thị ngay trước nút gửi là thông tin áp dụng cho lần chấm đó. Bạn có thể xem, tải JSON, xóa từng bài hoặc xóa toàn bộ lịch sử.",
  },
  {
    number: "03",
    title: "Nhà cung cấp AI",
    body: "Tùy cấu hình máy chủ, nội dung Writing hoặc bản ghi văn bản của Speaking Coach có thể được gửi tới OpenAI, xAI hoặc Google Gemini để tạo phản hồi. Nhà cung cấp thực tế được hiển thị trong kết quả Writing; điều khoản và chính sách riêng của nhà cung cấp đó cũng áp dụng. Khi không có dịch vụ AI, Writing có thể trả về bộ chấm heuristic cục bộ và sẽ ghi nhãn rõ ràng.",
  },
  {
    number: "04",
    title: "Speaking Coach & giọng nói",
    body: "Ứng dụng gửi bản ghi văn bản bạn đã xác nhận tới máy chủ/nhà cung cấp AI, không chủ động tải tệp âm thanh giọng nói lên backend. Tuy nhiên, tính năng nhận dạng giọng nói của trình duyệt hoặc hệ điều hành có thể tự xử lý âm thanh theo cài đặt và chính sách của nhà cung cấp trình duyệt. Lịch sử điểm Speaking gần đây hiện được lưu cục bộ trong trình duyệt, không phải trên máy chủ.",
  },
  {
    number: "05",
    title: "Lưu trữ trong trình duyệt",
    body: "Phiên đăng nhập, tùy chọn giao diện và trạng thái học có thể dùng localStorage hoặc sessionStorage. Writing tự lưu bản nháp trong phiên/tab hiện tại; chỉ lưu qua các phiên khi bạn chủ động bật “Giữ bản nháp trên thiết bị”. Bạn có thể dùng nút “Xóa bản nháp” để xóa cả bản nháp phiên, bản lưu dài hơn và dữ liệu nháp từ phiên bản cũ.",
  },
  {
    number: "06",
    title: "An toàn & giới hạn",
    body: "Khóa nhà cung cấp AI được giữ ở máy chủ và các yêu cầu cá nhân yêu cầu phiên đăng nhập. Không hệ thống nào loại bỏ hoàn toàn mọi rủi ro; vì vậy đừng đưa mật khẩu, số thẻ, giấy tờ định danh hoặc thông tin bí mật vào bài luyện. Nội dung giáo dục và điểm AI chỉ mang tính hỗ trợ học tập.",
  },
];

function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-8 text-white sm:px-8 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_78%_4%,rgba(139,92,246,0.13),transparent_32%)]"
      />
      <div className="relative mx-auto max-w-5xl">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-xl font-black tracking-tight">
            MTD <span className="text-cyan-300">Lingo Pro</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-black">
            <Link
              to="/terms"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-slate-300 transition hover:text-white"
            >
              Điều khoản
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
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Privacy · bản dễ đọc
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Bạn biết dữ liệu đi đâu — và có quyền kiểm soát nó.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            Chính sách này mô tả cách MTD Lingo Pro xử lý dữ liệu trong phiên
            bản hiện tại. Đây là thông tin vận hành bằng ngôn ngữ thông thường,
            không phải tuyên bố chứng nhận tuân thủ pháp lý.
          </p>
          <p className="mt-4 text-xs font-bold text-slate-600">
            Cập nhật: 13/08/2026 · Thời hạn Writing mặc định: tối đa 365 ngày
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.number}
              className="rounded-[1.75rem] border border-white/[0.08] bg-slate-900/65 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-7"
            >
              <span className="text-xs font-black tracking-[0.2em] text-violet-300">
                {section.number}
              </span>
              <h2 className="mt-4 text-xl font-black text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-[1.75rem] border border-cyan-300/15 bg-cyan-300/[0.045] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Chính sách bên thứ ba
          </p>
          <h2 className="mt-3 text-2xl font-black">Đọc tại nguồn chính thức</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["OpenAI", "https://openai.com/policies/privacy-policy/"],
              ["Google", "https://policies.google.com/privacy"],
              ["xAI", "https://x.ai/legal/privacy-policy"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5 text-sm font-black text-slate-200 transition hover:border-cyan-300/30 hover:text-cyan-200"
              >
                {label} ↗
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">
            Nhà cung cấp được cấu hình có thể thay đổi. Chính sách riêng của
            nhà cung cấp thực sự xử lý yêu cầu sẽ áp dụng cho dữ liệu gửi tới họ.
          </p>
        </section>

        <footer className="flex flex-col gap-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Câu hỏi về dữ liệu? Dùng kênh hỗ trợ hiển thị trong ứng dụng.</p>
          <div className="flex gap-4 font-bold">
            <Link to="/terms" className="hover:text-white">Điều khoản</Link>
            <Link to="/" className="hover:text-white">Trang chủ</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default PrivacyPage;
