import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

// Schema base dùng chung cho tất cả users
const userBase = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(150, "Họ tên tối đa 150 ký tự")
    .optional(), // fullName lưu trong CandidateProfile, có thể tùy chọn nếu không phải ứng viên

  email: z
    .string()
    .trim()
    .nonempty("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .max(255, "Email tối đa 255 ký tự"),

  phone: z
    .string()
    .regex(/^[0-9+]+$/, "Số điện thoại chỉ chứa số hoặc +")
    .min(10, "SĐT tối thiểu 10 ký tự")
    .max(20, "SĐT tối đa 20 ký tự")
    .nullable()
    .optional(),

  password: z
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(255, "Mật khẩu tối đa 255 ký tự")
    .optional(),

  role: z.nativeEnum(UserRole).default(UserRole.candidate), // Mặc định là candidate (ứng viên)

  avatarUrl: z.string().url("Avatar phải là URL hợp lệ").nullable().optional(),

  status: z.nativeEnum(UserStatus).default(UserStatus.pending_verification), // Mặc định là pending_verification

  emailVerified: z.boolean().default(false),
  
  phoneVerified: z.boolean().default(false),

  googleId: z.string().max(100).nullable().optional(),
  facebookId: z.string().max(100).nullable().optional(),
  linkedinId: z.string().max(100).nullable().optional(),
});

// Validation tạo user mới (dành cho Admin)
export const CreateUserSchema = userBase
  .omit({ status: true, emailVerified: true, phoneVerified: true })
  .superRefine((data, ctx) => {
    // Bắt buộc mật khẩu nếu đăng ký LOCAL (không qua Google, Facebook, Linkedin)
    const isSocialLogin = data.googleId || data.facebookId || data.linkedinId;
    if (!isSocialLogin && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu bắt buộc khi đăng ký trực tiếp",
        path: ["password"],
      });
    }
  });

// Validation cập nhật user (Admin)
export const UpdateUserSchema = userBase
  .pick({
    fullName: true,
    phone: true,
    role: true,
    status: true,
    emailVerified: true,
    phoneVerified: true,
    avatarUrl: true,
    password: true,
  })
  .partial(); // Cho phép cập nhật từng phần

// Validation ID parameter (UUID)
export const IdParamSchema = z.object({
  id: z.string().uuid("ID phải là UUID hợp lệ"),
});

export type CreateUserRequestDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequestDto = z.infer<typeof UpdateUserSchema>;