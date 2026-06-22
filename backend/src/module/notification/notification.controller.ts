import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { sendResponse } from "@/utils/sendResponse";
import { toNotificationListResponse, toNotificationResponse } from "./notification.response";
import asyncHandler from "@/utils/asyncHandler";

const notificationService = new NotificationService();

export const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { page, limit, isRead } = req.query;
  const result = await notificationService.getUserNotifications(userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    isRead: isRead !== undefined ? isRead === "true" : undefined
  });

  sendResponse(res, 200, "Success", {
    data: toNotificationListResponse(result.data),
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const count = await notificationService.getUnreadCount(userId);
  sendResponse(res, 200, "Success", { count });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const notification = await notificationService.markAsRead(id as string, userId);
  sendResponse(res, 200, "Notification marked as read", toNotificationResponse(notification));
});


export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await notificationService.markAllAsRead(userId);
  sendResponse(res, 200, `Marked ${result.count} notifications as read`);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  await notificationService.deleteNotification(id as string, userId);
  sendResponse(res, 200, "Notification deleted");
});

