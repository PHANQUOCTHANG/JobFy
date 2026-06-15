import { Request, Response, NextFunction } from "express";
import AppError from "@/utils/appError";
import logger from "@/utils/logger";
import { Prisma } from "@prisma/client";

export interface IGlobalError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  details?: string[];
}

// Ánh xạ lỗi Prisma → AppError có message thân thiện
function handlePrismaError(err: any): AppError {
  // P2002: Unique constraint (VD: email đã tồn tại)
  if (err.code === "P2002") {
    const rawField = err.meta?.target?.[0] ?? "";
    // Map tên cột DB → tên thân thiện
    const fieldMap: Record<string, string> = {
      email: "Email",
      phone: "Số điện thoại",
      google_id: "Tài khoản Google",
      facebook_id: "Tài khoản Facebook",
      linkedin_id: "Tài khoản LinkedIn",
    };
    const friendlyField = fieldMap[rawField] ?? rawField ?? "Thông tin";
    const errorCode = rawField === "email" ? "EMAIL_TAKEN" : "FIELD_TAKEN";
    const error = new AppError(`${friendlyField} này đã được sử dụng, vui lòng thử thông tin khác`, 409);
    (error as any).errorCode = errorCode;
    (error as any).field = rawField;
    return error;
  }
  // P2025: Record not found
  if (err.code === "P2025") {
    return new AppError("Không tìm thấy dữ liệu yêu cầu", 404);
  }
  // P2003: Foreign key constraint
  if (err.code === "P2003") {
    return new AppError("Dữ liệu liên kết không hợp lệ hoặc đã bị xóa", 400);
  }
  // P2011: Null constraint
  if (err.code === "P2011") {
    const field = err.meta?.constraint ?? "trường bắt buộc";
    return new AppError(`Thiếu dữ liệu bắt buộc: ${field}`, 400);
  }
  // P2014: Relation violation
  if (err.code === "P2014") {
    return new AppError("Vi phạm ràng buộc quan hệ dữ liệu", 400);
  }
  return new AppError("Lỗi cơ sở dữ liệu, vui lòng thử lại", 500, false);
}

export function globalErrorHandler(
  err: IGlobalError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let error: IGlobalError = err;

  // Prisma Known Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }
  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError("Dữ liệu gửi lên không hợp lệ", 400);
  }
  // Chuẩn hoá lỗi không xác định thành AppError
  else if (!(err instanceof AppError)) {
    error = new AppError(
      err.message || "Internal Server Error",
      err.statusCode || 500,
      false
    );
  }
  // err là AppError → kế thừa toàn bộ thuộc tính (errorCode, field, data)
  // Không cần làm gì, error = err là đủ

  // Chỉ log lỗi server / lỗi không kiểm soát
  if ((error.statusCode && error.statusCode >= 500) || !error.isOperational) {
    logger.error(error);

  }

  const statusCode = error.statusCode || 500;
  const isDev = process.env.NODE_ENV === "development";
  const errorAny = error as any;

  // DEV: trả full thông tin để debug
  if (isDev) {
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message: error.message,
      ...(errorAny.errorCode && { errorCode: errorAny.errorCode }),
      ...(errorAny.field && { field: errorAny.field }),
      ...(errorAny.data && { data: errorAny.data }),
      ...(error.details && { details: error.details }),
      stack: error.stack,
    });
  }

  // PROD: chỉ trả lỗi an toàn
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: error.isOperational ? error.message : "Lỗi hệ thống, vui lòng thử lại sau!",
    ...(errorAny.errorCode && { errorCode: errorAny.errorCode }),
    ...(errorAny.field && { field: errorAny.field }),
    ...(errorAny.data && { data: errorAny.data }),
    ...(error.details && { details: error.details }),
  });
}
