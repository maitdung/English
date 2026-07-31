import { useEffect, useState } from "react";

import Button from "../../../components/ui/Button/Button";
import type { UserRole } from "../../auth/types/auth";
import type { AdminUser } from "../types/admin";

type AdminRoleDialogProps = {
  user: AdminUser;
  isSaving: boolean;
  errorMessage: string;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
};

const roleDetails: Record<
  UserRole,
  {
    label: string;
    description: string;
  }
> = {
  STUDENT: {
    label: "Học viên",
    description: "Truy cập nội dung học tập và theo dõi tiến độ cá nhân.",
  },
  TEACHER: {
    label: "Giảng viên",
    description: "Dành cho tài khoản phụ trách nội dung và hỗ trợ học viên.",
  },
  ADMIN: {
    label: "Quản trị viên",
    description: "Toàn quyền truy cập các chức năng quản trị hệ thống.",
  },
};

function createDisplayName(user: AdminUser): string {
  return (
    [user.lastName, user.firstName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Người dùng"
  );
}

function AdminRoleDialog({
  user,
  isSaving,
  errorMessage,
  onClose,
  onConfirm,
}: AdminRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.role,
  );
  const hasChanged = selectedRole !== user.role;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving, onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Đóng hộp thoại đổi quyền"
        onClick={onClose}
        disabled={isSaving}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-role-dialog-title"
        className="relative z-10 w-full max-w-lg rounded-t-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:rounded-3xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
              Phân quyền tài khoản
            </p>
            <h2
              id="admin-role-dialog-title"
              className="mt-2 text-2xl font-black text-white"
            >
              Đổi quyền người dùng
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

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="font-black text-white">
            {createDisplayName(user)}
          </p>
          <p className="mt-1 truncate text-sm text-slate-400">
            {user.email}
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="admin-user-role"
            className="mb-2 block text-sm font-bold text-slate-200"
          >
            Quyền mới
          </label>
          <select
            id="admin-user-role"
            autoFocus
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(event.target.value as UserRole)
            }
            disabled={isSaving}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 font-bold text-white outline-none transition focus:border-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {(Object.keys(roleDetails) as UserRole[]).map((role) => (
              <option key={role} value={role}>
                {roleDetails[role].label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {roleDetails[selectedRole].description}
          </p>
        </div>

        {selectedRole === "ADMIN" && hasChanged && (
          <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-200">
            Quyền quản trị cho phép tài khoản này quản lý người dùng khác.
            Hãy chỉ cấp quyền cho người bạn tin cậy.
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold leading-6 text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
            type="button"
            onClick={() => onConfirm(selectedRole)}
            disabled={!hasChanged}
            isLoading={isSaving}
            className="w-full sm:w-auto"
          >
            Xác nhận đổi quyền
          </Button>
        </div>
      </section>
    </div>
  );
}

export default AdminRoleDialog;
