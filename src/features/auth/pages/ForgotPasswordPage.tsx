import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import { requestPasswordResetRequest } from "../../../lib/api/auth-api";
import type { PasswordResetRequestResult } from "../types/auth";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] =
    useState<PasswordResetRequestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setResult(null);

    try {
      setIsSubmitting(true);
      setResult(await requestPasswordResetRequest(email));
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Không thể tạo yêu cầu đặt lại mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-white">
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <section className="auth-card relative w-full max-w-xl rounded-[36px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-10">
        <Link
          to="/login"
          className="text-sm font-bold text-slate-400 transition hover:text-cyan-300"
        >
          ← Quay lại đăng nhập
        </Link>

        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-3xl shadow-lg shadow-cyan-500/10">
          🔐
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
          Khôi phục an toàn
        </p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Quên mật khẩu?
        </h1>
        <p className="mt-4 leading-7 text-slate-400">
          Nhập email tài khoản. Vì lý do bảo mật, hệ thống luôn trả cùng một
          thông báo dù email có tồn tại hay không.
        </p>

        {result ? (
          <div className="mt-8">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="font-black text-emerald-200">Yêu cầu đã được ghi nhận</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/70">
                {result.message}
              </p>
            </div>

            {result.resetToken && (
              <div className="mt-4 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                  Chế độ phát triển cục bộ
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-100/70">
                  Máy chủ đang cho phép mở liên kết trực tiếp để kiểm thử. Token
                  này chỉ dùng một lần và hết hạn sau 30 phút.
                </p>
                <Link
                  to={`/reset-password?token=${encodeURIComponent(result.resetToken)}`}
                  className="mt-4 inline-flex rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200"
                >
                  Đặt mật khẩu mới →
                </Link>
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="mt-6"
              onClick={() => setResult(null)}
            >
              Gửi lại yêu cầu
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              id="forgot-email"
              label="Email tài khoản"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

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
              size="large"
              fullWidth
              isLoading={isSubmitting}
            >
              Gửi yêu cầu khôi phục
            </Button>
          </form>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          <span>Token một lần</span>
          <span>Hết hạn 30 phút</span>
          <span>Giới hạn yêu cầu</span>
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
