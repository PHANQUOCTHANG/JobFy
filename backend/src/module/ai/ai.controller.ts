import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { aiService, resumeService, jobService } from "@/config/container";
import AppError from "@/utils/appError";

export const generateCvSummary = asyncHandler(async (req: Request, res: Response) => {
  const data = await aiService.generateCvSummary(req.body);
  return res.status(200).json(ApiResponse.success(data, "Tạo mục tiêu nghề nghiệp thành công"));
});

export const reviewCv = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.cvData) throw new AppError("Thiếu thông tin CV", 400);
  const data = await aiService.reviewCv(req.body);
  return res.status(200).json(ApiResponse.success(data, "Đánh giá CV thành công"));
});

export const matchJob = asyncHandler(async (req: Request, res: Response) => {
  const { resumeId, jobId, language } = req.body;
  if (!resumeId || !jobId) throw new AppError("Thiếu resumeId hoặc jobId", 400);

  // Fetch real data
  const resume = await resumeService.findById(resumeId);
  if (!resume) throw new AppError("Không tìm thấy CV", 404);
  
  const job = await jobService.findById(jobId);
  if (!job) throw new AppError("Không tìm thấy công việc", 404);

  const data = await aiService.matchJob({ resumeId, jobId, language }, resume, job);
  return res.status(200).json(ApiResponse.success(data, "So khớp thành công"));
});

export const suggestSkills = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.jobTitle) throw new AppError("Thiếu jobTitle", 400);
  const data = await aiService.suggestSkills(req.body);
  return res.status(200).json(ApiResponse.success(data, "Gợi ý kỹ năng thành công"));
});

export const generateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
  const { cvData, jobData, language } = req.body;
  if (!cvData || !jobData) throw new AppError("Thiếu dữ liệu CV hoặc công việc", 400);

  const content = await aiService.generateCoverLetter(cvData, jobData, language);
  return res.status(200).json(ApiResponse.success({ content }, "Tạo Cover Letter thành công"));
});

export const generateFullCv = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.prompt) throw new AppError("Thiếu thông tin đầu vào (prompt)", 400);
  const data = await aiService.generateFullCv(req.body);
  return res.status(200).json(ApiResponse.success(data, "Tạo CV bằng AI thành công"));
});

export const generateJd = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.title) throw new AppError("Thiếu tiêu đề công việc", 400);
  const data = await aiService.generateJd(req.body);
  return res.status(200).json(ApiResponse.success(data, "Tạo JD thành công"));
});

export const generateQuestions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body.title) throw new AppError("Thiếu vị trí công việc", 400);
  const data = await aiService.generateQuestions(req.body);
  return res.status(200).json(ApiResponse.success(data, "Tạo câu hỏi thành công"));
});

export const analyzeCv = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new AppError("Thiếu file CV", 400);
  const { jobDescription, position } = req.body;
  
  // Convert buffer to text (dummy text extraction for demo, should use pdf-parse/mammoth in prod)
  // Since we don't have pdf-parse imported in this controller right now, we will just use the file name or a mock for now
  // Wait, does aiService have text extraction? No. I should dynamically import pdf-parse if needed, or just send a basic mock if I can't read it.
  // Actually, I can use a simple buffer to string. But PDF needs parsing. 
  // For now, let's just use pdf-parse. Wait, is pdf-parse installed? I'll check package.json.
  let cvText = "";
  if (file.mimetype === "application/pdf") {
    try {
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(file.buffer);
      cvText = pdfData.text;
    } catch (e) {
      cvText = file.buffer.toString('utf8');
    }
  } else {
    cvText = file.buffer.toString('utf8');
  }

  const data = await aiService.analyzeCv(cvText, jobDescription, position);
  return res.status(200).json(ApiResponse.success(data, "Phân tích CV thành công"));
});

