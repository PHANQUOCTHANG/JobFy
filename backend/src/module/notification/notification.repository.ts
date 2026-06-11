import prisma from "@/config/prisma";
import { CreateNotificationPayload, NotificationPaginationParams } from "./notification.type";

export class NotificationRepository {
  async createNotification(data: CreateNotificationPayload) {
    return await prisma.notification.create({
      data,
    });
  }

  async getUserNotifications(userId: string, params: NotificationPaginationParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (params.isRead !== undefined) {
      where.isRead = params.isRead;
    }

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async countUnread(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async findNotificationById(id: string) {
    return await prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string, userId: string) {
    return await prisma.notification.update({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async deleteNotification(id: string, userId: string) {
    return await prisma.notification.delete({
      where: { id, userId },
    });
  }
}
