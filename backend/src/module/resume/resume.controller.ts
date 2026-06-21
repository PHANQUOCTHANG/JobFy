import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { resumeService } from "@/config/container";
import { normalizeResumeQuery } from "./resume.type";

// ================= Resume Base =================
export const uploadCvPdf = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json(ApiResponse.error("Không tìm thấy file tải lên", 400));
  }
  return res.status(200).json(ApiResponse.success(req.file.path, "Upload file CV thành công"));
});

export const getMyResumes = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await resumeService.findByCandidate(userId);
  return res.status(200).json(ApiResponse.success(data));
});


export const createResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
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
  resumeService.incrementViewCount(id as string).catch(console.error);
  
  const data = await resumeService.findById(id as string);
  return res.status(200).json(ApiResponse.success(data));
});

export const updateResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await resumeService.update((req.params.id as string), userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật CV thành công"));
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await resumeService.delete((req.params.id as string), userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa CV"));
});

// ================= Education =================
export const addEducation = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addEducation((req.params.id as string), req.user!.userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm quá trình học tập"));
});

export const updateEducation = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateEducation((req.params.id as string), Number((req.params.nestedId as string)), req.user!.userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật quá trình học tập"));
});

export const deleteEducation = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteEducation((req.params.id as string), Number((req.params.nestedId as string)), req.user!.userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa học tập"));
});

// ================= Experience =================
export const addExperience = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addExperience((req.params.id as string), req.user!.userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm kinh nghiệm làm việc"));
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateExperience((req.params.id as string), Number((req.params.nestedId as string)), req.user!.userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật kinh nghiệm làm việc"));
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteExperience((req.params.id as string), Number((req.params.nestedId as string)), req.user!.userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa kinh nghiệm"));
});

// ================= Skill =================
export const addSkill = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addSkill(req.params.id as string, req.user!.userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm kỹ năng"));
});

export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateSkill(req.params.id as string, Number(req.params.nestedId), req.user!.userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật kỹ năng"));
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteSkill(req.params.id as string, Number(req.params.nestedId), req.user!.userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa kỹ năng"));
});

// ================= Certification =================
export const addCertification = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addCertification(req.params.id as string, req.user!.userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm chứng chỉ"));
});

export const updateCertification = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateCertification(req.params.id as string, Number(req.params.nestedId), req.user!.userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật chứng chỉ"));
});

export const deleteCertification = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteCertification(req.params.id as string, Number(req.params.nestedId), req.user!.userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa chứng chỉ"));
});

// ================= Project =================
export const addProject = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.addProject(req.params.id as string, req.user!.userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm dự án"));
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.updateProject(req.params.id as string, Number(req.params.nestedId), req.user!.userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Đã cập nhật dự án"));
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteProject(req.params.id as string, Number(req.params.nestedId), req.user!.userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa dự án"));
});
