import { Router } from "express";
import * as resumeCtrl from "./resume.controller";
import { uploadCvFile } from "@/middleware/upload.middleware";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateResumeSchema,
  UpdateResumeSchema,
  CreateResumeEducationSchema,
  UpdateResumeEducationSchema,
  CreateResumeExperienceSchema,
  UpdateResumeExperienceSchema,
  CreateResumeSkillSchema,
  UpdateResumeSkillSchema,
  CreateResumeCertificationSchema,
  UpdateResumeCertificationSchema,
  CreateResumeProjectSchema,
  UpdateResumeProjectSchema,
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
    requireRole("candidate"),
    validationMiddleware(CreateResumeSchema),
    resumeCtrl.createResume
  );

// ================= Resume Upload =================
router
  .route("/upload")
  .post(
    requireAuth,
    requireRole("candidate"),
    uploadCvFile,
    resumeCtrl.uploadCvPdf
  );

router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    resumeCtrl.getResume
  )
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateResumeSchema),
    resumeCtrl.updateResume
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    resumeCtrl.deleteResume
  );

// ================= Resume Education =================
router
  .route("/:id/educations")
  .post(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeEducationSchema),
    resumeCtrl.addEducation
  );

router
  .route("/:id/educations/:nestedId")
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeEducationSchema),
    resumeCtrl.updateEducation
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteEducation
  );

// ================= Resume Experience =================
router
  .route("/:id/experiences")
  .post(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeExperienceSchema),
    resumeCtrl.addExperience
  );

router
  .route("/:id/experiences/:nestedId")
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeExperienceSchema),
    resumeCtrl.updateExperience
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteExperience
  );

// ================= Resume Skill =================
router
  .route("/:id/skills")
  .post(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeSkillSchema),
    resumeCtrl.addSkill
  );

router
  .route("/:id/skills/:nestedId")
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeSkillSchema),
    resumeCtrl.updateSkill
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteSkill
  );

// ================= Resume Certification =================
router
  .route("/:id/certifications")
  .post(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeCertificationSchema),
    resumeCtrl.addCertification
  );

router
  .route("/:id/certifications/:nestedId")
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeCertificationSchema),
    resumeCtrl.updateCertification
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteCertification
  );

// ================= Resume Project =================
router
  .route("/:id/projects")
  .post(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(CreateResumeProjectSchema),
    resumeCtrl.addProject
  );

router
  .route("/:id/projects/:nestedId")
  .patch(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    validationMiddleware(UpdateResumeProjectSchema),
    resumeCtrl.updateProject
  )
  .delete(
    requireAuth,
    requireRole("candidate"),
    validationMiddleware(NestedIdParamSchema, "params"),
    resumeCtrl.deleteProject
  );

export default router;
