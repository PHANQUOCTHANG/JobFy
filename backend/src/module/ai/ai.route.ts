import { Router } from "express";
import * as aiCtrl from "./ai.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import { GenerateJDSchema, GenerateQuestionsSchema } from "./ai.request";
import { uploadCvForAnalysis } from "@/middleware/upload.middleware";

const router = Router();

router.post(
  "/generate-jd",
  requireAuth,
  requireRole("EMPLOYER"),
  validationMiddleware(GenerateJDSchema),
  aiCtrl.generateJD
);

router.post(
  "/generate-questions",
  requireAuth,
  requireRole("EMPLOYER"),
  validationMiddleware(GenerateQuestionsSchema),
  aiCtrl.generateInterviewQuestions
);

router.post(
  "/analyze-cv",
  requireAuth,
  requireRole("EMPLOYER"),
  uploadCvForAnalysis,
  aiCtrl.analyzeCv
);

export default router;
