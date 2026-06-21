import { lazy } from "react";

export const UsersManagementPage = lazy(() => import("./UsersManagementPage"));
export const AdminDashboardPage   = lazy(() => import("./AdminDashboardPage"));
export const AdminCompaniesPage   = lazy(() => import("./AdminCompaniesPage"));
export const AdminJobsPage        = lazy(() => import("./AdminJobsPage"));
export const AdminReportsPage     = lazy(() => import("./AdminReportsPage"));
export const AdminLoginPage       = lazy(() => import("./AdminLoginPage"));

export const AdminIndustriesPage  = lazy(() => import("./AdminIndustriesPage"));
export const AdminCategoriesPage  = lazy(() => import("./AdminCategoriesPage"));
export const AdminSkillsPage      = lazy(() => import("./AdminSkillsPage"));
