import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Tạm thời chuyển thẳng tới Dashboard.
    // Sau này sẽ thay bằng API đăng nhập thật.
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-2xl lg:grid-cols-2">
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-violet-500/20 p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

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
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                Chào mừng trở lại
              </p>

              <h1 className="mt-4 text-4xl font-black leading-tight">
                Tiếp tục hành trình chinh phục tiếng Anh
              </h1>

              <p className="mt-5 max-w-md leading-7 text-slate-300">
                Đăng nhập để tiếp tục bài học, theo dõi tiến độ và duy trì chuỗi
                học tập mỗi ngày.
              </p>
            </div>

            <div className="relative grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-black">1.200+</p>
                <p className="mt-1 text-xs text-slate-400">Bài học</p>
              </div>

              <div>
                <p className="text-2xl font-black">8.500+</p>
                <p className="mt-1 text-xs text-slate-400">Từ vựng</p>
              </div>

              <div>
                <p className="text-2xl font-black">150+</p>
                <p className="mt-1 text-xs text-slate-400">Đề thi</p>
              </div>
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

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                Đăng nhập
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Chào mừng bạn quay lại
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Nhập thông tin tài khoản để tiếp tục học tập.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@gmail.com"
            required
            autoComplete="email"
            />

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-200"
                    >
                      Mật khẩu
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                required
                minLength={6}
                autoComplete="current-password"
                rightElement={
                <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-xs font-bold text-slate-400 transition hover:text-white"
                >
                {showPassword ? "Ẩn" : "Hiện"}
                </button>
  }
/>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-cyan-400"
                  />

                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <Button type="submit" fullWidth>
                Đăng nhập
                </Button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-600">HOẶC</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 font-semibold transition hover:bg-white/[0.07]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-slate-950">
                  G
                </span>

                Tiếp tục với Google
              </button>

              <p className="mt-8 text-center text-sm text-slate-400">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-bold text-cyan-400 transition hover:text-cyan-300"
                >
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;