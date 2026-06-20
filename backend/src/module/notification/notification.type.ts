import { Notification, NotificationType } from "@prisma/client";

export interface INotification extends Notification {}

export type CreateNotificationPayload = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  refType?: string;
  refId?: string;
  data?: any;
};

export interface NotificationPaginationParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}
