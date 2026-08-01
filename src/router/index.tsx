/* oxlint-disable react/only-export-components -- Route modules intentionally compose lazy page components and export the router. */
import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";

const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/ForgotPasswordPage"),
);
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const ResetPasswordPage = lazy(
  () => import("../features/auth/pages/ResetPasswordPage"),
);
const CourseDetailPage = lazy(
  () => import("../features/courses/pages/CourseDetailPage"),
);
const CourseLessonPage = lazy(
  () => import("../features/courses/pages/CourseLessonPage"),
);
const CoursesPage = lazy(
  () => import("../features/courses/pages/CoursesPage"),
);
const AdminDashboardPage = lazy(
  () => import("../features/admin/pages/AdminDashboardPage"),
);
const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage"),
);
const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const NotFoundPage = lazy(
  () => import("../features/home/pages/NotFoundPage"),
);
const FlashcardsPage = lazy(
  () => import("../features/learning-engine/pages/FlashcardsPage"),
);
const LessonPlayerPage = lazy(
  () => import("../features/learning-engine/pages/LessonPlayerPage"),
);
const QuizPage = lazy(
  () => import("../features/learning-engine/pages/QuizPage"),
);
const QuizResultPage = lazy(
  () => import("../features/learning-engine/pages/QuizResultPage"),
);
const LearningPathPage = lazy(
  () => import("../features/learning/pages/LearningPathPage"),
);
const ListeningPage = lazy(
  () => import("../features/listening/pages/ListeningPage"),
);
const PracticeLibraryPage = lazy(
  () => import("../features/practice/pages/PracticeLibraryPage"),
);
const PracticeSessionPage = lazy(
  () => import("../features/practice/pages/PracticeSessionPage"),
);
const ProfilePage = lazy(
  () => import("../features/profile/pages/ProfilePage"),
);
const SkillsHubPage = lazy(
  () => import("../features/skills/pages/SkillsHubPage"),
);
const ToeicPage = lazy(() => import("../features/toeic/pages/ToeicPage"));
const VocabularyPage = lazy(
  () => import("../features/vocabulary/pages/VocabularyPage"),
);

function RouteLoading() {
  return (
    <div
      className="flex min-h-[55vh] items-center justify-center px-5"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-r-cyan-300" />
        <p className="mt-4 text-sm font-bold text-slate-500">
          Đang mở không gian học…
        </p>
      </div>
    </div>
  );
}

function lazyPage(element: ReactNode) {
  return <Suspense fallback={<RouteLoading />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: lazyPage(<HomePage />),
      },
    ],
  },
  {
    path: "/login",
    element: lazyPage(<LoginPage />),
  },
  {
    path: "/register",
    element: lazyPage(<RegisterPage />),
  },
  {
    path: "/forgot-password",
    element: lazyPage(<ForgotPasswordPage />),
  },
  {
    path: "/reset-password",
    element: lazyPage(<ResetPasswordPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: lazyPage(<DashboardPage />),
          },
          {
            path: "learning",
            element: lazyPage(<LearningPathPage />),
          },
          {
            path: "skills",
            element: lazyPage(<SkillsHubPage />),
          },
          {
            path: "practice",
            element: lazyPage(<PracticeLibraryPage />),
          },
          {
            path: "practice/:setId",
            element: lazyPage(<PracticeSessionPage />),
          },
          {
            path: "courses",
            element: lazyPage(<CoursesPage />),
          },
          {
            path: "courses/:courseSlug",
            element: lazyPage(<CourseDetailPage />),
          },
          {
            path: "courses/:courseSlug/lessons/:lessonSlug",
            element: lazyPage(<CourseLessonPage />),
          },
          {
            path: "lessons/:lessonId",
            element: lazyPage(<LessonPlayerPage />),
          },
          {
            path: "flashcards",
            element: lazyPage(<FlashcardsPage />),
          },
          {
            path: "quiz",
            element: lazyPage(<QuizPage />),
          },
          {
            path: "quiz/result",
            element: lazyPage(<QuizResultPage />),
          },
          {
            path: "vocabulary",
            element: lazyPage(<VocabularyPage />),
          },
          {
            path: "listening",
            element: lazyPage(<ListeningPage />),
          },
          {
            path: "toeic",
            element: lazyPage(<ToeicPage />),
          },
          {
            path: "profile",
            element: lazyPage(<ProfilePage />),
          },
          {
            path: "admin",
            element: lazyPage(<AdminDashboardPage />),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: lazyPage(<NotFoundPage />),
  },
]);

export default router;
