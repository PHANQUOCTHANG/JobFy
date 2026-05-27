import { User, UserRole, UserStatus } from "@prisma/client";

// DTO trả về cho client (không expose password/passwordHash)
export class UserResponseDto {
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

  constructor(user: any) {
    this.id = user.id;
    // fullName được trích xuất từ bảng liên kết CandidateProfile
    this.fullName = user.candidateProfile?.fullName ?? null;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.avatarUrl = user.avatarUrl;
    this.status = user.status;
    this.emailVerified = user.emailVerified;
    this.phoneVerified = user.phoneVerified;
    this.googleId = user.googleId ?? null;
    this.facebookId = user.facebookId ?? null;
    this.linkedinId = user.linkedinId ?? null;
    this.lastLoginAt = user.lastLoginAt?.toISOString() ?? null;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
  }

  // Chuyển đổi một user thành DTO
  static from(user: any): UserResponseDto {
    return new UserResponseDto(user);
  }

  // Chuyển đổi danh sách users thành DTO
  static fromList(users: any[]): UserResponseDto[] {
    return users.map((u) => new UserResponseDto(u));
  }
}