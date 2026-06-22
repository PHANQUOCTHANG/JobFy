import { authService, otpService, userService } from "@/config/container";
import { AuthResponseDto } from "./auth.response";
import AppError from "@/utils/appError";
import { getUserId } from "@/helpers/getUserId";
import asyncHandler from "@/utils/asyncHandler";
import { Request, Response } from "express";

/**
 * Cấu hình Cookie chuẩn cho Production
 */
const getCookieOptions = (expiresAt?: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict",
  path: "/",
  ...(expiresAt && { expires: expiresAt }),
});

/**
 * Hàm bổ trợ để gửi Token và User đồng nhất
 */
const sendAuthResponse = (
  res: Response,
  result: any,
  statusCode: number = 200,
) => {

  const expiresAt = result.rememberMe
    ? result.refreshTokenExpiresAt
    : undefined;
  const cookieOptions = getCookieOptions(expiresAt);

  // 1. Refresh Token (Bảo mật cao)
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  // 2. User Info (Dùng cho FE hiển thị nhanh, nếu cần)
  // Lưu ý: Vẫn nên ưu tiên dùng dữ liệu trong Body JSON
  res.cookie("user", JSON.stringify(result.user), {
    ...cookieOptions,
    httpOnly: false, // Để JavaScript FE có thể đọc nếu cần
  });

  return res.status(statusCode).json({
    status: "success",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
};

// POST | /api/auth/register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ status: "success", message: result.message });
});

// POST | /api/auth/verify-account
export const verifyAccount = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await authService.verifyAccount(email, otp);
  sendAuthResponse(res, result, 200);
});

// POST | /api/auth/resend-verification
export const resendVerifyAccountOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await otpService.send(email, "VERIFY_ACCOUNT");
  res.status(204).send();
});

// POST | /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  sendAuthResponse(res, result, 200);
});

// [POST] /auth/google-login
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken, role } = req.body;
  const result = await authService.googleLogin(idToken, role);
  sendAuthResponse(res, result, 200);
});

// POST | /api/auth/refresh
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      status: "error",
      message: "Refresh token missing",
    });
  }

  const result = await authService.refresh(refreshToken);
  sendAuthResponse(res, result, 200);
});

// POST | /api/auth/logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  // Khi clearCookie, các option (path, domain, secure, sameSite) PHẢI KHỚP với lúc tạo
  const clearOptions = getCookieOptions();
  res.clearCookie("refreshToken", clearOptions);
  res.clearCookie("user", { ...clearOptions, httpOnly: false });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

// POST | /api/auth/send-otp
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  await otpService.send(req.body.email);
  res.status(204).send();
});

// POST | /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const result = await otpService.verify(email, otp);
  res.status(200).json({
    status: "success",
    data: {
      verificationToken: result.verificationToken,
    },
  });
});

// GET | /api/auth/me
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const user = await userService.findById(userId);
  if (!user) throw new AppError("Người dùng không tồn tại", 404);
  res.status(200).json({ status: "success", data: AuthResponseDto.fromUser(user) });
});

// POST | /api/auth/reset-password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    res.status(204).send();
  },
);

// POST | /api/auth/change-password | Thay đổi mật khẩu khi đã đăng nhập
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    await authService.changePassword(userId, req.body);
    res.status(204).send();
  },
);

