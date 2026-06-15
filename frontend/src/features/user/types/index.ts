// ============================================================
// User Types — Khớp với Backend JobFy (Prisma + AuthResponseDto)
// ============================================================

export type UserRole = "candidate" | "employer" | "admin";
export type UserStatus = "active" | "inactive" | "banned";

// 1. IUser — dữ liệu trả về từ /auth/login, /auth/register, /auth/refresh-token
export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  mustChangePassword?: boolean;
}

// 2. UserProfile — dữ liệu đầy đủ từ /auth/me
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  status?: UserStatus;
  mustChangePassword?: boolean;
}

// 3. DTOs
export interface CreateUserRequest {
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: File | null;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: UserRole;
  avatar?: File | null;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 4. Admin Filter Params
export interface UserFilterParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: string;
  role?: UserRole;
  status?: UserStatus;
}

// Compatibility alias
export type User = IUser;

