import { Router } from "express";
import * as applicationCtrl from "./application.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateApplicationSchema,
  UpdateApplicationStatusSchema,
  CreateApplicationNoteSchema,
  IdParamSchema
} from "./application.request";

const router = Router();

router
  .route("/")
  .get(requireAuth, applicationCtrl.getApplications)
  .post(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(CreateApplicationSchema),
    applicationCtrl.applyForJob
  );

router
  .route("/:id")
  .get(
    requireAuth,
    validationMiddleware(IdParamSchema, "params"),
    applicationCtrl.getApplication
  );

router
  .route("/:id/status")
  .patch(
    requireAuth,
    requireRole("EMPLOYER"), // only employer can update status
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateApplicationStatusSchema),
    applicationCtrl.updateApplicationStatus
  );

router
  .route("/:id/notes")
  .post(
    requireAuth,
    requireRole("EMPLOYER"), // only employer can add notes
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateApplicationNoteSchema),
    applicationCtrl.addNote
  );

export default router;
