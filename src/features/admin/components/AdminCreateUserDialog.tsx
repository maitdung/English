import { useState, type FormEvent } from "react";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import type { UserRole } from "../../auth/types/auth";
import {
  isStrongPassword,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from "../../auth/utils/password";
import type { AdminCreateUserPayload } from "../types/admin";

type AdminCreateUserDialogProps = {
  isSaving: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: (payload: AdminCreateUserPayload) => void;
};

function AdminCreateUserDialog({
  isSaving,
  errorMessage,
  onClose,
  onConfirm,
}: AdminCreateUserDialogProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setLocalError("Vui lòng nhập email.");
      return;
    }

    if (!isStrongPassword(password)) {
      setLocalError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    setLocalError("");
    onConfirm({
      email,
      password,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      role,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Đóng hộp thoại tạo tài khoản"
        onClick={onClose}
        disabled={isSaving}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-create-user-title"
        className="relative z-10 w-full max-w-2xl rounded-t-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              User manager
            </p>
            <h2
              id="admin-create-user-title"
              className="mt-2 text-2xl font-black text-white"
            >
              Tạo tài khoản mới
            </h2>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <Input
              id="admin-create-email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              required
            />
          </div>

          <Input
            id="admin-create-last-name"
            label="Họ"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Nguyen"
          />

          <Input
            id="admin-create-first-name"
            label="Tên"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Minh"
          />

          <div className="sm:col-span-2">
            <Input
              id="admin-create-password"
              label="Mật khẩu tạm thời"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="StrongPassword123!"
              helperText="Gồm chữ hoa, chữ thường, số, ký tự đặc biệt; dài 8–72 ký tự."
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="admin-create-role"
              className="mb-2 block text-sm font-bold text-slate-200"
            >
              Quyền
            </label>
            <select
              id="admin-create-role"
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 font-bold text-white outline-none transition focus:border-cyan-400/60"
            >
              <option value="STUDENT">Học viên</option>
              <option value="TEACHER">Giảng viên</option>
              <option value="ADMIN">Quản trị viên</option>
            </select>
          </div>

          {(localError || errorMessage) && (
            <p
              role="alert"
              className="sm:col-span-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold leading-6 text-red-300"
            >
              {localError || errorMessage}
            </p>
          )}

          <div className="sm:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              className="w-full sm:w-auto"
            >
              Tạo tài khoản
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdminCreateUserDialog;
