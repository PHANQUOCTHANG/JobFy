import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { skillCategoryService } from "@/config/container";
import { normalizeSkillCategoryQuery } from "./skill-category.type";

// [POST] /api/v1/skill-categories - Tạo nhóm kỹ năng mới
export const createSkillCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillCategoryService.create(req.body);

  return res
    .status(201)
    .json(ApiResponse.success(data, "Tạo nhóm kỹ năng thành công"));
});

// [GET] /api/v1/skill-categories - Lấy danh sách nhóm kỹ năng (phân trang)
export const getSkillCategories = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeSkillCategoryQuery(req.query);
  const result = await skillCategoryService.findAll(query);

  return res.status(200).json(ApiResponse.paginate(result));
});

// [GET] /api/v1/skill-categories/:id - Lấy chi tiết nhóm kỹ năng
export const getSkillCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillCategoryService.findById(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/skill-categories/:id - Cập nhật nhóm kỹ năng
export const updateSkillCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillCategoryService.update(req.params.id as unknown as number, req.body);

  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành công"));
});

// [DELETE] /api/v1/skill-categories/:id - Xóa mềm nhóm kỹ năng
export const deleteSkillCategory = asyncHandler(async (req: Request, res: Response) => {
  await skillCategoryService.delete(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(null, "Đã xóa nhóm kỹ năng"));
});
