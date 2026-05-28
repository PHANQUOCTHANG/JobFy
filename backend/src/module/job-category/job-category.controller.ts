import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { jobCategoryService } from "@/config/container";
import { normalizeJobCategoryQuery } from "./job-category.type";

// [POST] /api/v1/job-categories - Tạo danh mục mới
export const createJobCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobCategoryService.create(req.body);

  return res
    .status(201)
    .json(ApiResponse.success(data, "Tạo danh mục thành công"));
});

// [GET] /api/v1/job-categories - Lấy danh sách danh mục (phân trang)
export const getJobCategories = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeJobCategoryQuery(req.query);
  const result = await jobCategoryService.findAll(query);

  return res.status(200).json(ApiResponse.paginate(result));
});

// [GET] /api/v1/job-categories/:id - Lấy chi tiết danh mục
export const getJobCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobCategoryService.findById(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/job-categories/:id - Cập nhật thông tin danh mục
export const updateJobCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await jobCategoryService.update(req.params.id as unknown as number, req.body);

  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành công"));
});

// [DELETE] /api/v1/job-categories/:id - Xóa mềm danh mục
export const deleteJobCategory = asyncHandler(async (req: Request, res: Response) => {
  await jobCategoryService.delete(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(null, "Đã xóa danh mục"));
});
