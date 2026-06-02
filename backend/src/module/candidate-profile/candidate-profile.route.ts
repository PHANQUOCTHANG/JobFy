import { Router } from "express";
import * as profileCtrl from "./candidate-profile.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateCandidateProfileSchema,
  UpdateCandidateProfileSchema,
} from "./candidate-profile.request";
import { z } from "zod";

const router = Router();

const IdParamSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
});

// APIs dành riêng cho ứng viên quản lý hồ sơ cá nhân
router
  .route("/me")
  .get(requireAuth, requireRole("CANDIDATE"), profileCtrl.getMyProfile)
  .post(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(CreateCandidateProfileSchema),
    profileCtrl.createMyProfile
  )
  .patch(
    requireAuth,
    requireRole("CANDIDATE"),
    validationMiddleware(UpdateCandidateProfileSchema),
    profileCtrl.updateMyProfile
  );

// APIs công khai (lấy danh sách và chi tiết hồ sơ)
router.route("/").get(profileCtrl.getProfiles);

router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    profileCtrl.getProfileById
  );

export default router;
