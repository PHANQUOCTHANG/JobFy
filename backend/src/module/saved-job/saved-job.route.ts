import { Router } from "express";
import * as savedJobCtrl from "./saved-job.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { JobIdParamSchema, SavedJobPaginationSchema } from "./saved-job.request";

const router = Router();

router.get(
  "/",
  validationMiddleware(SavedJobPaginationSchema, "query"),
  savedJobCtrl.getSavedJobs
);

router.post(
  "/:jobId",
  validationMiddleware(JobIdParamSchema, "params"),
  savedJobCtrl.saveJob
);

router.delete(
  "/:jobId",
  validationMiddleware(JobIdParamSchema, "params"),
  savedJobCtrl.unsaveJob
);

router.get(
  "/:jobId/check",
  validationMiddleware(JobIdParamSchema, "params"),
  savedJobCtrl.checkIsSaved
);

export default router;
