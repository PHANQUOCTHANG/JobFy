import { EmployerRegisterInput as RegisterRequest, LoginInput as LoginRequest } from "@/features/auth/schemas/auth.schema";
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