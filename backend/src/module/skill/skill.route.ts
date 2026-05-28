import { Router } from "express";
import * as skillCtrl from "./skill.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateSkillSchema,
  UpdateSkillSchema,
  IdParamSchema,
} from "./skill.request";

const router = Router();

// [GET] danh sách & [POST] tạo kỹ năng (chỉ ADMIN)
router
  .route("/")
  .get(skillCtrl.getSkills)
  .post(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(CreateSkillSchema),
    skillCtrl.createSkill,
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    skillCtrl.getSkill,
  )
  .patch(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateSkillSchema),
    skillCtrl.updateSkill,
  )
  .delete(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    skillCtrl.deleteSkill,
  );

export default router;
