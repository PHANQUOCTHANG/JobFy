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
    requireRole("EMPLOYER"),       // chỉ employer được đăng tin
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
    requireRole("EMPLOYER"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateJobSchema),
    jobCtrl.updateJob
  )
  .delete(
    requireAuth,
    requireRole("EMPLOYER"),
    validationMiddleware(IdParamSchema, "params"),
    jobCtrl.deleteJob
  );

export default router;
