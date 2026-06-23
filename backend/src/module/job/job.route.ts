import { Router } from "express";
import { z } from "zod";
import * as jobCtrl from "./job.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole, requireFullyVerified } from "@/middleware/auth.middleware";
import { CreateJobSchema, UpdateJobSchema, IdParamSchema } from "./job.request";

const router = Router();

router
  .route("/")
  .get(jobCtrl.getJobs);

router
  .route("/:id")
  .get(
    validationMiddleware(z.object({ id: z.string().min(1) }), "params"),
    jobCtrl.getJob
  );

// Admin-only: update any job status (moderate)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(IdParamSchema, "params"),
  jobCtrl.adminUpdateJobStatus
);

// Admin-only: force delete any job
router.delete(
  "/:id/force",
  requireAuth,
  requireRole("admin"),
  validationMiddleware(IdParamSchema, "params"),
  jobCtrl.adminDeleteJob
);

export default router;
