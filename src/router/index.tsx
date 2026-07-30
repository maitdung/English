import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import HomePage from "../features/home/pages/HomePage";
import NotFoundPage from "../features/home/pages/NotFoundPage";
import LearningPathPage from "../features/learning/pages/LearningPathPage";
import ListeningPage from "../features/listening/pages/ListeningPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
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
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;