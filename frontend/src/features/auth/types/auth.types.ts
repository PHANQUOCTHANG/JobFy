import { RegisterRequest, LoginRequest } from "@/../../backend/src/module/auth/auth.request";

export type EmployerRegisterInput = RegisterRequest;
export type EmployerLoginInput = LoginRequest;

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'employer' | 'candidate';
  avatarUrl?: string;
  status: 'active' | 'pending_verification' | 'banned';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: UserProfile;
  };
}