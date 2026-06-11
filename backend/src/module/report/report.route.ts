import { Router } from "express";
import * as reportCtrl from "./report.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { CreateReportSchema, UpdateReportStatusSchema, UuidParamSchema, ReportPaginationSchema } from "./report.request";

const router = Router();

// Public/User routes
router.post(
  "/",
  requireAuth,
  validationMiddleware(CreateReportSchema),
  reportCtrl.createReport
);

// Admin routes
router.get(
  "/",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(ReportPaginationSchema, "query"),
  reportCtrl.getReports
);

router.patch(
  "/:id/review",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(UuidParamSchema, "params"),
  validationMiddleware(UpdateReportStatusSchema),
  reportCtrl.updateReportStatus
);

export default router;
