import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { candidateProfileService } from "@/config/container";
import { normalizeCandidateProfileQuery } from "./candidate-profile.type";

// [POST] /api/v1/candidate-profiles/me - Tạo profile (Chỉ candidate)
export const createMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await candidateProfileService.create(userId, req.body);

  return res.status(201).json(ApiResponse.success(data, "Tạo hồ sơ thành công"));
});

// [GET] /api/v1/candidate-profiles/me - Lấy profile của chính mình
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await candidateProfileService.findByUserId(userId);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/candidate-profiles/me - Cập nhật profile của chính mình
export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await candidateProfileService.updateByUserId(userId, req.body);

  return res.status(200).json(ApiResponse.success(data, "Cập nhật hồ sơ thành công"));
});

// [GET] /api/v1/candidate-profiles - Lấy danh sách profile (Công khai)
export const getProfiles = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeCandidateProfileQuery(req.query);
  const result = await candidateProfileService.findAll(query);

  return res.status(200).json(ApiResponse.paginate(result));
});

// [GET] /api/v1/candidate-profiles/:id - Lấy chi tiết 1 profile (Công khai)
export const getProfileById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  // Tăng view count async không block response
  candidateProfileService.incrementViewCount(id as string).catch(console.error);
  
  const data = await candidateProfileService.findById(id as string);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/candidate-profiles/:id/admin - Admin cập nhật profile
export const adminUpdateProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = await candidateProfileService.updateById(req.params.id as string, req.body);

  return res.status(200).json(ApiResponse.success(data, "Admin cập nhật hồ sơ thành công"));
});

// [DELETE] /api/v1/candidate-profiles/:id/admin - Admin xóa profile
export const adminDeleteProfile = asyncHandler(async (req: Request, res: Response) => {
  await candidateProfileService.deleteById(req.params.id as string);

  return res.status(200).json(ApiResponse.success(null, "Admin đã xóa hồ sơ ứng viên"));
});
