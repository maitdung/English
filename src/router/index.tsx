import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import CourseDetailPage from "../features/courses/pages/CourseDetailPage";
import CourseLessonPage from "../features/courses/pages/CourseLessonPage";
import CoursesPage from "../features/courses/pages/CoursesPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/home/pages/NotFoundPage";
import FlashcardsPage from "../features/learning-engine/pages/FlashcardsPage";
import LessonPlayerPage from "../features/learning-engine/pages/LessonPlayerPage";
import QuizPage from "../features/learning-engine/pages/QuizPage";
import QuizResultPage from "../features/learning-engine/pages/QuizResultPage";
import LearningPathPage from "../features/learning/pages/LearningPathPage";
import ListeningPage from "../features/listening/pages/ListeningPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SkillsHubPage from "../features/skills/pages/SkillsHubPage";
import ToeicPage from "../features/toeic/pages/ToeicPage";
import VocabularyPage from "../features/vocabulary/pages/VocabularyPage";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";

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
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
            element: <DashboardPage />,
          },
          {
            path: "learning",
            element: <LearningPathPage />,
          },
          {
            path: "skills",
            element: <SkillsHubPage />,
          },
          {
            path: "courses",
            element: <CoursesPage />,
          },
          {
            path: "courses/:courseSlug",
            element: <CourseDetailPage />,
          },
          {
            path: "courses/:courseSlug/lessons/:lessonSlug",
            element: <CourseLessonPage />,
          },
          {
            path: "lessons/:lessonId",
            element: <LessonPlayerPage />,
          },
          {
            path: "flashcards",
            element: <FlashcardsPage />,
          },
          {
            path: "quiz",
            element: <QuizPage />,
          },
          {
            path: "quiz/result",
            element: <QuizResultPage />,
          },
          {
            path: "vocabulary",
            element: <VocabularyPage />,
          },
          {
            path: "listening",
            element: <ListeningPage />,
          },
          {
            path: "toeic",
            element: <ToeicPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "admin",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
