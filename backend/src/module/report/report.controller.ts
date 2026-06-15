import { Request, Response } from "express";
import { ReportService } from "./report.service";
import { sendResponse } from "@/utils/sendResponse";
import { catchAsync } from "@/utils/catchAsync";
import { toReportListResponse, toReportResponse } from "./report.response";

const reportService = new ReportService();

export const createReport = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const report = await reportService.createReport({
    ...req.body,
    reporterId: userId
  });
  sendResponse(res, 201, "Report submitted successfully", toReportResponse(report));
});

export const getReports = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, status, refType } = req.query;
  const result = await reportService.getReports({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    status: status as any,
    refType: refType as string
  });

  sendResponse(res, 200, "Success", {
    data: toReportListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user?.id;
  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const reportId = Array.isArray(id) ? id[0] : id;
  if (!reportId) return res.status(400).json({ message: "Invalid id" });
  const report = await reportService.updateReportStatus(reportId, {

    ...req.body,
    reviewedBy: adminId
  });
  
  sendResponse(res, 200, "Report updated", toReportResponse(report));
});
