import prisma from "@/lib/prisma";
import { AuthService, IAuthService } from "@/module/auth/auth.service";
import { EmailService, IEmailService } from "@/module/auth/email/email.service";
import {
  IOtpRepository,
  OtpRepository,
} from "@/module/auth/otp/otp.repository";
import { IOtpService, OtpService } from "@/module/auth/otp/otp.service";
import {
  IRefreshTokenRepository,
  RefreshTokenRepository,
} from "@/module/auth/refreshToken/refreshToken.repository";

import { IUserRepository, UserRepository } from "@/module/user/user.repository";
import { UserService } from "@/module/user/user.service";
// User
const userRepository: IUserRepository = new UserRepository(prisma);
export const userService = new UserService(userRepository);

// Email
export const emailService: IEmailService = new EmailService();

// Otp
const otpRepository: IOtpRepository = new OtpRepository(prisma);
export const otpService: IOtpService = new OtpService(
  otpRepository,
  userRepository,
);

// Refresh Token
const refreshTokenRepository: IRefreshTokenRepository =
  new RefreshTokenRepository(prisma);

// Auth
export const authService: IAuthService = new AuthService(
  userRepository,
  refreshTokenRepository,
  otpRepository,
);

