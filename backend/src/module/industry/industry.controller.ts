import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { industryService } from "@/config/container";
import { normalizeIndustryQuery } from "./industry.type";

// [POST] /api/v1/industries - Tạo ngành nghề mới
export const createIndustry = asyncHandler(async (req: Request, res: Response) => {
  const data = await industryService.create(req.body);

  return res
    .status(201)
    .json(ApiResponse.success(data, "Tạo ngành nghề thành công"));
});

// [GET] /api/v1/industries - Lấy danh sách ngành nghề (phân trang)
export const getIndustries = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeIndustryQuery(req.query);
  const result = await industryService.findAll(query);

  return res.status(200).json(ApiResponse.paginate(result));
});

// [GET] /api/v1/industries/:id - Lấy chi tiết ngành nghề
export const getIndustry = asyncHandler(async (req: Request, res: Response) => {
  const data = await industryService.findById(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(data));
});

// [PATCH] /api/v1/industries/:id - Cập nhật thông tin ngành nghề
export const updateIndustry = asyncHandler(async (req: Request, res: Response) => {
  const data = await industryService.update(req.params.id as unknown as number, req.body);

  return res.status(200).json(ApiResponse.success(data, "Cập nhật thành công"));
});

// [DELETE] /api/v1/industries/:id - Xóa mềm ngành nghề
export const deleteIndustry = asyncHandler(async (req: Request, res: Response) => {
  await industryService.delete(req.params.id as unknown as number);

  return res.status(200).json(ApiResponse.success(null, "Đã xóa ngành nghề"));
});
