import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { useAuth } from "../context/AuthContext";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "../utils/password";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    if (fullName.trim().length < 2) {
      return "Họ và tên phải có ít nhất 2 ký tự.";
    }

    if (!email.trim()) {
      return "Vui lòng nhập email.";
    }

    if (!isStrongPassword(password)) {
      return PASSWORD_REQUIREMENTS_MESSAGE;
    }

    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp.";
    }

    if (!acceptedTerms) {
      return "Bạn cần đồng ý với điều khoản sử dụng.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await register({
        fullName,
        email,
        password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể đăng ký. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-violet-500/20 via-slate-950 to-cyan-500/20 p-10 lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-white"
          >
            MTD <span className="text-cyan-400">Lingo Pro</span>
          </Link>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              Bắt đầu miễn phí
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight">
              Xây dựng thói quen học tiếng Anh mỗi ngày.
            </h1>

            <div className="mt-8 space-y-4 text-slate-300">
              <p>✓ Lộ trình học theo trình độ</p>
              <p>✓ Flashcard và Quiz tương tác</p>
              <p>✓ Theo dõi tiến độ học tập</p>
              <p>✓ Luyện nghe và luyện thi TOEIC</p>
            </div>
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
              Tạo tài khoản
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Đăng ký MTD Lingo Pro
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Tạo tài khoản để lưu bài học và tiến độ của bạn.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                id="register-full-name"
                label="Họ và tên"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                required
              />

              <Input
                id="register-email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                autoComplete="email"
                required
              />

              <Input
                id="register-password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tối thiểu 8 ký tự, đủ 4 nhóm"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                helperText="Gồm chữ hoa, chữ thường, số và ký tự đặc biệt; không có khoảng trắng."
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

              <Input
                id="register-confirm-password"
                label="Xác nhận mật khẩu"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                required
              />

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-cyan-400"
                />

                <span>
                  Tôi đồng ý với{" "}
                  <button
                    type="button"
                    className="font-bold text-cyan-300"
                  >
                    điều khoản sử dụng
                  </button>{" "}
                  và chính sách bảo mật.
                </span>
              </label>

              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300"
                >
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                size="large"
                isLoading={isSubmitting}
              >
                Tạo tài khoản
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-black text-cyan-300 transition hover:text-cyan-200"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
