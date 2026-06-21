import { z } from "zod";

const passwordRule = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .optional()
  .or(z.literal(""));

// --- 1. ADMIN USER SCHEMAS ---
const baseAdminUserSchema = z.object({
  fullName: z.string().trim().min(2, "Tên quá ngắn").max(150),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["candidate", "employer", "admin"]),
  status: z.enum(["active", "inactive", "banned", "pending_verification"]),
  avatarUrl: z.string().url("Phải là URL hợp lệ").optional().or(z.literal("")),
});

// Schema khi tạo mới: Bắt buộc password
export const createAdminUserSchema = baseAdminUserSchema.extend({
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

// Schema khi cập nhật: Password không bắt buộc (chỉ đổi khi nhập)
export const updateAdminUserSchema = baseAdminUserSchema.extend({
  password: passwordRule,
});

export type AdminUserFormValues = z.infer<typeof updateAdminUserSchema>;

// --- 2. USER PROFILE UPDATE (Self) ---
export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
