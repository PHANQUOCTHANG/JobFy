import { Router } from "express";
import * as authCtrl from "@/module/auth/auth.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "@/module/auth/auth.request";
import { sendOtpSchema, verifyOtpSchema } from "@/module/auth/otp/otp.request";
import { requireAuth } from "@/middleware/auth.middleware";
import { authRateLimiter, otpRateLimiter } from "@/middleware/rateLimiter.middleware";

const router = Router();

// auth
// POST | /api/auth/register | Đăng ký tài khoản mới
router.post(
  "/register",
  authRateLimiter,
  validationMiddleware(registerSchema),
  authCtrl.register,
);

// POST | /api/auth/login | Đăng nhập
router.post("/login", authRateLimiter, validationMiddleware(loginSchema), authCtrl.login);

// POST | /api/auth/refresh-token | Làm mới access token
router.post("/refresh-token", authCtrl.refresh);

// POST | /api/auth/logout | Đăng xuất
router.post("/logout", authCtrl.logout);

// POST | /api/auth/verify-account | Xác thực tài khoản bằng OTP
router.post(
  "/verify-account",
  authRateLimiter,
  validationMiddleware(verifyOtpSchema),
  authCtrl.verifyAccount,
);

// POST | /api/auth/resend-verification | Gửi lại OTP xác thực tài khoản
router.post(
  "/resend-verification",
  otpRateLimiter,
  validationMiddleware(sendOtpSchema),
  authCtrl.resendVerifyAccountOtp,
);

// POST | /api/auth/forgot-password/send-otp | Gửi OTP
router.post(
  "/forgot-password/send-otp",
  otpRateLimiter,
  validationMiddleware(sendOtpSchema),
  authCtrl.sendOtp,
);

// POST | /api/auth/forgot-password/verify-otp | Xác thực OTP (Quên mật khẩu)
router.post(
  "/forgot-password/verify-otp",
  authRateLimiter,
  validationMiddleware(verifyOtpSchema),
  authCtrl.verifyOtp,
);

// POST | /api/auth/forgot-password/reset-password | Đặt lại mật khẩu (Quên mật khẩu)
router.post(
  "/forgot-password/reset-password",
  authRateLimiter,
  validationMiddleware(resetPasswordSchema),
  authCtrl.resetPassword,
);

// POST | /api/auth/change-password | Thay đổi mật khẩu khi đã đăng nhập
router.post(
  "/change-password",
  requireAuth,
  validationMiddleware(changePasswordSchema),
  authCtrl.changePassword,
);

// GET | /api/auth/me | Lấy thông tin user hiện tại
router.get("/me", requireAuth, authCtrl.getMe);

export default router;
