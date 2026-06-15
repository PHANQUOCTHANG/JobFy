import { Response } from "express";

/**
 * Gửi response chuẩn hóa
 */
export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): void => {
  res.status(statusCode).json({
    status: "success",
    message,
    ...(data !== undefined && { data }),
  });
};
