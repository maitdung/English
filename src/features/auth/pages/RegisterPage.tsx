import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setErrorMessage("");

    // Tạm thời chuyển tới Dashboard.
    // Sau này sẽ thay bằng API đăng ký thật.
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-2xl lg:grid-cols-2">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-violet-500/20 via-blue-500/20 to-cyan-500/20 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            <Link to="/" className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 font-black text-slate-950">
                M
              </div>

              <div>
                <p className="text-lg font-black">MTD Lingo Pro</p>
                <p className="text-xs text-slate-400">
                  English Learning Platform
                </p>
              </div>
            </Link>

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
                Học miễn phí
              </p>

              <h1 className="mt-4 text-4xl font-black leading-tight">
                Xây dựng thói quen tiếng Anh ngay hôm nay
              </h1>

              <p className="mt-5 max-w-md leading-7 text-slate-300">
                Tạo tài khoản để nhận lộ trình học cá nhân và theo dõi sự tiến
                bộ qua từng ngày.
              </p>
            </div>

            <div className="relative space-y-4">
              {[
                "Bài kiểm tra trình độ miễn phí",
                "Lộ trình học tập cá nhân",
                "Theo dõi tiến độ mỗi ngày",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-black text-emerald-300">
                    ✓
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto max-w-md">
              <Link
                to="/"
                className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white lg:hidden"
              >
                ← Quay lại trang chủ
              </Link>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-400">
                Tạo tài khoản
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Bắt đầu học miễn phí
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Chỉ mất một phút để tạo tài khoản.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-200"
                    htmlFor="fullName"
                  >
                    Họ và tên
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    autoComplete="name"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-200"
                    htmlFor="registerEmail"
                  >
                    Email
                  </label>

                  <input
                    id="registerEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-200"
                    htmlFor="registerPassword"
                  >
                    Mật khẩu
                  </label>

                  <input
                    id="registerPassword"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold text-slate-200"
                    htmlFor="confirmPassword"
                  >
                    Xác nhận mật khẩu
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Nhập lại mật khẩu"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                  />
                </div>

                {errorMessage && (
                  <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {errorMessage}
                  </p>
                )}

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-400">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-violet-400"
                  />

                  <span>
                    Tôi đồng ý với{" "}
                    <button
                      type="button"
                      className="font-semibold text-violet-400"
                    >
                      điều khoản sử dụng
                    </button>{" "}
                    và chính sách bảo mật.
                  </span>
                </label>

            <Button type="submit" fullWidth>
                Tạo tài khoản
            </Button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-400">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-bold text-violet-400 transition hover:text-violet-300"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;