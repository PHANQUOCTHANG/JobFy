import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toAdminLogListResponse } from "./admin.response";

const adminService = new AdminService();

export const getLogs = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, action, adminId } = req.query;

  // Express typings allow ParsedQs; normalize to plain string for service layer.
  // Narrow ParsedQs | string | string[] to plain string at runtime.
  const normalizedAction = Array.isArray(action)
    ? action[0]
    : typeof action === "string"
      ? action
      : undefined;
  const normalizedAdminId = Array.isArray(adminId)
    ? adminId[0]
    : typeof adminId === "string"
      ? adminId
      : undefined;


  const result = await adminService.getLogs({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    action: normalizedAction as string | undefined,
    adminId: normalizedAdminId as string | undefined
  });




  sendResponse(res, 200, "Success", {
    data: toAdminLogListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  sendResponse(res, 200, "Success", stats);
});

export const getJobViewStats = catchAsync(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const normalizedJobId = Array.isArray(jobId) ? jobId[0] : jobId;
  if (!normalizedJobId) return res.status(400).json({ message: "Invalid jobId" });
  const stats = await adminService.getJobViewStats(normalizedJobId);
  sendResponse(res, 200, "Success", stats);
});

