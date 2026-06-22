import { Request, Response } from "express";
import path from "path";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { aiService } from "@/config/container";

function resolveCvMimetype(file: Express.Multer.File): string {
  if (file.mimetype && file.mimetype !== "application/octet-stream") {
    return file.mimetype;
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (ext === ".doc") return "application/msword";
  return file.mimetype;
}

export const generateJD = asyncHandler(async (req: Request, res: Response) => {
  const result = await aiService.generateJD(req.body);
  return res.status(200).json(ApiResponse.success(result, "Sinh JD thành công"));
});

export const generateInterviewQuestions = asyncHandler(async (req: Request, res: Response) => {
  const result = await aiService.generateInterviewQuestions(req.body);
  return res.status(200).json(ApiResponse.success(result, "Sinh câu hỏi phỏng vấn thành công"));
});

export const analyzeCv = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json(ApiResponse.error("Vui lòng tải lên file CV"));
  }

  const { position, jobDescription } = req.body;
  if (!position) {
    return res.status(400).json(ApiResponse.error("Vui lòng nhập vị trí tuyển dụng"));
  }

  const result = await aiService.analyzeCv({
    fileBuffer: file.buffer,
    mimetype: resolveCvMimetype(file),
    position,
    jobDescription,
  });

  return res.status(200).json(ApiResponse.success(result, "Phân tích CV thành công"));
});
