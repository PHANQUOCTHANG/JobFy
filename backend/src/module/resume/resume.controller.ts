import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { resumeService } from "@/config/container";
import { normalizeResumeQuery } from "./resume.type";

// ================= Resume Base =================
export const createResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await resumeService.create(userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Tạo CV thành công"));
});

export const getResumes = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeResumeQuery(req.query);
  const data = await resumeService.findAll(query);
  return res.status(200).json(ApiResponse.paginate(data));
});

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  resumeService.incrementViewCount(id).catch(console.error);
  
  const data = await resumeService.findById(id);
  return res.status(200).json(ApiResponse.success(data));
});

export const updateResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await resumeService.update(req.params.id, userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật CV thành công"));
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await resumeService.delete(req.params.id, userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa CV"));
});

// ================= Education =================
export const addEducation = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addEducation(req.params.id, req.user!.id, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm quá trình học tập"));
});

export const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateEducation(req.params.id, Number(req.params.nestedId), req.user!.id, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật quá trình học tập"));
});

export const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteEducation(req.params.id, Number(req.params.nestedId), req.user!.id);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa học tập"));
});

// ================= Experience =================
export const addExperience = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addExperience(req.params.id, req.user!.id, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm kinh nghiệm làm việc"));
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateExperience(req.params.id, Number(req.params.nestedId), req.user!.id, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật kinh nghiệm làm việc"));
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteExperience(req.params.id, Number(req.params.nestedId), req.user!.id);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa kinh nghiệm"));
});
