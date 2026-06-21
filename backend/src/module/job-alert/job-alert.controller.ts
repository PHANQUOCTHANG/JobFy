import { Request, Response } from "express";
import { JobAlertService } from "./job-alert.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toJobAlertListResponse, toJobAlertResponse } from "./job-alert.response";

const alertService = new JobAlertService();

export const getAlerts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { page, limit } = req.query;
  const result = await alertService.getAlerts(userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toJobAlertListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const createAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const alert = await alertService.createAlert(userId, req.body);
  sendResponse(res, 201, "Job alert created", toJobAlertResponse(alert));
});

export const updateAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const alert = await alertService.updateAlert(id as string, userId, req.body);
  sendResponse(res, 200, "Job alert updated", toJobAlertResponse(alert));
});


export const deleteAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  await alertService.deleteAlert(id as string, userId);
  sendResponse(res, 200, "Job alert deleted");
});

export const toggleAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const alert = await alertService.toggleAlert(id as string, userId);
  sendResponse(res, 200, `Job alert ${alert.isActive ? 'enabled' : 'disabled'}`, toJobAlertResponse(alert));
});

