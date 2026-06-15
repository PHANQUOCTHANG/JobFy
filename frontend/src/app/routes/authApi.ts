import axios from 'axios';
import { RegisterRequest, LoginRequest, ResetPasswordRequest } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

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