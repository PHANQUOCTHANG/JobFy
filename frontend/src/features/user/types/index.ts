// ============================================================
// User Types — Khớp với Backend JobFy (Prisma + AuthResponseDto)
// ============================================================

export type UserRole = "candidate" | "employer" | "admin";
export type UserStatus = "active" | "inactive" | "banned" | "pending_verification";

// 1. IUser — dữ liệu trả về từ /users
export interface IUser {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  googleId: string | null;
  facebookId: string | null;
  linkedinId: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// 2. UserProfile — dữ liệu đầy đủ từ /auth/me
export interface UserProfile extends IUser {}

// 3. DTOs
export interface CreateUserRequest {
  fullName?: string;
  email: string;
  password?: string;
  role?: UserRole;
  avatarUrl?: string | null;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string | null;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string | null;
  password?: string;
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
  search?: string;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  sort?: string;
}

// Compatibility alias
export type User = IUser;

