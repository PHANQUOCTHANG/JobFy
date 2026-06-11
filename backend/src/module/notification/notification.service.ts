import { NotificationRepository } from "./notification.repository";
import { CreateNotificationPayload, NotificationPaginationParams } from "./notification.type";
import { NotFoundError, ForbiddenError } from "@/error/custom.error";

export class NotificationService {
  private repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
  }

  async createNotification(data: CreateNotificationPayload) {
    return await this.repository.createNotification(data);
  }

  async getUserNotifications(userId: string, params: NotificationPaginationParams) {
    return await this.repository.getUserNotifications(userId, params);
  }

  async getUnreadCount(userId: string) {
    return await this.repository.countUnread(userId);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.repository.findNotificationById(id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError("You are not allowed to update this notification");
    }
    return await this.repository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return await this.repository.markAllAsRead(userId);
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await this.repository.findNotificationById(id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError("You are not allowed to delete this notification");
    }
    return await this.repository.deleteNotification(id, userId);
  }
}
