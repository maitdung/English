import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import { resetPasswordRequest } from "../../../lib/api/auth-api";
import {
  getPasswordStrength,
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "../utils/password";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const strength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!isStrongPassword(password)) {
      setErrorMessage(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordRequest(token, password);
      setIsComplete(true);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 text-white">
      <div className="pointer-events-none absolute left-[15%] top-[10%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[5%] right-[10%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <section className="auth-card relative w-full max-w-xl rounded-[36px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-10">
        {isComplete ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-4xl">
              ✓
            </div>
            <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              Hoàn tất bảo mật
            </p>
            <h1 className="mt-3 text-3xl font-black">Mật khẩu đã được đổi</h1>
            <p className="mt-4 leading-7 text-slate-400">
              Tất cả refresh token cũ đã bị thu hồi. Hãy đăng nhập lại bằng mật
              khẩu mới.
            </p>
            <Link
              to="/login?passwordChanged=1"
              className="mt-8 inline-flex rounded-2xl bg-cyan-300 px-7 py-4 font-black text-slate-950 transition hover:bg-cyan-200"
            >
              Đăng nhập an toàn →
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-bold text-slate-400 transition hover:text-cyan-300"
            >
              ← Quay lại đăng nhập
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Mật khẩu mới
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Bảo vệ lại tài khoản
            </h1>
            <p className="mt-4 leading-7 text-slate-400">
              Tạo mật khẩu riêng biệt, khó đoán và không dùng lại ở dịch vụ
              khác.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                id="reset-token"
                label="Mã khôi phục"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Dán mã khôi phục vào đây"
                autoComplete="off"
                minLength={32}
                required
              />

              <Input
                id="reset-password"
                label="Mật khẩu mới"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-xs font-black text-cyan-300"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                }
              />

              <div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((item) => (
                    <span
                      key={item}
                      className={`h-1.5 rounded-full transition ${
                        item <= strength
                          ? strength >= 4
                            ? "bg-emerald-400"
                            : strength >= 3
                              ? "bg-cyan-400"
                              : "bg-amber-400"
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Nên có chữ hoa, chữ thường, số và ký tự đặc biệt.
                </p>
              </div>

              <Input
                id="reset-confirm-password"
                label="Xác nhận mật khẩu mới"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
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
                Xác nhận mật khẩu mới
              </Button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default ResetPasswordPage;
