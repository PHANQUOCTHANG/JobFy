import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Local interface definitions to avoid importing from backend
export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'employer' | 'candidate';
  companyName?: string;
  provinceId?: string;
  districtId?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
  role: 'admin' | 'employer' | 'candidate';
  rememberMe?: boolean;
}

export interface ResetPasswordRequest {
  verificationToken: string;
  newPassword?: string;
}

export const authApi = {
  register: (data: RegisterRequest) => 
    axios.post(`${API_URL}/auth/register`, data),
    
  login: (data: LoginRequest) => 
    axios.post(`${API_URL}/auth/login`, data),
    
  logout: () => 
    axios.post(`${API_URL}/auth/logout`),

  sendOtp: (email: string) => 
    axios.post(`${API_URL}/auth/forgot-password/send-otp`, { email }),

  verifyOtp: (email: string, otp: string) => 
    axios.post(`${API_URL}/auth/forgot-password/verify-otp`, { email, otp }),

  resetPassword: (data: ResetPasswordRequest) => 
    axios.post(`${API_URL}/auth/forgot-password/reset-password`, data),
};