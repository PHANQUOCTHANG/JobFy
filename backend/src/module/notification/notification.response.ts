import { INotification } from "./notification.type";

export const toNotificationResponse = (notification: INotification) => {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    isRead: notification.isRead,
    readAt: notification.readAt,
    refType: notification.refType,
    refId: notification.refId,
    data: notification.data,
    createdAt: notification.createdAt,
  };
};

export const toNotificationListResponse = (notifications: INotification[]) => {
  return notifications.map(toNotificationResponse);
};
