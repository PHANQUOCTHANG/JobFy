import slugify from "slugify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "@/utils/appError";
import { IUserRepository } from "@/module/user/user.repository";
import { IRefreshTokenRepository } from "@/module/auth/refreshToken/refreshToken.repository";
import { IOtpRepository } from "@/module/auth/otp/otp.repository";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "./auth.request";
import { AuthResponseDto } from "./auth.response";
import { getCache, setCache, deleteCache } from "@/utils/cache";
import { emailService } from "@/config/container";

// Kết quả nội bộ — thêm refreshTokenExpiresAt để controller set cookie chính xác
interface AuthResult {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: any;
  rememberMe: boolean;
}

import { IOtpService } from "@/module/auth/otp/otp.service";

export interface IAuthService {
  register(dto: RegisterRequest): Promise<{ message: string }>;
  verifyAccount(email: string, otp: string): Promise<AuthResponseDto>;
  login(dto: LoginRequest): Promise<AuthResponseDto>;
  refresh(refreshToken: string): Promise<AuthResponseDto>;
  logout(refreshToken: string, accessToken?: string): Promise<void>;
  resetPassword(dto: ResetPasswordRequest): Promise<void>;
  changePassword(userId: string, dto: ChangePasswordRequest): Promise<void>;
}

export class AuthService implements IAuthService {
  private readonly CACHE_KEY_REFRESH = "auth:refresh:";
  private readonly CACHE_KEY_BLACKLIST = "auth:blacklist:";

  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly otpService: IOtpService,
  ) {}

  async register(dto: RegisterRequest): Promise<{ message: string }> {
    const existed = await this.userRepo.findByEmail(dto.email);
    if (existed) throw new AppError("Email đã tồn tại trên hệ thống", 409);

    // Bảo mật: Mặc định là candidate nếu role không hợp lệ hoặc cố tình gửi admin
    const role = (dto.role === "employer" || dto.role === "candidate") ? dto.role : "candidate";

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const userData: any = {
      email: dto.email,
      passwordHash: hashedPassword,
      role: role,
      phone: dto.phone,
    };

    const extraData = dto as any;
    if (role === "candidate" && extraData.fullName) {
      userData.candidateProfile = {
        create: { fullName: extraData.fullName },
      };
    } else if (role === "employer" && extraData.companyName) {
      const baseSlug = slugify(extraData.companyName, { lower: true, strict: true, locale: "vi" });
      userData.companiesOwned = {
        create: [
          {
            name: extraData.companyName,
            // Thêm hậu tố ngẫu nhiên để tránh lỗi trùng lặp slug (Unique constraint failed)
            slug: `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`,
            // Các trường bắt buộc tối thiểu khác của model Company (nếu có)
            address: "", 
            shortDescription: "",
          },
        ],
      };
    }

    await this.userRepo.create(userData);

    // Thay vì generate Auth Result, gửi OTP để người dùng xác nhận
    await this.otpService.send(dto.email, "VERIFY_ACCOUNT");
    return { message: "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản." };
  }

  async verifyAccount(email: string, otp: string): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    if (user.status === "active") throw new AppError("Tài khoản đã được xác thực trước đó", 400);

    // Xác thực OTP
    await this.otpService.verify(email, otp, "VERIFY_ACCOUNT");

    // Cập nhật trạng thái người dùng
    await this.userRepo.updateById(user.id, {
      status: "active",
      emailVerified: true,
    });
    user.status = "active";
    user.emailVerified = true;

    // Đăng nhập luôn cho user sau khi xác minh xong
    const result = await this.generateAuthResult(user, false);
    return AuthResponseDto.from(
      result.user,
      result.accessToken,
      result.refreshToken,
      result.refreshTokenExpiresAt,
      result.rememberMe,
    );
  }

  async login(dto: LoginRequest): Promise<AuthResponseDto> {
    // 1. Tìm user theo email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new AppError("Email hoặc mật khẩu không chính xác", 401);
    }

    // 2. Kiểm tra mật khẩu
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Email hoặc mật khẩu không chính xác", 401);
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.status === "inactive") {
      throw new AppError("Tài khoản đã bị tạm khóa", 403);
    }
    if (user.status === "banned") {
      const banError = new AppError("Tài khoản đã bị cấm vĩnh viễn", 403);
      (banError as any).errorCode = "ACCOUNT_LOCKED";
      throw banError;
    }

    // 4. Kiểm tra vai trò đăng nhập có khớp với tài khoản không
    if (user.role !== dto.role) {
      throw new AppError("Vai trò đăng nhập không khớp với tài khoản của bạn", 403);
    }

    // Bỏ qua kiểm tra pending_verification tại đây để cho phép đăng nhập trước

    const result = await this.generateAuthResult(user, dto.rememberMe);
    return AuthResponseDto.from(
      result.user,
      result.accessToken,
      result.refreshToken,
      result.refreshTokenExpiresAt,
      result.rememberMe,
    );
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    if (!refreshToken) throw new AppError("Không tìm thấy Refresh Token", 401);

    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    // 1. Giải mã token để lấy payload
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret as string);
    } catch (err) {
      throw new AppError("Refresh Token không hợp lệ hoặc đã hết hạn", 401);
    }

    const isRememberMe = !!decoded.rememberMe;

    console.log("Decoded Refresh Token Payload:", decoded);

    const cacheKey = `${this.CACHE_KEY_REFRESH}${refreshToken}`;
    let userId = await getCache<string>(cacheKey);

    if (!userId) {
      const stored = await this.refreshRepo.findValid(refreshToken);
      if (!stored) throw new AppError("Phiên làm việc hết hạn", 401);
      userId = stored.userId;
    }

    const user = await this.userRepo.findById(userId as string);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    await Promise.all([
      this.refreshRepo.revoke(refreshToken),
      deleteCache(cacheKey),
    ]);

    const result = await this.generateAuthResult(user, isRememberMe);
    return AuthResponseDto.from(
      result.user,
      result.accessToken,
      result.refreshToken,
      result.refreshTokenExpiresAt,
      result.rememberMe,
    );
  }

  async logout(refreshToken: string, accessToken?: string): Promise<void> {
    if (!refreshToken) throw new AppError("Không tìm thấy Refresh Token", 401);

    await Promise.all([
      this.refreshRepo.revoke(refreshToken),
      deleteCache(`${this.CACHE_KEY_REFRESH}${refreshToken}`),
    ]);

    if (accessToken) {
      const decoded: any = jwt.decode(accessToken);
      const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
      if (remainingTime > 0) {
        await setCache(
          `${this.CACHE_KEY_BLACKLIST}${accessToken}`,
          "true",
          remainingTime,
        );
      }
    }
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<void> {
    const resetSecret = process.env.JWT_RESET_SECRET;
    let decoded: any;
    try {
      decoded = jwt.verify(dto.verificationToken, resetSecret as string);
    } catch {
      throw new AppError("Token xác thực không hợp lệ hoặc đã hết hạn", 400);
    }

    if (decoded.scope !== "reset_password") {
      throw new AppError("Token không có quyền đặt lại mật khẩu", 403);
    }

    const user = await this.userRepo.findById(decoded.userId);
    if (!user) throw new AppError("Người dùng không tồn tại", 404);

    if (user.passwordHash) {
      const isSame = await bcrypt.compare(dto.newPassword, user.passwordHash);
      if (isSame) throw new AppError("Mật khẩu mới không được trùng với mật khẩu cũ", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepo.updateById(user.id, { passwordHash: hashedPassword });

    const userTokens = await this.refreshRepo.findByUserId(user.id);
    const deleteCachePromises = userTokens.map((t) =>
      deleteCache(`${this.CACHE_KEY_REFRESH}${t.token}`),
    );

    await Promise.all([
      this.refreshRepo.revokeAllByUser(user.id),
      this.otpRepo.deleteByEmail(user.email),
      deleteCache(`otp:${user.email}`),
      deleteCache(`users:id:${user.id}`),
      ...deleteCachePromises,
    ]);

    await emailService.sendPasswordResetConfirmation(user.email, user.candidateProfile?.fullName || user.email);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordRequest,
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.passwordHash) {
      throw new AppError("Người dùng không tồn tại", 404);
    }

    const isValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isValid) {
      throw new AppError("Mật khẩu hiện tại không chính xác", 401);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepo.updateById(userId, { passwordHash: hashedPassword });

    // Xóa cache refresh token cụ thể của user thay vì xóa của toàn hệ thống
    const userTokens = await this.refreshRepo.findByUserId(userId);
    const deleteCachePromises = userTokens.map((t) =>
      deleteCache(`${this.CACHE_KEY_REFRESH}${t.token}`),
    );

    await Promise.all([
      this.refreshRepo.revokeAllByUser(userId),
      ...deleteCachePromises,
      // Xóa cache user detail — mật khẩu vừa được đổi
      deleteCache(`users:id:${userId}`),
    ]);
  }

  private async generateAuthResult(
    user: any,
    rememberMe: boolean = false,
  ): Promise<AuthResult> {
    const accessSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!accessSecret || !refreshSecret)
      throw new AppError("Lỗi cấu hình JWT", 500);

    const userIdStr = user.id.toString();

    const accessToken = jwt.sign(
      { userId: userIdStr, email: user.email, role: user.role, rememberMe },
      accessSecret,
      { expiresIn: "15m" },
    );

    const refreshTokenTTL = rememberMe
      ? 14 * 24 * 60 * 60 * 1000 // 14 ngày (ms)
      : 24 * 60 * 60 * 1000; //  1 ngày  (ms)

    // Tính chính xác một lần, dùng lại nhất quán ở cả DB, Redis, và cookie
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTTL);

    const refreshToken = jwt.sign(
      { userId: userIdStr, rememberMe },
      refreshSecret,
      {
        expiresIn: rememberMe ? "14d" : "1d",
      },
    );

    await Promise.all([
      this.refreshRepo.createOrUpdate({
        userId: userIdStr,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      }),
      setCache(
        `${this.CACHE_KEY_REFRESH}${refreshToken}`,
        userIdStr,
        Math.floor(refreshTokenTTL / 1000), // Redis nhận giây
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      user,
      rememberMe,
    };
  }
}
