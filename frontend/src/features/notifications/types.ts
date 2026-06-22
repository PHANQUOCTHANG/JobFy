export type NotificationType = 
  | 'SYSTEM'
  | 'JOB_MATCH'
  | 'APPLICATION_STATUS'
  | 'NEW_JOB'
  | 'COMPANY_UPDATE'
  | 'MESSAGE';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  refType: string | null;
  refId: string | null;
  data: any | null;
  isRead: boolean;
  readAt: string | null;
  isSentEmail: boolean;
  isSentPush: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
