import { Router } from "express";
import * as resumeCtrl from "./resume.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateResumeSchema,
  UpdateResumeSchema,
  CreateResumeEducationSchema,
  UpdateResumeEducationSchema,
  CreateResumeExperienceSchema,
  UpdateResumeExperienceSchema,
  IdParamSchema,
  NestedIdParamSchema,
} from "./resume.request";

const router = Router();

// ================= Resume Base =================
router
  .route("/")
  .get(resumeCtrl.getResumes)
  .post(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(CreateResumeSchema),
    resumeCtrl.createResume
  );

router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    resumeCtrl.getResume
  )
  .patch(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateResumeSchema),
    resumeCtrl.updateResume
  )
  .delete(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(IdParamSchema, "params"),
    resumeCtrl.deleteResume
  );

// ================= Resume Education =================
router
  .route("/:id/educations")
  .post(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeEducationSchema),
    resumeCtrl.addEducation
  );

router
  .route("/:id/educations/:nestedId")
  .patch(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeEducationSchema),
    resumeCtrl.updateEducation
  )
  .delete(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteEducation
  );

// ================= Resume Experience =================
router
  .route("/:id/experiences")
  .post(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeExperienceSchema),
    resumeCtrl.addExperience
  );

router
  .route("/:id/experiences/:nestedId")
  .patch(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeExperienceSchema),
    resumeCtrl.updateExperience
  )
  .delete(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteExperience
  );

export default router;
