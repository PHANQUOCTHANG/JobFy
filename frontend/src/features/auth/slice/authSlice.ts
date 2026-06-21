import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import authApi from "@/features/auth/api/authApi";
import { UserProfile, EmployerLoginInput as LoginInput, EmployerRegisterInput } from "../types/auth.types";

// =================================================================
// 1. Initial State
// =================================================================
const initialState: any = {
  token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  user: null,
  isLoading: false,
  isAuthChecking: typeof window !== "undefined" && !!localStorage.getItem("accessToken"),
};

// =================================================================
// 2. Async Thunks
// =================================================================

// A. Init Auth (Chạy khi F5 App)
export const initAuth = createAsyncThunk(
  "auth/initAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshAuth();

      const { accessToken, user } = response.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return { accessToken, user };
    } catch (error: unknown) {
      const e: any = error;
      // Normalize axios error shape -> prefer server payload (response.data)
      const payload = e?.response?.data ?? {
        message: e?.message ?? "Session expired",
      };
      // Nếu refresh thất bại, xóa token cũ trong máy
      localStorage.removeItem("accessToken");
      return rejectWithValue(payload);
    }
  },
);

// B. Fetch Current User (Chạy khi update profile xong) - MỚI THÊM
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API lấy thông tin mới nhất của bản thân
      const response = await authApi.getMe();
      return response.data; // Trả về UserProfile mới
    } catch (error: unknown) {
      const e: any = error;
      const payload = e?.response?.data ?? {
        message: e?.message ?? "Failed fetching user",
      };
      return rejectWithValue(payload);
    }
  },
);

// C. Logout User (MỚI THÊM)
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      // Gọi API để Backend xóa HttpOnly Cookie (Refresh Token)
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Triệt để xóa dấu vết tại Client
      localStorage.removeItem("accessToken");
      dispatch(authSlice.actions.logout());
    }
  }
);

export const loginEmployer = createAsyncThunk(
  "auth/loginEmployer",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await authApi.login({ ...data, role: 'employer' });
      const { accessToken, user } = res.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      return { accessToken, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đăng nhập thất bại");
    }
  }
);

export const googleLoginEmployer = createAsyncThunk(
  "auth/googleLoginEmployer",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const res = await authApi.googleLogin(idToken, 'employer');
      const { accessToken, user } = res.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      return { accessToken, user };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đăng nhập bằng Google thất bại");
    }
  }
);

export const registerEmployer = createAsyncThunk(
  "auth/registerEmployer",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await authApi.register({ ...data, role: 'employer' });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đăng ký thất bại");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: LoginInput, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data as any);
      const { accessToken, user } = res.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return { accessToken, user };
    } catch (error: unknown) {
      const e: any = error;
      const payload = e?.response?.data ?? {
        message: e?.message ?? "Login failed",
      };
      return rejectWithValue(payload);
    }
  },
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async ({ idToken, role }: { idToken: string; role: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.googleLogin(idToken, role);
      const { accessToken, user } = res.data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return { accessToken, user };
    } catch (error: unknown) {
      const e: any = error;
      const payload = e?.response?.data ?? {
        message: e?.message ?? "Google Login failed",
      };
      return rejectWithValue(payload);
    }
  },
);

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await authApi.sendForgotOtp(email);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Gửi OTP thất bại");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyForgotOtp(data.email, data.otp);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Xác thực OTP thất bại");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { verificationToken: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const res = await authApi.resetPassword(data.verificationToken, data.newPassword);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
    }
  }
);

// =================================================================
// 3. Slice Logic
// =================================================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; user: UserProfile }>,
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthChecking = false;
    },

    refreshSuccess: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isLoading = false;
      state.isAuthChecking = false;
    },

    authCheckFinished: (state) => {
      state.isAuthChecking = false;
    },
  },

  // =================================================================
  // 4. Extra Reducers (Xử lý Async)
  // =================================================================
  extraReducers: (builder) => {
    // --- Init Auth ---
    builder
      .addCase(initAuth.pending, (state) => {
        state.isAuthChecking = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthChecking = false;
      })
      .addCase(initAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthChecking = false;
        localStorage.removeItem("accessToken");
      });

    // --- Fetch Current User (MỚI THÊM) ---
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      // Chỉ cập nhật thông tin user, giữ nguyên token
      state.user = action.payload;
    });
    // --- Login User ---
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthChecking = false;
    });

    // --- Google Login User ---
    builder.addCase(googleLoginUser.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthChecking = false;
    });

    // --- Register Employer ---
    builder
      .addCase(registerEmployer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerEmployer.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerEmployer.rejected, (state) => {
        state.isLoading = false;
      });

    // --- Login Employer ---
    builder
      .addMatcher(
        (action) => [loginEmployer.pending.type, googleLoginEmployer.pending.type].includes(action.type),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) => [loginEmployer.fulfilled.type, googleLoginEmployer.fulfilled.type].includes(action.type),
        (state, action: any) => {
          state.isLoading = false;
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
          state.isAuthChecking = false;
        }
      )
      .addMatcher(
        (action) => [loginEmployer.rejected.type, googleLoginEmployer.rejected.type].includes(action.type),
        (state) => {
          state.isLoading = false;
          state.isAuthChecking = false;
        }
      );

    // --- Forgot Password Flow ---
    builder
      .addMatcher(
        (action) =>
          [sendOtp.pending, verifyOtp.pending, resetPassword.pending].includes(
            action.type
          ),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action) =>
          [
            sendOtp.fulfilled,
            sendOtp.rejected,
            verifyOtp.fulfilled,
            verifyOtp.rejected,
            resetPassword.fulfilled,
            resetPassword.rejected,
          ].includes(action.type),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { login, logout, refreshSuccess, authCheckFinished } =
  authSlice.actions;
export default authSlice.reducer;
