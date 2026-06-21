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
  const { days } = req.query;
  const daysNum = days ? Number(days) : 7;
  const stats = await adminService.getDashboardStats(daysNum);
  sendResponse(res, 200, "Success", stats);
});

export const getJobViewStats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const stats = await adminService.getJobViewStats(String(id));
  sendResponse(res, 200, "Success", stats);
});

