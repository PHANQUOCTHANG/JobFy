import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { applicationService } from "@/config/container";
import { normalizeApplicationQuery } from "./application.type";

export const applyForJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await applicationService.apply(userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Nộp đơn ứng tuyển thành công"));
});

export const getApplications = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeApplicationQuery(req.query);
  const data = await applicationService.findAll(query);
  return res.status(200).json(ApiResponse.paginate(data));
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const data = await applicationService.findById(req.params.id);
  return res.status(200).json(ApiResponse.success(data));
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await applicationService.updateStatus(req.params.id, userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật trạng thái thành công"));
});

export const addNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await applicationService.addNote(req.params.id, userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Đã thêm ghi chú"));
});
