import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../features/auth/context/AuthContext";

const navigationItems = [
  {
    label: "Tổng quan",
    path: "/dashboard",
    icon: "🏠",
    end: true,
  },
  {
    label: "Lộ trình học",
    path: "/dashboard/learning",
    icon: "🗺️",
  },
  {
    label: "Phòng luyện kỹ năng",
    path: "/dashboard/skills",
    icon: "✨",
  },
  {
    label: "Khóa học",
    path: "/dashboard/courses",
    icon: "🎓",
  },
  {
    label: "Từ vựng",
    path: "/dashboard/vocabulary",
    icon: "📖",
  },
  {
    label: "Flashcard",
    path: "/dashboard/flashcards",
    icon: "🃏",
  },
  {
    label: "Luyện nghe",
    path: "/dashboard/listening",
    icon: "🎧",
  },
  {
    label: "Quiz",
    path: "/dashboard/quiz",
    icon: "✅",
  },
  {
    label: "Luyện thi TOEIC",
    path: "/dashboard/toeic",
    icon: "🏆",
  },
  {
    label: "Hồ sơ cá nhân",
    path: "/dashboard/profile",
    icon: "👤",
  },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dailyGoal, setDailyGoal] = useState("45");

  const visibleNavigationItems =
    user?.role === "ADMIN"
      ? [
          ...navigationItems,
          {
            label: "Quản trị hệ thống",
            path: "/dashboard/admin",
            icon: "⚙️",
          },
        ]
      : navigationItems;

  useEffect(() => {
    const readDailyGoal = () => {
      if (!user) {
        return;
      }

      try {
        const storedPreferences = JSON.parse(
          window.localStorage.getItem(
            `mtd-lingo-profile-preferences:${user.id}`,
          ) ?? "{}",
        ) as { dailyGoal?: unknown };

        if (typeof storedPreferences.dailyGoal === "string") {
          setDailyGoal(storedPreferences.dailyGoal);
        }
      } catch {
        setDailyGoal("45");
      }
    };

    readDailyGoal();
    window.addEventListener(
      "mtd-lingo-preferences-updated",
      readDailyGoal,
    );

    return () =>
      window.removeEventListener(
        "mtd-lingo-preferences-updated",
        readDailyGoal,
      );
  }, [user]);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
  await logout();

  navigate("/login", {
    replace: true,
  });
};

  const userInitial =
    user?.fullName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className="text-xl font-black"
          >
            MTD <span className="text-cyan-400">Lingo Pro</span>
          </NavLink>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Đóng thanh điều hướng"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleNavigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center"
              >
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-300">
              Mục tiêu hôm nay
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-black">32 phút</p>
              <p className="text-xs font-bold text-slate-400">
                / {dailyGoal} phút
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[71%] rounded-full bg-cyan-400" />
            </div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/90 px-5 backdrop-blur-xl sm:px-8">
          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen((currentValue) => !currentValue)
            }
            aria-label="Mở thanh điều hướng"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl lg:hidden"
          >
            ☰
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">
              Chào mừng trở lại,
            </p>

            <p className="mt-1 font-black">
              {user?.fullName || "Học viên"}
            </p>
          </div>

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() =>
                setShowUserMenu((currentValue) => !currentValue)
              }
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-2 pr-3 transition hover:border-white/20"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">
                {userInitial}
              </span>

              <span className="hidden text-left sm:block">
                <span className="block max-w-40 truncate text-sm font-black">
                  {user?.fullName || "Học viên"}
                </span>

                <span className="block max-w-40 truncate text-xs text-slate-500">
                  {user?.email || ""}
                </span>
              </span>

              <span
                className={`text-xs text-slate-500 transition ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {showUserMenu && (
              <>
                <button
                  type="button"
                  aria-label="Đóng menu tài khoản"
                  onClick={() => setShowUserMenu(false)}
                  className="fixed inset-0 z-30 cursor-default"
                />

                <div className="absolute right-0 top-[calc(100%+12px)] z-40 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl shadow-black/30">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="truncate text-sm font-black">
                      {user?.fullName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  <NavLink
                    to="/dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    👤 Hồ sơ cá nhân
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-400/10"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
