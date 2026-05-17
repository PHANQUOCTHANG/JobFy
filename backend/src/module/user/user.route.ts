import { Router } from "express";
import * as userCtrl from "./user.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { requireRole } from "@/middleware/auth.middleware";
import {
  CreateUserSchema,
  UpdateUserSchema,
  IdParamSchema,
} from "./user.request";

const router = Router();

// [GET] danh sách & [POST] tạo user (chỉ ADMIN)
router
  .route("/")
  .get(requireRole("admin"), userCtrl.getUsers)
  .post(
    requireRole("admin"),
    validationMiddleware(CreateUserSchema),
    userCtrl.createUser,
  );

// [GET] chi tiết & [PATCH] cập nhật & [DELETE] xóa (chỉ ADMIN)
router
  .route("/:id")
  .get(requireRole("admin"), validationMiddleware(IdParamSchema, "params"), userCtrl.getUser)
  .patch(
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    validationMiddleware(UpdateUserSchema),
    userCtrl.updateUser,
  )
  .delete(
    requireRole("admin"),
    validationMiddleware(IdParamSchema, "params"),
    userCtrl.deleteUser,
  );

export default router;
