import { Router } from "express";
import * as notificationCtrl from "./notification.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { UuidParamSchema, NotificationPaginationSchema } from "./notification.request";

const router = Router();

router.get(
  "/",
  validationMiddleware(NotificationPaginationSchema, "query"),
  notificationCtrl.getUserNotifications
);

router.get("/unread-count", notificationCtrl.getUnreadCount);
router.patch("/read-all", notificationCtrl.markAllAsRead);

router.patch(
  "/:id/read",
  validationMiddleware(UuidParamSchema, "params"),
  notificationCtrl.markAsRead
);

router.delete(
  "/:id",
  validationMiddleware(UuidParamSchema, "params"),
  notificationCtrl.deleteNotification
);

export default router;
