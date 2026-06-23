import { Router } from "express";
import * as userCtrl from "./user.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireAuth, requireRole } from "@/middleware/auth.middleware";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UpdateMeSchema,
  IdParamSchema,
} from "./user.request";

const router = Router();

// [GET] danh sách & [POST] tạo user (chỉ ADMIN)
router
  .route("/")
  .get(requireAuth, requireRole("admin"), userCtrl.getUsers)
  .post(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(CreateUserSchema),
    userCtrl.createUser,
  );

// [PATCH] cập nhật cá nhân
router
  .route("/me")
  .patch(
    requireAuth,
    validationMiddleware(UpdateMeSchema),
    userCtrl.updateMe
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(requireAuth, requireRole("admin"), validationMiddleware(IdParamSchema, "params"), userCtrl.getUser)
  .patch(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateUserSchema),
    userCtrl.updateUser,
  )
  .delete(
    requireAuth,
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    userCtrl.deleteUser,
  );

export default router;
