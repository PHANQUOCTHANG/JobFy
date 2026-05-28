import { Router } from "express";
import * as industryCtrl from "./industry.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateIndustrySchema,
  UpdateIndustrySchema,
  IdParamSchema,
} from "./industry.request";

const router = Router();

// [GET] danh sách & [POST] tạo ngành nghề (chỉ ADMIN)
router
  .route("/")
  .get(industryCtrl.getIndustries)
  .post(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(CreateIndustrySchema),
    industryCtrl.createIndustry,
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(
    validationMiddleware(IdParamSchema, "params"),
    industryCtrl.getIndustry,
  )
  .patch(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateIndustrySchema),
    industryCtrl.updateIndustry,
  )
  .delete(
    requireAuth,
    requireRole("ADMIN"),
    validationMiddleware(IdParamSchema, "params"),
    industryCtrl.deleteIndustry,
  );

export default router;
