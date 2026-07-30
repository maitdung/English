import { useState, type FormEvent } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

function ProfilePage() {
  const [fullName, setFullName] = useState("Mai Tiến Dũng");
  const [email, setEmail] = useState("dung@example.com");
  const [phone, setPhone] = useState("0912345678");
  const [dailyGoal, setDailyGoal] = useState("45");
  const [level, setLevel] = useState("B1");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setSavedMessage("");

    window.setTimeout(() => {
      setIsSaving(false);
      setSavedMessage("Thông tin đã được lưu thành công.");
    }, 700);
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
            M
          </div>

          <h2 className="mt-5 text-2xl font-black">{fullName}</h2>

          <p className="mt-2 text-sm text-slate-500">{email}</p>

          <span className="mt-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
            Thành viên Pro
          </span>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-2xl font-black">24</p>
              <p className="mt-1 text-xs text-slate-500">Bài đã học</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-2xl font-black">12</p>
              <p className="mt-1 text-xs text-slate-500">Ngày liên tục</p>
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

            <Input
              id="profile-phone"
              label="Số điện thoại"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

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
                  defaultChecked
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
                  defaultChecked
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
    </div>
  );
}

export default ProfilePage;