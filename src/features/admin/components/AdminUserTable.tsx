import { useState } from "react";

import type { UserRole, UserStatus } from "../../auth/types/auth";
import type { AdminUser } from "../types/admin";

type AdminUserTableProps = {
  users: AdminUser[];
  currentUserId: string;
  onEditRole: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
};

const roleLabels: Record<UserRole, string> = {
  STUDENT: "Học viên",
  TEACHER: "Giảng viên",
  ADMIN: "Quản trị viên",
};

const roleClasses: Record<UserRole, string> = {
  STUDENT: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  TEACHER: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  ADMIN: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
};

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Chưa kích hoạt",
  SUSPENDED: "Đã tạm khóa",
};

const statusClasses: Record<UserStatus, string> = {
  ACTIVE: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  INACTIVE: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  SUSPENDED: "border-red-400/20 bg-red-400/10 text-red-300",
};

function createDisplayName(user: AdminUser): string {
  return (
    [user.lastName, user.firstName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Người dùng"
  );
}

function createInitials(user: AdminUser): string {
  const name = createDisplayName(user);
  const words = name.split(/\s+/).filter(Boolean);

  return (
    [words.at(0)?.[0], words.at(-1)?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "U"
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatLastActivity(value: string | null): string {
  if (!value) {
    return "Chưa đăng nhập";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không xác định";
  }

  const elapsedMilliseconds = Date.now() - date.getTime();
  const elapsedMinutes = Math.max(0, Math.floor(elapsedMilliseconds / 60_000));

  if (elapsedMinutes < 1) {
    return "Vừa xong";
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} phút trước`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours} giờ trước`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays < 30) {
    return `${elapsedDays} ngày trước`;
  }

  return formatDate(value);
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${roleClasses[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status]}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {statusLabels[status]}
    </span>
  );
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [hasImageError, setHasImageError] = useState(false);

  if (user.avatarUrl && !hasImageError) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        onError={() => setHasImageError(true)}
        className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/20 to-violet-400/15 text-sm font-black text-cyan-100"
    >
      {createInitials(user)}
    </span>
  );
}

function EditRoleButton({
  user,
  currentUserId,
  onEditRole,
  onToggleStatus,
  onDeleteUser,
}: {
  user: AdminUser;
  currentUserId: string;
  onEditRole: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}) {
  const isCurrentUser = user.id === currentUserId;

  if (isCurrentUser) {
    return (
      <span className="text-xs font-semibold text-slate-600">
        Tài khoản của bạn
      </span>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={() => onEditRole(user)}
        className="inline-flex min-h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-black text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        Đổi quyền
      </button>
      <button
        type="button"
        onClick={() => onToggleStatus(user)}
        className="inline-flex min-h-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 text-xs font-black text-amber-200 transition hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {user.status === "SUSPENDED" ? "Mở khóa" : "Tạm khóa"}
      </button>
      <button
        type="button"
        onClick={() => onDeleteUser(user)}
        className="inline-flex min-h-9 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10 px-3 text-xs font-black text-red-200 transition hover:bg-red-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        Xóa
      </button>
    </div>
  );
}

function AdminUserTable({
  users,
  currentUserId,
  onEditRole,
  onToggleStatus,
  onDeleteUser,
}: AdminUserTableProps) {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
          >
            <div className="flex items-start gap-3">
              <UserAvatar user={user} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-black text-white">
                    {createDisplayName(user)}
                  </h3>
                  {user.id === currentUserId && (
                    <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                      BẠN
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${
                  user.emailVerified
                    ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
                    : "border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                {user.emailVerified
                  ? "Email đã xác minh"
                  : "Email chưa xác minh"}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4 text-xs">
              <div>
                <dt className="text-slate-600">Hoạt động gần nhất</dt>
                <dd className="mt-1 font-bold text-slate-300">
                  {formatLastActivity(user.lastLoginAt)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-600">Ngày tham gia</dt>
                <dd className="mt-1 font-bold text-slate-300">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex justify-end">
              <EditRoleButton
                user={user}
                currentUserId={currentUserId}
                onEditRole={onEditRole}
                onToggleStatus={onToggleStatus}
                onDeleteUser={onDeleteUser}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              <th className="border-b border-white/10 px-5 py-4">Người dùng</th>
              <th className="border-b border-white/10 px-4 py-4">Quyền</th>
              <th className="border-b border-white/10 px-4 py-4">Trạng thái</th>
              <th className="border-b border-white/10 px-4 py-4">Xác minh</th>
              <th className="border-b border-white/10 px-4 py-4">
                Hoạt động gần nhất
              </th>
              <th className="border-b border-white/10 px-4 py-4">
                Ngày tham gia
              </th>
              <th className="border-b border-white/10 px-5 py-4 text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="group transition hover:bg-white/[0.025]"
              >
                <td className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="max-w-56 truncate font-black text-white">
                          {createDisplayName(user)}
                        </p>
                        {user.id === currentUserId && (
                          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                            BẠN
                          </span>
                        )}
                      </div>
                      <p className="mt-1 max-w-64 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-white/[0.06] px-4 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="border-b border-white/[0.06] px-4 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="border-b border-white/[0.06] px-4 py-4">
                  <span
                    className={`text-xs font-bold ${
                      user.emailVerified ? "text-sky-300" : "text-slate-600"
                    }`}
                  >
                    {user.emailVerified ? "✓ Đã xác minh" : "Chưa xác minh"}
                  </span>
                </td>
                <td className="border-b border-white/[0.06] px-4 py-4 text-sm font-semibold text-slate-300">
                  {formatLastActivity(user.lastLoginAt)}
                </td>
                <td className="border-b border-white/[0.06] px-4 py-4 text-sm text-slate-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="border-b border-white/[0.06] px-5 py-4 text-right">
                  <EditRoleButton
                    user={user}
                    currentUserId={currentUserId}
                    onEditRole={onEditRole}
                    onToggleStatus={onToggleStatus}
                    onDeleteUser={onDeleteUser}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminUserTable;
