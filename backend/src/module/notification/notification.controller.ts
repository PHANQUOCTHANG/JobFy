import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { sendResponse } from "@/utils/sendResponse";
import { toNotificationListResponse, toNotificationResponse } from "./notification.response";
import { catchAsync } from "@/utils/catchAsync";

const notificationService = new NotificationService();

export const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
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

export const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const count = await notificationService.getUnreadCount(userId);
  sendResponse(res, 200, "Success", { count });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const notificationId = Array.isArray(id) ? id[0] : id;
  if (!notificationId) return res.status(400).json({ message: "Invalid id" });
  const notification = await notificationService.markAsRead(notificationId, userId);
  sendResponse(res, 200, "Notification marked as read", toNotificationResponse(notification));
});


export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const result = await notificationService.markAllAsRead(userId);
  sendResponse(res, 200, `Marked ${result.count} notifications as read`);
});

export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const notificationId = Array.isArray(id) ? id[0] : id;
  if (!notificationId) return res.status(400).json({ message: "Invalid id" });
  await notificationService.deleteNotification(notificationId, userId);
  sendResponse(res, 200, "Notification deleted");
});

