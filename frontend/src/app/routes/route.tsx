import { createBrowserRouter } from "react-router-dom";

import {
  AdminLayout,
  ClientLayout,
  RootLayout,
  EmployerLayout,
  CandidateLayout,
} from "@/layouts";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import {
  HomePage,
  NotFoundPage,
  SettingsPage,
  UsersManagementPage,
  CompanyListPage,
  CompanyDetailPage,
  CandidateProfilePage,
  CandidatePublicPage,
  JobSearchPage,
  JobDetailPage,
  MyApplicationsPage,
  EmployerDashboardPage,
  ManageCompanyPage,
  ManageJobsPage,
  CreateJobPage,
  ManageApplicationsPage,
  CandidateDetailPage,
  EmployerSettingsPage,
  CandidateDashboardPage,
  SavedJobsPage,
  JobAlertsPage,
  CvTemplatesPage,
  CvEditorPage,
  MyCvsPage,
  CoverLetterPage,
} from "@/pages";
import { GuestRoute } from "@/app/routes/GuestRoute";
import { guestAuthRoutes } from "@/features/auth/routes";
import { EMPLOYER_PATHS, CLIENT_PATHS, CANDIDATE_PATHS } from "@/config/paths";

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

          { path: CLIENT_PATHS.COMPANIES, element: <CompanyListPage /> },
          {
            path: CLIENT_PATHS.COMPANY_DETAIL(":slug"),
            element: <CompanyDetailPage />,
          },

          { path: CLIENT_PATHS.JOBS, element: <JobSearchPage /> },
          {
            path: CLIENT_PATHS.JOB_DETAIL(":slug"),
            element: <JobDetailPage />,
          },

          {
            path: CLIENT_PATHS.CANDIDATE_DETAIL(":id"),
            element: <CandidatePublicPage />,
          },
          { path: CLIENT_PATHS.CV, element: <CvTemplatesPage /> },
          { path: "/cv/editor/:templateId", element: <CvEditorPage /> },
          { path: "/cv/my-cvs", element: <MyCvsPage /> },
          { path: "/cv/cover-letter", element: <CoverLetterPage /> },
        ],
      },

      // ===================================================
      // 3. NHÓM CANDIDATE PORTAL
      // ===================================================
      {
        path: CANDIDATE_PATHS.DASHBOARD,
        // element: <ProtectedRoute />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              {
                index: true,
                element: <CandidateDashboardPage />,
              },
              {
                path: CANDIDATE_PATHS.PROFILE,
                element: <CandidateProfilePage />,
              },
              {
                path: CANDIDATE_PATHS.MY_APPLICATIONS,
                element: <MyApplicationsPage />,
              },
              {
                path: CANDIDATE_PATHS.SAVED_JOBS,
                element: <SavedJobsPage />,
              },
              {
                path: CANDIDATE_PATHS.JOB_ALERTS,
                element: <JobAlertsPage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 4. NHÓM EMPLOYER PORTAL
      // ===================================================
      {
        path: EMPLOYER_PATHS.DASHBOARD,
        children: [
          {
            path: EMPLOYER_PATHS.REGISTER,
            element: <EmployerRegisterPage />
          },
          {
            path: EMPLOYER_PATHS.LOGIN,
            element: <EmployerLoginPage />
          },
          {
            // element: <ProtectedRoute />,
            element: <EmployerLayout />,
            children: [
              {
                index: true,
                element: <EmployerDashboardPage />,
              },
              {
                path: EMPLOYER_PATHS.COMPANY_PROFILE,
                element: <ManageCompanyPage />,
              },
              {
                path: EMPLOYER_PATHS.JOBS,
                element: <ManageJobsPage />,
              },
              {
                path: EMPLOYER_PATHS.CREATE_JOB,
                element: <CreateJobPage />,
              },
              {
                path: EMPLOYER_PATHS.APPLICATIONS,
                element: <ManageApplicationsPage />,
              },
              {
                path: EMPLOYER_PATHS.CANDIDATE_DETAIL(":id"),
                element: <CandidateDetailPage />,
              },
              {
                path: EMPLOYER_PATHS.SETTINGS,
                element: <EmployerSettingsPage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 5. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
