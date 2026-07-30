import { useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { useAuth } from "../context/AuthContext";

type LoginLocationState = {
  from?: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const locationState = location.state as LoginLocationState | null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email,
        password,
      });

      navigate(locationState?.from || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-cyan-500/20 via-slate-950 to-violet-500/20 p-10 lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-white"
          >
            MTD <span className="text-cyan-400">Lingo Pro</span>
          </Link>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              Học tiếng Anh thông minh
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight">
              Tiếp tục hành trình chinh phục tiếng Anh.
            </h1>

            <p className="mt-5 max-w-lg leading-8 text-slate-300">
              Đăng nhập để tiếp tục bài học, luyện từ vựng và theo dõi tiến
              độ mỗi ngày.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 MTD Lingo Pro
          </p>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex text-xl font-black lg:hidden"
            >
              MTD&nbsp;<span className="text-cyan-400">Lingo Pro</span>
            </Link>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-cyan-400 lg:mt-0">
              Chào mừng trở lại
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Đăng nhập tài khoản
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Nhập email và mật khẩu đã đăng ký.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                id="login-email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                required
              />

              <Input
                id="login-password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    className="text-xs font-bold text-cyan-300"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                }
              />

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300"
                >
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-400"
                  />
                  Ghi nhớ đăng nhập
                </label>

                <button
                  type="button"
                  className="text-sm font-bold text-cyan-300 transition hover:text-cyan-200"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button
                type="submit"
                fullWidth
                size="large"
                isLoading={isSubmitting}
              >
                Đăng nhập
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-black text-cyan-300 transition hover:text-cyan-200"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;