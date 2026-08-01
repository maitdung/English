import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../features/auth/context/AuthContext";

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="animate-gradient flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition group-hover:rotate-3 group-hover:scale-105">
              M
            </div>

            <div className="hidden sm:block">
              <p className="text-lg font-black leading-none">MTD Lingo Pro</p>
              <p className="mt-1 text-xs text-slate-400">
                Learn • Practice • Master
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <Link className="transition hover:text-cyan-400" to="/">
              Trang chủ
            </Link>

            <a className="transition hover:text-cyan-400" href="#skills">
              Kỹ năng
            </a>

            <a className="transition hover:text-cyan-400" href="#roadmap">
              Lộ trình
            </a>

            <a className="transition hover:text-cyan-400" href="#about">
              Giới thiệu
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="premium-button rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
              >
                Vào lớp học →
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="premium-button rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
                >
                  <span className="sm:hidden">Học ngay</span>
                  <span className="hidden sm:inline">Học miễn phí</span>
                </Link>
              </>
            )}
            <button
              type="button"
              aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-slate-300 md:hidden"
            >
              {isMenuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-white/10 bg-slate-950/95 px-5 py-4 shadow-2xl md:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {[
                ["Trang chủ", "/"],
                ["Thử bài tập", "/#practice-demo"],
                ["Kỹ năng", "/#skills"],
                ["Lộ trình", "/#roadmap"],
              ].map(([label, href]) =>
                href === "/" ? (
                  <Link
                    key={label}
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    {label}
                  </a>
                ),
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-black text-cyan-300"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer
        id="about"
        className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-lg font-black">MTD Lingo Pro</p>

            <p className="mt-2 text-sm text-slate-400">
              Nền tảng tự học tiếng Anh toàn diện dành cho người Việt.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 MTD Lingo. Built with React & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
