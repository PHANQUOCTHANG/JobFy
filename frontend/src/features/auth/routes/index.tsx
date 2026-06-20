import { type RouteObject } from "react-router-dom";
import {
  FacebookCallbackPage,
  ForceChangePasswordPage,
  ForgotPasswordPage,
  GoogleCallbackPage,
  LoginPage,
  LogoutPage,
  RegisterPage,
  VerifyAccountPage,
} from "@/pages";
import { AUTH_PATHS } from "@/config/paths";

// 1. Nhóm dành cho khách (Guest Only) - Đã login thì cấm vào
export const guestAuthRoutes: RouteObject[] = [
  {
    path: AUTH_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: AUTH_PATHS.REGISTER,
    element: <RegisterPage />,
  },

  {
    path: AUTH_PATHS.AUTH_GOOGLE,
    element: <GoogleCallbackPage />,
  },
  {
    path: AUTH_PATHS.AUTH_FACEBOOK,
    element: <FacebookCallbackPage />,
  },
  {
    path: AUTH_PATHS.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: AUTH_PATHS.VERIFY_ACCOUNT,
    element: <VerifyAccountPage />,
  },
];

// 2. Nhóm dành cho người đã login (Protected)
export const protectedAuthRoutes: RouteObject[] = [
  {
    path: AUTH_PATHS.LOGOUT,
    element: <LogoutPage />,
  },
  {
    path: AUTH_PATHS.FORCE_CHANGE_PASSWORD,
    element: <ForceChangePasswordPage />,
  },
];
