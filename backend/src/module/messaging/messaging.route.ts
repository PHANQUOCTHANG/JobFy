import { Router } from "express";
import * as messagingCtrl from "./messaging.controller";
import validationMiddleware from "@/middleware/validate.middleware";
import { CreateConversationSchema, SendMessageSchema, UuidParamSchema, PaginationSchema } from "./messaging.request";

const router = Router();

router.get(
  "/",
  validationMiddleware(PaginationSchema, "query"),
  messagingCtrl.getConversations
);

router.post(
  "/",
  validationMiddleware(CreateConversationSchema),
  messagingCtrl.createConversation
);

router.get(
  "/:id/messages",
  validationMiddleware(UuidParamSchema, "params"),
  validationMiddleware(PaginationSchema, "query"),
  messagingCtrl.getMessages
);

router.post(
  "/:id/messages",
  validationMiddleware(UuidParamSchema, "params"),
  validationMiddleware(SendMessageSchema),
  messagingCtrl.sendMessage
);

router.patch(
  "/:id/read",
  validationMiddleware(UuidParamSchema, "params"),
  messagingCtrl.markAsRead
);

router.delete(
  "/:id",
  validationMiddleware(UuidParamSchema, "params"),
  messagingCtrl.archiveConversation
);

export default router;
