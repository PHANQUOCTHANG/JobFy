import { RegisterRequest, LoginRequest } from "@/../../backend/src/module/auth/auth.request";
import type { IUser as UserProfile } from "@/features/user/types";

export type EmployerRegisterInput = RegisterRequest;
export type EmployerLoginInput = LoginRequest;

export type { UserProfile };
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: UserProfile;
  };
}