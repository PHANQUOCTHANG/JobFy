import { lazy } from "react";
export const RootLayout = lazy(() => import("./root/RootLayout"));
export const ClientLayout = lazy(() => import("./client/ClientLayout"));
export const AdminLayout = lazy(() => import("./admin/AdminLayout"));
export const EmployerLayout = lazy(() => import("./employer/EmployerLayout"));
export const CandidateLayout = lazy(() => import("./candidate/CandidateLayout"));
