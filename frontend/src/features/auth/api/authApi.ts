import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
  // Import thêm các type mới
  ChangePasswordRequest,
  ClaimProfileRequest,
} from "@/features/auth/types";
import type { UserProfile } from "@/features/user";
import api from "@/lib/axios";
import type { ApiErrorResponse, ApiResponse } from "@/types";

const authApi = {
  // =================================================================
  // 🟢 PUBLIC ROUTES (Không cần Token)
  // =================================================================

  // 1. Đăng nhập
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );
    return res.data;
  },

  // 1b. Đăng nhập bằng Google
  googleLogin: async (idToken: string, role: string): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/google-login",
      { idToken, role }
    );
    return res.data;
  },

  // 2. Đăng ký
  register: async (
    payload: RegisterRequest,
    secret?: string
  ): Promise<ApiResponse<RegisterResponse>> => {
    const res = await api.post<ApiResponse<RegisterResponse>>(
      `/auth/register${secret ? `/admin/${secret}` : ""}`,
      payload
    );
    return res.data;
  },

  // 3. Xác thực tài khoản (Account Verification)
  verifyAccount: async (
    email: string,
    otp: string
  ): Promise<ApiResponse<LoginResponse>> => {
    const res = await api.post<ApiResponse<LoginResponse>>(
      "/auth/verify-account",
      { email, otp }
    );
    return res.data;
  },

  // 4. Gửi lại OTP Xác thực tài khoản
  resendVerifyAccountOtp: async (email: string): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      "/auth/resend-verification",
      { email }
    );
    return res.data;
  },

  // 5. Làm mới Access Token
  refreshAuth: async (): Promise<ApiResponse<RefreshResponse>> => {
    const res = await api.post<ApiResponse<RefreshResponse>>(
      "/auth/refresh-token"
    );

    return res.data;
  },

  // 6. Quên mật khẩu - Bước 1: Gửi OTP
  sendForgotOtp: async (email: string): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      "/auth/forgot-password/send-otp",
      { email }
    );
    return res.data;
  },

  // 7. Quên mật khẩu - Bước 2: Xác thực OTP
  verifyForgotOtp: async (
    email: string,
    otp: string
  ): Promise<ApiResponse<{ verificationToken: string }>> => {
    const res = await api.post<ApiResponse<{ verificationToken: string }>>(
      "/auth/forgot-password/verify-otp",
      { email, otp }
    );
    return res.data;
  },

  // 8. Quên mật khẩu - Bước 3: Đặt lại mật khẩu
  resetPassword: async (
    verificationToken: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      "/auth/forgot-password/reset-password",
      { verificationToken, newPassword }
    );
    return res.data;
  },

  // =================================================================
  // 🔒 PROTECTED ROUTES (Cần Token)
  // =================================================================

  // 9. Lấy thông tin bản thân (Me)
  getMe: async (token?: string) => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const res = await api.get<ApiResponse<UserProfile>>("/auth/me", config);
    return res.data;
  },

  // 10. Đổi mật khẩu (Dùng cho cả Force Change Password)
  changePassword: async (
    payload: ChangePasswordRequest
  ): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      "/auth/change-password",
      payload
    );
    return res.data;
  },

  // 11. Claim Profile (Dành cho tài khoản Shadow/Artist ảo)
  claimProfile: async (
    payload: ClaimProfileRequest
  ): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      "/users/claim-profile",
      payload
    );
    return res.data;
  },

  // 12. Đăng xuất
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (err: unknown) {
      const error = err as ApiErrorResponse;

      console.warn(error.response?.data?.message);
    }
  },
};

export default authApi;
