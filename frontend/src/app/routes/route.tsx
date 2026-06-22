import { createBrowserRouter } from "react-router-dom";

import {
  ClientLayout,
  RootLayout,
  EmployerLayout,
  CandidateLayout,
  AdminLayout,
} from "@/layouts";

import ProtectedRoute from "@/app/routes/ProtectedRoute";
import AdminRoute from "@/app/routes/AdminRoute";
import {
  HomePage,
  NotFoundPage,
  SettingsPage,
  CompanyListPage,
  CompanyDetailPage,
  ProfileSettingsPage,
  SecuritySettingsPage,
  CandidatePublicPage,
  JobSearchPage,
  JobDetailPage,
  MyApplicationsPage,
  EmployerDashboardPage,
  ManageCompanyPage,
  ManageJobsPage,
  CreateJobPage,
  EmployerCandidatePage,
  CandidateDetailPage,
  EmployerSettingsPage,
  CandidateDashboardPage,
  SavedJobsPage,
  JobAlertsPage,
  CvTemplatesPage,
  CvEditorPage,
  MyCvsPage,
  CoverLetterPage,
  AiCvBuilderPage,
  EmployerLandingPage,
  EmployerLoginPage,
  EmployerRegisterPage,
  // Admin pages
  AdminCandidatesPage,
  AdminReviewsPage,
  MyCoverLettersPage,
  AdminDashboardPage,
  AdminCompaniesPage,
  AdminJobsPage,
  AdminReportsPage,
  AdminLoginPage,
  AdminIndustriesPage,
  AdminCategoriesPage,
  AdminSkillsPage,
} from "@/pages";

import { GuestRoute } from "@/app/routes/GuestRoute";
import { guestAuthRoutes, protectedAuthRoutes } from "@/features/auth/routes";
import { EMPLOYER_PATHS, CLIENT_PATHS, CANDIDATE_PATHS, ADMIN_PATHS } from "@/config/paths";
import EmployerForgotPasswordPage from "@/pages/employer/EmployerForgotPasswordPage";
import EmployerVerifyOtpPage from "@/pages/employer/EmployerVerifyOtpPage";
import EmployerResetPasswordPage from "@/pages/employer/EmployerResetPasswordPage";

export const router = createBrowserRouter([
  {
    // QUAN TRỌNG: RootLayout bao trùm toàn bộ ứng dụng
    // Nó không có path (pathless route), nhiệm vụ chỉ là chạy logic Init Auth
    element: <RootLayout />,
    children: [
      // 1. NHÓM AUTH (Login/Register)
      {
        element: <GuestRoute />, // <--- Bọc ở đây
        children: [
          ...guestAuthRoutes, // Login, Register
          { path: "/employer/register", element: <EmployerRegisterPage /> },
          { path: "/employer/login", element: <EmployerLoginPage /> },
          { path: "/employer/forgot-password", element: <EmployerForgotPasswordPage /> },
          { path: "/employer/verify-otp", element: <EmployerVerifyOtpPage /> },
          { path: "/employer/reset-password", element: <EmployerResetPasswordPage /> },
        ],
      },
      // 1.5. NHÓM AUTH (Protected - Đã login)
      {
        element: <ProtectedRoute />,
        children: [
          ...protectedAuthRoutes, // Logout, ForceChangePassword
        ],
      },
      // 2. NHÓM CLIENT (USER APP)
      {
        path: CLIENT_PATHS.EMPLOYERS,
        element: <EmployerLandingPage />,
      },
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
          { path: "/cv/cover-letter", element: <CoverLetterPage /> },
          {
            element: <ProtectedRoute requiredRole="candidate" />,
            children: [
              { path: "/cv/ai-builder", element: <AiCvBuilderPage /> },
              { path: "/cv/my-cvs", element: <MyCvsPage /> },
              { path: "/my-cover-letters", element: <MyCoverLettersPage /> },
              {
                path: CLIENT_PATHS.MY_APPLICATIONS,
                element: <MyApplicationsPage />,
              },
              {
                path: CLIENT_PATHS.PROFILE,
                element: <ProfileSettingsPage />,
              },
              {
                path: CLIENT_PATHS.SECURITY_SETTINGS,
                element: <SecuritySettingsPage />,
              },
              {
                path: "/saved-jobs",
                element: <SavedJobsPage />,
              },
            ]
          },
        ],
      },

      // 3. NHÓM CANDIDATE PORTAL
      {
        path: CANDIDATE_PATHS.DASHBOARD,
        element: <ProtectedRoute requiredRole="candidate" />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              {
                index: true,
                element: <CandidateDashboardPage />,
              },
              {
                path: CANDIDATE_PATHS.JOB_ALERTS,
                element: <JobAlertsPage />,
              },
            ],
          },
        ],
      },

      // 4. NHÓM EMPLOYER PORTAL
      {
        path: EMPLOYER_PATHS.DASHBOARD,
        element: <ProtectedRoute requiredRole="employer" />,
        children: [
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
                element: <EmployerCandidatePage />,
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

      // 5. NHÓM ADMIN PORTAL
      // ===================================================

      // 5a. Trang Login Admin — công khai, không cần auth
      {
        path: "/admin/login",
        element: <AdminLoginPage />,
      },

      // 5b. Admin Dashboard — bảo vệ bởi AdminRoute
      {
        path: ADMIN_PATHS.ADMIN,
        element: <AdminRoute />,   // ← guard: chưa đăng nhập → /admin/login, không phải admin → 403
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              // { path: ADMIN_PATHS.USERS, element: <UsersManagementPage /> },
              { path: ADMIN_PATHS.COMPANIES, element: <AdminCompaniesPage /> },
              { path: ADMIN_PATHS.CANDIDATES, element: <AdminCandidatesPage /> },
              { path: ADMIN_PATHS.JOBS, element: <AdminJobsPage /> },
              { path: ADMIN_PATHS.REPORTS, element: <AdminReportsPage /> },
              { path: ADMIN_PATHS.REVIEWS, element: <AdminReviewsPage /> },
              { path: "industries", element: <AdminIndustriesPage /> },
              { path: "categories", element: <AdminCategoriesPage /> },
              { path: "skills", element: <AdminSkillsPage /> },
            ],
          },
        ],
      },

      // ===================================================
      // 6. 404 NOT FOUND
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
