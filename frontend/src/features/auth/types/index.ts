import { IUser } from "@/features/user";

export type RoleType = "admin" | "employer" | "candidate";

// Dữ liệu trả về từ backend (Không còn refreshToken vì nó nằm trong httpOnly cookie)
export interface AuthDto<TUser> {
  accessToken: string;
  user: TUser;
}

// Redux slice state
export interface AuthState<TUser = IUser> {
  token: string | null;
  user: TUser | null;
  isAuthChecking: boolean;
}

// Request/Response dạng API
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
  role?: RoleType;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: RoleType;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ForgetPasswordResponse {
  email: string;
}

export interface VerifyForgotOtpResponse {
  verificationToken: string;
}

export interface ResetPasswordRequest {
  verificationToken: string;
  newPassword: string;
}

// Type cho Đổi mật khẩu
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Type cho Claim Profile (Nhận tài khoản ảo)
export interface ClaimProfileRequest {
  newEmail: string;
  newPassword: string;
}

export type LoginResponse = AuthDto<IUser>;
export type RegisterResponse = { message: string };
export type RefreshResponse = AuthDto<IUser>;
