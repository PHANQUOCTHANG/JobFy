import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { jobService } from "@/config/container";
import { normalizeJobQuery } from "./job.type";

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await jobService.create(userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Tạo tin tuyển dụng thành công"));
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeJobQuery(req.query);
  const data = await jobService.findAll(query);
  return res.status(200).json(ApiResponse.paginate(data));
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const id = (req.params.id as string);
  jobService.incrementViewCount(id).catch(console.error);
  
  const data = await jobService.findById(id);
  return res.status(200).json(ApiResponse.success(data));
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await jobService.update((req.params.id as string), userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật tin tuyển dụng thành công"));
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await jobService.delete((req.params.id as string), userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa tin tuyển dụng"));
});
