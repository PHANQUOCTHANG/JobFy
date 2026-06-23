import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import AppError from "@/utils/appError";
import { applicationService, candidateProfileService } from "@/config/container";
import { normalizeApplicationQuery } from "./application.type";

export const applyForJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await applicationService.apply(userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Nộp đơn ứng tuyển thành công"));
});

export const applyWithUploadCv = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const file = req.file as Express.Multer.File & { path: string };
  
  if (!file) throw new AppError("Vui lòng chọn file CV", 400);
  
  const { jobId, coverLetter, fullName, email, phone } = req.body;
  if (!jobId) throw new AppError("Thiếu jobId", 400);

  const data = await applicationService.applyWithCvUpload(userId, {
    jobId, 
    coverLetter, 
    fullName, 
    email, 
    phone,
    fileUrl: file.path,
    fileName: file.originalname,
  });

  return res.status(201).json(ApiResponse.success(data, "Nộp đơn ứng tuyển thành công"));
});

export const getApplications = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeApplicationQuery(req.query);
  
  if (req.user!.role === 'candidate') {
    const profile = await candidateProfileService.findByUserId(req.user!.userId);
    query.candidateId = profile.id;
  }
  
  const data = await applicationService.findAll(query);
  return res.status(200).json(ApiResponse.paginate(data));
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.findById(String(req.params.id));
  return res.status(200).json(ApiResponse.success(data));
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await applicationService.updateStatus(String(req.params.id), userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật trạng thái thành công"));
});

export const addNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await applicationService.addNote(String(req.params.id), userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm ghi chú"));
});
