import { Router } from "express";
import * as aiController from "./ai.controller";
import { aiRateLimiter } from "./ai.middleware";

const router = Router();

// Áp dụng rate limiter cho tất cả AI routes
router.use(aiRateLimiter);

router.post("/cv/generate-summary", aiController.generateCvSummary);
router.post("/cv/review", aiController.reviewCv);
router.post("/cv/match-job", aiController.matchJob);
router.post("/cv/suggest-skills", aiController.suggestSkills);
router.post("/cover-letter/generate", aiController.generateCoverLetter);
router.post("/cv/generate-full", aiController.generateFullCv);

export default router;
