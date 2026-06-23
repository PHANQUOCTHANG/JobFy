import api from '@/lib/axios';
import { NotificationResponse } from '../types';

export const getNotifications = async (params?: { page?: number, limit?: number }): Promise<NotificationResponse> => {
  const response = await api.get('/notifications', { params });
  
  const rawData = response.data?.data || response.data || [];
  
  if (rawData && typeof rawData === 'object' && !Array.isArray(rawData) && rawData.data) {
    return {
      data: Array.isArray(rawData.data) ? rawData.data : [],
      meta: rawData.meta || { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }

  if (Array.isArray(rawData)) {
    return {
      data: rawData,
      meta: response.data?.meta || { total: rawData.length, page: 1, limit: 10, totalPages: 1 },
    };
  }

  return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data?.data || response.data || 0;
};

export const markAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};
