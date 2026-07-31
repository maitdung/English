import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";
import { ApiError } from "../../../lib/api/api-client";
import {
  getAdminUsersRequest,
  updateAdminUserRoleRequest,
} from "../../../lib/api/admin-users-api";
import type { UserRole } from "../../auth/types/auth";
import { useAuth } from "../../auth/context/AuthContext";
import AdminMetricCard from "../components/AdminMetricCard";
import AdminRoleDialog from "../components/AdminRoleDialog";
import AdminUserTable from "../components/AdminUserTable";
import type {
  AdminRoleFilter,
  AdminStatusFilter,
  AdminUser,
  AdminUserSort,
} from "../types/admin";

const PAGE_SIZE = 8;

const roleOptions: Array<{
  value: AdminRoleFilter;
  label: string;
}> = [
  { value: "ALL", label: "Tất cả quyền" },
  { value: "STUDENT", label: "Học viên" },
  { value: "TEACHER", label: "Giảng viên" },
  { value: "ADMIN", label: "Quản trị viên" },
];

const statusOptions: Array<{
  value: AdminStatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Chưa kích hoạt" },
  { value: "SUSPENDED", label: "Đã tạm khóa" },
];

const sortOptions: Array<{
  value: AdminUserSort;
  label: string;
}> = [
  { value: "NEWEST", label: "Mới tham gia" },
  { value: "LAST_ACTIVE", label: "Hoạt động gần đây" },
  { value: "NAME_ASC", label: "Tên A–Z" },
];

function createDisplayName(user: AdminUser): string {
  return (
    [user.lastName, user.firstName].filter(Boolean).join(" ").trim() ||
    user.email.split("@")[0] ||
    "Người dùng"
  );
}

function parseDate(value: string | null): number {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getAdminErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Không thể tải dữ liệu quản trị. Vui lòng thử lại.";
  }

  if (error.status === 401) {
    return "Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.";
  }

  if (error.status === 403) {
    return "Tài khoản hiện tại không có quyền truy cập dữ liệu quản trị.";
  }

  return error.message;
}

