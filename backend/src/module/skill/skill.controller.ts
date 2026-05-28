import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { skillService } from "@/config/container";
import { normalizeSkillQuery } from "./skill.type";

// [POST] /api/v1/skills - Tạo kỹ năng mới
export const createSkill = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillService.create(req.body);

  return res
    .status(201)
    .json(ApiResponse.success(data, "Tạo kỹ năng thành công"));
});

// [GET] /api/v1/skills - Lấy danh sách kỹ năng (phân trang)
export const getSkills = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeSkillQuery(req.query);
  const result = await skillService.findAll(query);

  return res.status(200).json(ApiResponse.paginate(result));
});

// [GET] /api/v1/skills/:id - Lấy chi tiết kỹ năng
export const getSkill = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillService.findById(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/skills/:id - Cập nhật kỹ năng
export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const data = await skillService.update(req.params.id as unknown as number, req.body);

  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành công"));
});

// [DELETE] /api/v1/skills/:id - Xóa mềm kỹ năng
export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  await skillService.delete(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(null, "Đã xóa kỹ năng"));
});
