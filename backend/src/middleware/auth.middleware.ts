import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import { JwtPayload } from "@/types/express";
import { getCache } from "@/utils/cache";

// Lấy JWT secret từ environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Kiểm tra JWT secret có được cấu hình đúng không
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Trích xuất token từ header Authorization
const extractTokenFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return token || null;
};

// Xác thực token JWT
const verifyJWT = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

// Xác thực người dùng thông qua JWT token
// SECURITY: Kiểm tra cả blacklist Redis để đảm bảo token đã logout không thể dùng lại
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    // Kiểm tra header Authorization có hợp lệ không
    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return next(new AppError("Unauthorized", 401));
    }

    // Kiểm tra token có trong blacklist không (đã logout)
    // FIX (Bug 6): Wrap in try/catch — if Redis is down/restarting we fail-open
    // (allow the request) rather than blocking all traffic with ClientClosedError
    try {
      const isBlacklisted = await getCache<string>(`auth:blacklist:${token}`);
      if (isBlacklisted) {
        return next(new AppError("Token đã bị thu hồi, vui lòng đăng nhập lại", 401));
      }
    } catch (redisErr) {
      // Redis unavailable (e.g. after container restart) — log and continue
      console.warn("[requireAuth] Redis blacklist check failed, skipping:", (redisErr as Error).message);
    }

    // Xác thực và giải mã token
    const decoded = verifyJWT(token);

    // Chuẩn hoá payload để các controller/service luôn dùng được req.user.id
    // (JWT đang tạo { userId, email, role, ... })
    const userId = (decoded as any).userId;
    req.user = {
      ...(decoded as any),
      id: userId,
      // giữ tương thích nếu code khác đang dùng userId
      userId,
    };


    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};

// Kiểm tra quyền truy cập của người dùng dựa trên role
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Kiểm tra người dùng đã được xác thực chưa
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    // Kiểm tra role của người dùng có trong danh sách quyền không (case-insensitive)
    const userRole = (req.user.role ?? "").toLowerCase();
    const allowedRoles = roles.map((r) => (r ?? "").toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError("Forbidden", 403));
    }


    next();
  };
};

/**
 * Middleware: Yêu cầu nhà tuyển dụng phải hoàn tất đủ 4 bước xác thực
 * mới được phép đăng tin tuyển dụng.
 *
 * Bước 1: emailVerified = true
 * Bước 2: phoneVerified = true  (SĐT)
 * Bước 3: company có name + address
 * Bước 4: company.isVerified = true (pháp lý được admin duyệt)
 */
export const requireFullyVerified = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) return next(new AppError("Unauthorized", 401));

    const userId = req.user.userId;

    // Import prisma lazily để tránh circular dependency
    const { default: prisma } = await import("@/lib/prisma");

    const [user, company] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { emailVerified: true, phoneVerified: true },
      }),
      prisma.company.findFirst({
        where: { ownerId: userId },
        select: { name: true, address: true, isVerified: true },
      }),
    ]);

    if (!user?.emailVerified) {
      return next(new AppError("Bạn cần xác thực email trước khi đăng tin (Bước 1).", 403));
    }
    if (!user?.phoneVerified) {
      return next(new AppError("Bạn cần xác thực số điện thoại trước khi đăng tin (Bước 2).", 403));
    }
    if (!company?.name || !company?.address) {
      return next(new AppError("Bạn cần hoàn thiện thông tin công ty trước khi đăng tin (Bước 3).", 403));
    }
    if (!company?.isVerified) {
      return next(new AppError("Tài khoản của bạn chưa được quản trị viên xác thực pháp lý. Vui lòng chờ duyệt (Bước 4).", 403));
    }

    next();
  } catch {
    next(new AppError("Lỗi khi kiểm tra trạng thái xác thực", 500));
  }
};
