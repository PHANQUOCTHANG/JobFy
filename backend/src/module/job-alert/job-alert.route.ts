import { Router } from "express";
import * as alertCtrl from "./job-alert.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { CreateJobAlertSchema, UpdateJobAlertSchema, UuidParamSchema, PaginationSchema } from "./job-alert.request";

const router = Router();

router.get(
  "/",
  validationMiddleware(PaginationSchema, "query"),
  alertCtrl.getAlerts
);

router.post(
  "/",
  validationMiddleware(CreateJobAlertSchema),
  alertCtrl.createAlert
);

router.patch(
  "/:id",
  validationMiddleware(UuidParamSchema, "params"),
  validationMiddleware(UpdateJobAlertSchema),
  alertCtrl.updateAlert
);

router.delete(
  "/:id",
  validationMiddleware(UuidParamSchema, "params"),
  alertCtrl.deleteAlert
);

router.patch(
  "/:id/toggle",
  validationMiddleware(UuidParamSchema, "params"),
  alertCtrl.toggleAlert
);

export default router;
