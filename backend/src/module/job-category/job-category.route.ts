import { Router } from "express";
import * as jobCategoryCtrl from "./job-category.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateJobCategorySchema,
  UpdateJobCategorySchema,
  IdParamSchema,
} from "./job-category.request";

const router = Router();

// [GET] danh sách & [POST] tạo danh mục (chỉ ADMIN)
router
  .route("/")
  .get(jobCategoryCtrl.getJobCategories)
  .post(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(CreateJobCategorySchema),
    jobCategoryCtrl.createJobCategory,
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    jobCategoryCtrl.getJobCategory,
  )
  .patch(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateJobCategorySchema),
    jobCategoryCtrl.updateJobCategory,
  )
  .delete(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    jobCategoryCtrl.deleteJobCategory,
  );

export default router;
