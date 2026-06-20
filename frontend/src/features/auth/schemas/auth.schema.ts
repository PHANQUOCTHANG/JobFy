import { z } from "zod";

const UserRoleEnum = z.enum(["admin", "employer", "candidate"]);

// Schema Đăng nhập
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
  rememberMe: z.boolean().default(false),
  role: UserRoleEnum.default("candidate").optional(),
});

// Schema Đăng ký
export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Tên phải từ 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
    confirmPassword: z.string(),
    role: UserRoleEnum.default("candidate").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const employerRegisterSchema = z
  .object({
    fullName: z.string().min(3, "Tên người đại diện phải từ 3 ký tự"),
    companyName: z.string().min(2, "Tên công ty phải từ 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
    provinceId: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
    districtId: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
    role: UserRoleEnum.default("employer").optional(),
  });

export type EmployerRegisterInput = z.infer<typeof employerRegisterSchema>;

// Schema OTP
export const otpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải có đúng 6 số"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải từ 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address format"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(8, "Mật khẩu mới phải từ 8 ký tự"),
    confirmPassword: z.string().min(8, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

// Export Type để dùng trong Form
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
