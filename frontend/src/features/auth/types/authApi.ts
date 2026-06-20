import axios from 'axios';
import { EmployerRegisterInput, EmployerLoginInput, AuthResponse, UserProfile } from './auth.types';

// Fallback về localhost:5000 nếu biến môi trường chưa được thiết lập (tránh lỗi undefined URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Cấu hình HttpClient riêng cho Auth để xử lý Cookie HttpOnly
const authHttpClient = axios.create({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

export const authApi = {
  registerEmployer: (data: EmployerRegisterInput) => 
    authHttpClient.post('/register', { ...data, role: 'employer' }),

  loginEmployer: (data: EmployerLoginInput) => 
    authHttpClient.post('/login', { ...data, role: 'employer' }),

  // Đăng nhập chung cho các vai trò khác
  login: (data: any) => authHttpClient.post('/login', data),

  // Làm mới token dựa trên HttpOnly Cookie (được gọi bởi initAuth)
  refreshAuth: () => authHttpClient.post('/refresh-token'),

  // Lấy thông tin người dùng hiện tại (được gọi bởi fetchCurrentUser)
  getMe: () => authHttpClient.get<UserProfile>('/me'),

  logout: () => authHttpClient.post('/logout'),

  // Quên mật khẩu
  sendOtp: (email: string) => 
    authHttpClient.post('/forgot-password/send-otp', { email }),

  verifyOtp: (email: string, otp: string) => 
    authHttpClient.post('/forgot-password/verify-otp', { email, otp }),

  resetPassword: (data: any) => 
    authHttpClient.post('/forgot-password/reset-password', data),
};