function AdminLoadingState() {
  return (
    <div aria-label="Đang tải dữ liệu quản trị" className="animate-pulse">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-40 rounded-3xl border border-white/[0.06] bg-slate-900/60"
          />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/[0.06] bg-slate-900/60 p-5 sm:p-7">
        <div className="h-14 rounded-2xl bg-white/[0.04]" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-16 rounded-2xl bg-white/[0.035]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  const { user, isLoading: isAuthLoading, refreshCurrentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<AdminUserSort>("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = useState("");

  const isAdmin = user?.role === "ADMIN";

  const runWithSessionRetry = useCallback(
    async <Result,>(request: () => Promise<Result>): Promise<Result> => {
      try {
        return await request();
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) {
          throw error;
        }

        await refreshCurrentUser();

        return request();
      }
    },
    [refreshCurrentUser],
  );

  const loadUsers = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await runWithSessionRetry(getAdminUsersRequest);
      setUsers(response);
      setLastSyncedAt(new Date());
    } catch (error) {
      setErrorMessage(getAdminErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, runWithSessionRetry]);

  useEffect(() => {
    if (!isAuthLoading) {
      void loadUsers();
    }
  }, [isAuthLoading, loadUsers]);

  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(
      (adminUser) => adminUser.status === "ACTIVE",
    ).length;
    const staffUsers = users.filter(
      (adminUser) => adminUser.role === "TEACHER" || adminUser.role === "ADMIN",
    ).length;
    const verifiedUsers = users.filter(
      (adminUser) => adminUser.emailVerified,
    ).length;

    const activePercent =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    const verifiedPercent =
      totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;

    return [
      {
        label: "Tổng tài khoản",
        value: totalUsers.toLocaleString("vi-VN"),
        detail: `${users.filter((item) => item.role === "STUDENT").length} học viên trên hệ thống`,
        icon: "◎",
        tone: "cyan" as const,
      },
      {
        label: "Đang hoạt động",
        value: activeUsers.toLocaleString("vi-VN"),
        detail: `${activePercent}% tổng số tài khoản`,
        icon: "●",
        tone: "emerald" as const,
      },
      {
        label: "Đội ngũ vận hành",
        value: staffUsers.toLocaleString("vi-VN"),
        detail: `${users.filter((item) => item.role === "ADMIN").length} quản trị · ${users.filter((item) => item.role === "TEACHER").length} giảng viên`,
        icon: "◆",
        tone: "violet" as const,
      },
      {
        label: "Email đã xác minh",
        value: `${verifiedPercent}%`,
        detail: `${verifiedUsers}/${totalUsers} tài khoản đã xác minh`,
        icon: "✓",
        tone: "amber" as const,
      },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("vi-VN");

    return users
      .filter((adminUser) => {
        const matchesSearch =
          !normalizedQuery ||
          createDisplayName(adminUser)
            .toLocaleLowerCase("vi-VN")
            .includes(normalizedQuery) ||
          adminUser.email.toLocaleLowerCase("vi-VN").includes(normalizedQuery);
        const matchesRole =
          roleFilter === "ALL" || adminUser.role === roleFilter;
        const matchesStatus =
          statusFilter === "ALL" || adminUser.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((leftUser, rightUser) => {
        switch (sortBy) {
          case "LAST_ACTIVE":
            return (
              parseDate(rightUser.lastLoginAt) - parseDate(leftUser.lastLoginAt)
            );
          case "NAME_ASC":
            return createDisplayName(leftUser).localeCompare(
              createDisplayName(rightUser),
              "vi",
            );
          case "NEWEST":
          default:
            return (
              parseDate(rightUser.createdAt) - parseDate(leftUser.createdAt)
            );
        }
      });
  }, [roleFilter, searchQuery, sortBy, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);
  const pageStart = (visiblePage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(pageStart, pageStart + PAGE_SIZE);
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    roleFilter !== "ALL" ||
    statusFilter !== "ALL";

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setSortBy("NEWEST");
    setCurrentPage(1);
  };

  const handleOpenRoleEditor = (adminUser: AdminUser) => {
    if (adminUser.id === user?.id) {
      return;
    }

    setRoleErrorMessage("");
    setEditingUser(adminUser);
  };

  const handleCloseRoleEditor = useCallback(() => {
    if (isSavingRole) {
      return;
    }

    setRoleErrorMessage("");
    setEditingUser(null);
  }, [isSavingRole]);

  const handleUpdateRole = async (role: UserRole) => {
    if (!editingUser || editingUser.id === user?.id) {
      return;
    }

    setIsSavingRole(true);
    setRoleErrorMessage("");
    setSuccessMessage("");

    try {
      const updatedUser = await runWithSessionRetry(() =>
        updateAdminUserRoleRequest(editingUser.id, role),
      );

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === updatedUser.id ? updatedUser : currentUser,
        ),
      );
      setSuccessMessage(
        `Đã cập nhật quyền của ${createDisplayName(updatedUser)}.`,
      );
      setEditingUser(null);
    } catch (error) {
      setRoleErrorMessage(getAdminErrorMessage(error));
    } finally {
      setIsSavingRole(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
        <AdminLoadingState />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <section className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-7 text-center shadow-2xl shadow-black/20 sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-3xl text-amber-200">
            ⛨
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            Khu vực giới hạn
          </p>
          <h1 className="mt-3 text-3xl font-black text-white">
            Bạn không có quyền truy cập
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
            Trang này chỉ dành cho quản trị viên hệ thống. Nếu bạn cho rằng đây
            là nhầm lẫn, hãy liên hệ người quản trị tài khoản.
          </p>
          <Link
            to="/dashboard"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-6 font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Quay lại tổng quan
          </Link>
        </section>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            Trung tâm quản trị
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Quản lý người dùng
          </h1>
        </section>
        <AdminLoadingState />
      </div>
    );
  }

  if (errorMessage && users.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <section className="w-full max-w-xl rounded-3xl border border-red-400/20 bg-slate-900/70 p-7 text-center sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/10 text-3xl">
            !
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">
            Chưa thể tải dữ liệu
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            {errorMessage}
          </p>
          <Button
            type="button"
            onClick={() => void loadUsers()}
            className="mt-7"
          >
            Thử tải lại
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9">
      <section className="premium-surface relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 via-slate-900/80 to-violet-500/10 p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
                Trung tâm quản trị
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-black text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                DỮ LIỆU TRỰC TIẾP
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Quản lý người dùng
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Theo dõi trạng thái tài khoản, mức độ xác minh và phân quyền cho
              đội ngũ trên toàn hệ thống.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {lastSyncedAt && (
              <p className="text-xs font-semibold text-slate-500">
                Cập nhật lúc{" "}
                {lastSyncedAt.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            <Button
              type="button"
              variant="secondary"
              size="small"
              isLoading={isLoading}
              onClick={() => void loadUsers()}
            >
              ↻ Làm mới dữ liệu
            </Button>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="shrink-0 font-black text-red-200 underline decoration-red-300/40 underline-offset-4"
          >
            Thử lại
          </button>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300"
        >
          <p>✓ {successMessage}</p>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => setSuccessMessage("")}
            className="text-lg text-emerald-200"
          >
            ×
          </button>
        </div>
      )}

      <section
        aria-label="Chỉ số người dùng"
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="premium-surface mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/65 shadow-2xl shadow-black/10">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-white">
                Danh sách tài khoản
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredUsers.length.toLocaleString("vi-VN")} kết quả phù hợp
              </p>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Trạng thái hiện chỉ có thể xem và lọc
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.5fr)_minmax(170px,0.7fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)_auto]">
            <Input
              id="admin-user-search"
              type="search"
              aria-label="Tìm theo tên hoặc email"
              placeholder="Tìm theo tên hoặc email..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              rightElement={
                searchQuery ? (
                  <button
                    type="button"
                    aria-label="Xóa nội dung tìm kiếm"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="rounded-lg px-2 py-1 text-sm font-black text-slate-500 hover:text-white"
                  >
                    ×
                  </button>
                ) : (
                  <span aria-hidden="true" className="text-slate-600">
                    ⌕
                  </span>
                )
              }
            />

            <select
              aria-label="Lọc theo quyền"
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value as AdminRoleFilter);
                setCurrentPage(1);
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-slate-300 outline-none transition focus:border-cyan-400/60"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as AdminStatusFilter);
                setCurrentPage(1);
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-slate-300 outline-none transition focus:border-cyan-400/60"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Sắp xếp danh sách"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as AdminUserSort);
                setCurrentPage(1);
              }}
              className="min-h-12 rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm font-bold text-slate-300 outline-none transition focus:border-cyan-400/60"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="ghost"
              onClick={resetFilters}
              disabled={!hasActiveFilters && sortBy === "NEWEST"}
              className="min-h-12 whitespace-nowrap"
            >
              Đặt lại
            </Button>
          </div>
        </div>

        {paginatedUsers.length > 0 ? (
          <AdminUserTable
            users={paginatedUsers}
            currentUserId={user.id}
            onEditRole={handleOpenRoleEditor}
          />
        ) : (
          <div className="px-5 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-2xl">
              ⌕
            </div>
            <h3 className="mt-5 text-xl font-black text-white">
              {users.length === 0
                ? "Chưa có tài khoản nào"
                : "Không tìm thấy kết quả"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {users.length === 0
                ? "Danh sách sẽ hiển thị khi hệ thống có người dùng."
                : "Hãy thử từ khóa khác hoặc bỏ bớt điều kiện lọc."}
            </p>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={resetFilters}
                className="mt-6"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}

        {filteredUsers.length > 0 && (
          <footer className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs font-semibold text-slate-500">
              Hiển thị {pageStart + 1}–
              {Math.min(pageStart + PAGE_SIZE, filteredUsers.length)} trong{" "}
              {filteredUsers.length} tài khoản
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))}
                disabled={visiblePage === 1}
                className="min-h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-black text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Trước
              </button>
              <span className="min-w-20 text-center text-xs font-bold text-slate-400">
                Trang {visiblePage}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, visiblePage + 1))
                }
                disabled={visiblePage === totalPages}
                className="min-h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-black text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </footer>
        )}
      </section>

      {editingUser && (
        <AdminRoleDialog
          key={editingUser.id}
          user={editingUser}
          isSaving={isSavingRole}
          errorMessage={roleErrorMessage}
          onClose={handleCloseRoleEditor}
          onConfirm={(role) => void handleUpdateRole(role)}
        />
      )}
    </div>
  );
}

export default AdminDashboardPage;
