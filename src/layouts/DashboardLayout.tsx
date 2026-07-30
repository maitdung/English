import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  {
    label: "Tổng quan",
    icon: "🏠",
    to: "/dashboard",
    end: true,
  },
  {
    label: "Lộ trình học",
    icon: "🗺️",
    to: "/dashboard/learning",
  },
  {
    label: "Từ vựng",
    icon: "📚",
    to: "/dashboard/vocabulary",
  },
  {
    label: "Luyện nghe",
    icon: "🎧",
    to: "/dashboard/listening",
  },
  {
    label: "Luyện thi TOEIC",
    icon: "🏆",
    to: "/dashboard/toeic",
  },
];

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">
              M
            </div>

            <div>
              <p className="font-black">MTD Lingo</p>
              <p className="text-xs text-slate-500">Learning Dashboard</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="text-xl text-slate-400 lg:hidden"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            Học tập
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          <p className="mb-3 mt-8 px-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
            Tài khoản
          </p>

          <div className="space-y-1">
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-lg">👤</span>
              Hồ sơ cá nhân
            </NavLink>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
            >
              <span className="text-lg">↪</span>
              Đăng xuất
            </Link>
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="text-sm font-bold text-cyan-300">MTD Lingo Pro</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Mở khóa toàn bộ bài học và đề luyện thi chuyên sâu.
            </p>

            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-cyan-400 px-3 py-2.5 text-sm font-black text-slate-950"
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/85 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl lg:hidden"
            >
              ☰
            </button>

            <div>
              <p className="text-xs text-slate-500">Thứ năm, 30 tháng 7</p>
              <p className="font-bold">Chào buổi tối, MTD 👋</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 font-black text-slate-950">
                M
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold">Mai Tiến Dũng</p>
                <p className="text-xs text-slate-500">Trình độ A2</p>
              </div>
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;