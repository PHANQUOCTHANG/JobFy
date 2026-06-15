import { Request, Response } from "express";
import { SavedJobService } from "./saved-job.service";
import { ApiResponse } from "@/utils/apiResponse";
import asyncHandler from "@/utils/asyncHandler";
import { toSavedJobListResponse, toSavedJobResponse } from "./saved-job.response";

const savedJobService = new SavedJobService();

export const getSavedJobs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { page, limit } = req.query;
  const result = await savedJobService.getSavedJobs(userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  return res.status(200).json(ApiResponse.paginate({
    ...result,
    data: toSavedJobListResponse(result.data)
  }));
});

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const jobId = req.params.jobId as string;
  const saved = await savedJobService.saveJob(userId, jobId);
  return res.status(201).json(ApiResponse.success(null, "Job saved successfully"));
});

export const unsaveJob = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const jobId = req.params.jobId as string;
  await savedJobService.unsaveJob(userId, jobId);
  return res.status(200).json(ApiResponse.success(null, "Job removed from saved list"));
});

export const checkIsSaved = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const jobId = req.params.jobId as string;
  const result = await savedJobService.isSaved(userId, jobId);
  return res.status(200).json(ApiResponse.success(result, "Success"));
});
