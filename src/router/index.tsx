import { createBrowserRouter } from "react-router-dom";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/home/pages/NotFoundPage";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";

const comingSoonRoutes = [
  "learning",
  "vocabulary",
  "listening",
  "toeic",
  "profile",
];

function ComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
          🚧
        </div>

        <h1 className="mt-6 text-3xl font-black">Tính năng đang phát triển</h1>

        <p className="mt-4 leading-7 text-slate-400">
          Khu vực này đã được kết nối Router và sẽ được hoàn thiện trong các
          bước tiếp theo.
        </p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      ...comingSoonRoutes.map((path) => ({
        path,
        element: <ComingSoonPage />,
      })),
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;