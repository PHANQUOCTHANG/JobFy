import { createBrowserRouter } from "react-router-dom";

import { AdminLayout, ClientLayout, RootLayout } from "@/layouts";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import {
  HomePage,
  NotFoundPage,
  SettingsPage,
  UsersManagementPage,
} from "@/pages";
import { GuestRoute } from "@/app/routes/GuestRoute";
import { guestAuthRoutes } from "@/features/auth/routes";
import { ADMIN_PATHS, CLIENT_PATHS } from "@/config/paths";

export const router = createBrowserRouter([
  {
    // 🔥 QUAN TRỌNG: RootLayout bao trùm toàn bộ ứng dụng
    // Nó không có path (pathless route), nhiệm vụ chỉ là chạy logic Init Auth
    element: <RootLayout />,
    children: [
      // ===================================================
      // 1. NHÓM AUTH (Login/Register)
      // ===================================================
      {
        element: <GuestRoute />, // <--- Bọc ở đây
        children: [
          ...guestAuthRoutes, // Login, Register
        ],
      },
      // ===================================================
      // 2. NHÓM CLIENT (USER APP)
      // ===================================================
      {
        path: CLIENT_PATHS.CLIENT,
        element: <ClientLayout />,
        children: [
          { index: true, element: <HomePage /> },

          { path: CLIENT_PATHS.SETTINGS, element: <SettingsPage /> },

          // Protected Routes
          {
            element: <ProtectedRoute />,
            children: [
              // { path: CLIENT_PATHS.PROFILE, element: <ProfilePage /> },
              // {
              //   path: CLIENT_PATHS.CLAIM_PROFILE,
              //   element: <ClaimProfilePage />,
              // },
            ],
          },
        ],
      },

      // ===================================================
      // 3. NHÓM ADMIN PORTAL
      // ===================================================
      {
        path: ADMIN_PATHS.ADMIN,
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: ADMIN_PATHS.USERS,
                element: <UsersManagementPage />,
              },

              {
                path: ADMIN_PATHS.SETTINGS,
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 4. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
