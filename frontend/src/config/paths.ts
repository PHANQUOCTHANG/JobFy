// src/config/paths.ts

export const AUTH_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgot-password",
  AUTH_GOOGLE: "/auth/google",
  AUTH_FACEBOOK: "/auth/facebook",
  FORCE_CHANGE_PASSWORD: "/force-change-password",
  VERIFY_ACCOUNT: "/verify-account",
} as const;

export const CLIENT_PATHS = {
  CLIENT: "/",
  HOME: "/",
  SEARCH: "search",
  SETTINGS: "settings",
  // User
  PROFILE: "/profile",
  CANDIDATE_DETAIL: (id: string) => `/candidates/${id}`,
  // Companies
  COMPANIES: "companies",
  COMPANY_DETAIL: (slug: string) => `/companies/${slug}`,
  // Jobs
  JOBS: "jobs",
  JOB_DETAIL: (slug: string) => `/jobs/${slug}`,
  // CV
  CV: "cv",
  CV_EDITOR: (id: string) => `cv/editor/${id}`,
  MY_CVS: "cv/my-cvs",
  CV_UPLOAD: "cv/upload",
  COVER_LETTER: "cv/cover-letter",
} as const;

export const CANDIDATE_PATHS = {
  DASHBOARD: "/candidate",
  PROFILE: "profile",
  MY_APPLICATIONS: "applications",
  SAVED_JOBS: "saved-jobs",
  JOB_ALERTS: "job-alerts",
} as const;

export const ADMIN_PATHS = {
  ADMIN: "/admin",
  DASHBOARD: "/",
  USERS: "users",
  CANDIDATES: "candidates",
  COMPANIES: "companies",
  JOBS: "jobs",
  REVIEWS: "reviews",
  ANALYTICS: "analytics",
  SETTINGS: "settings",
} as const;

export const EMPLOYER_PATHS = {
  DASHBOARD: "/employer",
  LOGIN: "login",
  REGISTER: "register",
  COMPANY_PROFILE: "company",
  JOBS: "jobs",
  CREATE_JOB: "jobs/create",
  APPLICATIONS: "applications",
  CANDIDATE_DETAIL: (id: string) => `applications/${id}`,
  TEAM: "team",
  BILLING: "billing",
  SETTINGS: "settings",
} as const;
