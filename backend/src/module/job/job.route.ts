import { Router } from "express";
import * as jobCtrl from "./job.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole, requireFullyVerified } from "@/middleware/auth.middleware";
import { CreateJobSchema, UpdateJobSchema, IdParamSchema } from "./job.request";

const router = Router();

router
  .route("/")
  .get(jobCtrl.getJobs)
  .post(
    requireAuth,
    requireRole("employer"),       // chỉ employer được đăng tin
    requireFullyVerified,           // phải hoàn tất 4 bước xác thực
    validationMiddleware(CreateJobSchema),
    jobCtrl.createJob
  );

router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    jobCtrl.getJob
  )
  .patch(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateJobSchema),
    jobCtrl.updateJob
  )
  .delete(
    requireAuth,
    requireRole("employer"),
    validationMiddleware(IdParamSchema, "params"),
    jobCtrl.deleteJob
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
