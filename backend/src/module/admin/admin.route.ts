import { Router } from "express";
import * as adminCtrl from "./admin.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { AdminLogPaginationSchema, UuidParamSchema } from "./admin.request";

const router = Router();

// All routes require admin
router.use(requireAuth, requireRole("admin"));

router.get(
  "/logs",
  validationMiddleware(AdminLogPaginationSchema, "query"),
  adminCtrl.getLogs
);

router.get("/stats", adminCtrl.getDashboardStats);

router.get(
  "/job-views/:id",
  validationMiddleware(UuidParamSchema, "params"),
  adminCtrl.getJobViewStats
);

export default router;
