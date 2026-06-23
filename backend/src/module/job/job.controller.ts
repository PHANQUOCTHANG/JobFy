import { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";
import { jobService } from "@/config/container";
import { normalizeJobQuery } from "./job.type";

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await jobService.create(userId, req.body);
  return res.status(201).json(ApiResponse.success(data, "Tạo tin tuyển dụng thành công"));
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const query = normalizeJobQuery(req.query);

  let isAdmin = false;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      if (decoded.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {}
  }

  if (!isAdmin) {
    query.status = "published";
  }

  const data = await jobService.findAll(query);
  return res.status(200).json(ApiResponse.paginate(data));
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await jobService.findById(id as string);
  
  if (data) {
    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        if (decoded.role === "admin") {
          isAdmin = true;
        }
      } catch (e) {}
    }

    if (!isAdmin && data.status !== "published") {
      // Allow candidates who already applied to view it? Maybe not strictly necessary right now.
      return res.status(404).json(ApiResponse.error("Không tìm thấy tin tuyển dụng", 404));
    }

    jobService.incrementViewCount(data.id as string).catch(console.error);
  }
  
  return res.status(200).json(ApiResponse.success(data));
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const data = await jobService.update((req.params.id as string), userId, req.body);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật tin tuyển dụng thành công"));
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await jobService.delete((req.params.id as string), userId);
  return res.status(200).json(ApiResponse.success(null, "Đã xóa tin tuyển dụng"));
});

export const adminUpdateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, rejectedReason } = req.body;
  const data = await jobService.adminUpdateStatus(req.params.id as string, status, rejectedReason);
  return res.status(200).json(ApiResponse.success(data, "Cập nhật trạng thái thành công"));
});

export const adminDeleteJob = asyncHandler(async (req: Request, res: Response) => {
  await jobService.adminDelete(req.params.id as string);
  return res.status(200).json(ApiResponse.success(null, "Admin đã xóa tin tuyển dụng"));
});
