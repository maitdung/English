import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import { useAuth } from "../../auth/context/AuthContext";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "../../auth/utils/password";

const PREFERENCES_KEY = "mtd-lingo-profile-preferences";

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profilePassword, setProfilePassword] = useState("");
  const [dailyGoal, setDailyGoal] = useState("45");
  const [level, setLevel] = useState("B1");
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSecurityPasswords, setShowSecurityPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const preferencesKey = user
    ? `${PREFERENCES_KEY}:${user.id}`
    : PREFERENCES_KEY;

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }

    try {
      const preferences = JSON.parse(
        window.localStorage.getItem(preferencesKey) ?? "{}",
      ) as Record<string, unknown>;

      if (typeof preferences.dailyGoal === "string") {
        setDailyGoal(preferences.dailyGoal);
      }
      if (typeof preferences.level === "string") {
        setLevel(preferences.level);
      }
      if (typeof preferences.dailyReminder === "boolean") {
        setDailyReminder(preferences.dailyReminder);
      }
      if (typeof preferences.weeklyReport === "boolean") {
        setWeeklyReport(preferences.weeklyReport);
      }
    } catch {
      window.localStorage.removeItem(preferencesKey);
    }
  }, [preferencesKey, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setSavedMessage("");
    setErrorMessage("");

    try {
      const isChangingEmail =
        email.trim().toLowerCase() !== user?.email.toLowerCase();

      if (isChangingEmail && !profilePassword) {
        setErrorMessage(
          "Nhập mật khẩu hiện tại để xác nhận thay đổi địa chỉ email.",
        );
        setIsSaving(false);
        return;
      }

      await updateProfile({
        fullName,
        email,
        currentPassword: isChangingEmail
          ? profilePassword
          : undefined,
      });
      window.localStorage.setItem(
        preferencesKey,
        JSON.stringify({
          dailyGoal,
          level,
          dailyReminder,
          weeklyReport,
        }),
      );
      window.dispatchEvent(new Event("mtd-lingo-preferences-updated"));
      setProfilePassword("");
      setSavedMessage("Thông tin đã được lưu thành công.");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Không thể lưu thông tin. Vui lòng thử lại.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordError("");

    if (!isStrongPassword(newPassword)) {
      setPasswordError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu hiện tại.");
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword({
        currentPassword,
        newPassword,
      });
      navigate("/login?passwordChanged=1", { replace: true });
    } catch (error) {
      setPasswordError(
        error instanceof ApiError
          ? error.message
          : "Không thể đổi mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1300px] px-5 py-7 sm:px-8 sm:py-9">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
          Hồ sơ cá nhân
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          Quản lý tài khoản của bạn
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Cập nhật thông tin cá nhân, mục tiêu học tập và các tùy chọn tài khoản.
        </p>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <aside className="h-fit rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-violet-500/10 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-cyan-400 text-4xl font-black text-slate-950">
            {(fullName.trim()[0] || "H").toUpperCase()}
          </div>

          <h2 className="mt-5 text-2xl font-black">{fullName}</h2>

          <p className="mt-2 text-sm text-slate-500">{email}</p>

          <span className="mt-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
            Thành viên Pro
          </span>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-lg font-black">
                {user?.role === "ADMIN"
                  ? "Quản trị"
                  : user?.role === "TEACHER"
                    ? "Giảng viên"
                    : "Học viên"}
              </p>
              <p className="mt-1 text-xs text-slate-500">Vai trò</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-2xl font-black">{level}</p>
              <p className="mt-1 text-xs text-slate-500">Trình độ</p>
            </div>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7"
        >
          <div>
            <h2 className="text-xl font-black">Thông tin cá nhân</h2>

            <p className="mt-1 text-sm text-slate-500">
              Thông tin được sử dụng trong hồ sơ học tập.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <Input
              id="profile-full-name"
              label="Họ và tên"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />

            <Input
              id="profile-email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {email.trim().toLowerCase() !==
              user?.email.toLowerCase() && (
              <div className="md:col-span-2">
                <Input
                  id="profile-current-password"
                  label="Mật khẩu hiện tại để đổi email"
                  type="password"
                  value={profilePassword}
                  onChange={(event) =>
                    setProfilePassword(event.target.value)
                  }
                  autoComplete="current-password"
                  helperText="Email mới sẽ được đánh dấu chưa xác minh cho tới khi hoàn tất bước xác nhận."
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="profile-level"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Trình độ hiện tại
              </label>

              <select
                id="profile-level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white outline-none transition focus:border-cyan-400/60"
              >
                <option value="A1">A1 - Cơ bản</option>
                <option value="A2">A2 - Sơ cấp</option>
                <option value="B1">B1 - Trung cấp</option>
                <option value="B2">B2 - Trung cao cấp</option>
                <option value="C1">C1 - Nâng cao</option>
                <option value="C2">C2 - Thành thạo</option>
              </select>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-7">
            <h2 className="text-xl font-black">Mục tiêu học tập</h2>

            <p className="mt-1 text-sm text-slate-500">
              Thiết lập thời lượng học mỗi ngày.
            </p>

            <div className="mt-5 max-w-md">
              <Input
                id="daily-goal"
                label="Số phút học mỗi ngày"
                type="number"
                min={10}
                max={180}
                value={dailyGoal}
                onChange={(event) => setDailyGoal(event.target.value)}
                helperText="Nên đặt mục tiêu từ 30 đến 60 phút mỗi ngày."
              />
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-7">
            <h2 className="text-xl font-black">Thông báo</h2>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div>
                  <p className="font-bold">Nhắc nhở học hằng ngày</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Nhận lời nhắc khi chưa hoàn thành mục tiêu.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(event) =>
                    setDailyReminder(event.target.checked)
                  }
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div>
                  <p className="font-bold">Báo cáo tiến độ tuần</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Nhận tổng kết hoạt động học vào cuối tuần.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={weeklyReport}
                  onChange={(event) =>
                    setWeeklyReport(event.target.checked)
                  }
                  className="h-5 w-5 accent-cyan-400"
                />
              </label>
            </div>
          </div>

          {savedMessage && (
            <p className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              {savedMessage}
            </p>
          )}

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">
              {errorMessage}
            </p>
          )}

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              size="large"
              isLoading={isSaving}
              className="w-full sm:w-auto"
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <article className="h-fit rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-cyan-500/10 p-6 sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-2xl">
            🛡️
          </div>
          <h2 className="mt-5 text-2xl font-black">Trung tâm bảo mật</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Đổi mật khẩu sẽ thu hồi mọi refresh token đang tồn tại và yêu cầu
            đăng nhập lại trên thiết bị này.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>✓ Xác nhận bằng mật khẩu hiện tại</p>
            <p>✓ Băm mật khẩu bằng bcrypt</p>
            <p>✓ Thu hồi phiên dài hạn sau khi đổi</p>
          </div>
        </article>

        <form
          onSubmit={handleChangePassword}
          className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-black">Đổi mật khẩu</h2>
              <p className="mt-1 text-sm text-slate-500">
                Nên dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự
                đặc biệt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSecurityPasswords((value) => !value)}
              className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-cyan-300"
            >
              {showSecurityPasswords ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            </button>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                id="change-current-password"
                label="Mật khẩu hiện tại"
                type={showSecurityPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
                maxLength={72}
                required
              />
            </div>
            <Input
              id="change-new-password"
              label="Mật khẩu mới"
              type={showSecurityPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
            <Input
              id="change-confirm-password"
              label="Xác nhận mật khẩu mới"
              type={showSecurityPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          {passwordError && (
            <p
              role="alert"
              className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300"
            >
              {passwordError}
            </p>
          )}

          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              variant="danger"
              size="large"
              isLoading={isChangingPassword}
              className="w-full sm:w-auto"
            >
              Đổi mật khẩu và đăng xuất
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
