import { Request, Response } from "express";
import { SavedJobService } from "./saved-job.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toSavedJobListResponse, toSavedJobResponse } from "./saved-job.response";

const savedJobService = new SavedJobService();

export const getSavedJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { page, limit } = req.query;
  const result = await savedJobService.getSavedJobs(userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toSavedJobListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const getSavedJobIds = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await savedJobService.getSavedJobIds(userId);

  sendResponse(res, 200, "Success", result.data);
});

export const saveJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { jobId } = req.params;
  const saved = await savedJobService.saveJob(userId, jobId as string);
  sendResponse(res, 201, "Job saved successfully");
});

export const unsaveJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { jobId } = req.params;
  await savedJobService.unsaveJob(userId, jobId as string);
  sendResponse(res, 200, "Job removed from saved list");
});

export const checkIsSaved = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { jobId } = req.params;
  const result = await savedJobService.isSaved(userId, jobId as string);
  sendResponse(res, 200, "Success", result);
});
