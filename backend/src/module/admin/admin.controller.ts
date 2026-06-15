import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toAdminLogListResponse } from "./admin.response";

const adminService = new AdminService();

export const getLogs = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, action, adminId } = req.query;
  const result = await adminService.getLogs({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    action: action as string,
    adminId: adminId as string
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
  const { id } = req.params;
  const stats = await adminService.getJobViewStats(String(id));
  sendResponse(res, 200, "Success", stats);
});
