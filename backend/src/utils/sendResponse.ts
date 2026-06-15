import { Response } from "express";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) {
  return res.status(statusCode).json({
    message,
    data: data ?? null,
  });
}

