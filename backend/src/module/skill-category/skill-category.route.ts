import { Router } from "express";
import * as categoryCtrl from "./skill-category.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateSkillCategorySchema,
  UpdateSkillCategorySchema,
  IdParamSchema,
} from "./skill-category.request";

const router = Router();

// [GET] danh sách & [POST] tạo nhóm kỹ năng (chỉ ADMIN)
router
  .route("/")
  .get(categoryCtrl.getSkillCategories)
  .post(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(CreateSkillCategorySchema),
    categoryCtrl.createSkillCategory,
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    categoryCtrl.getSkillCategory,
  )
  .patch(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateSkillCategorySchema),
    categoryCtrl.updateSkillCategory,
  )
  .delete(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    categoryCtrl.deleteSkillCategory,
  );

export default router;
