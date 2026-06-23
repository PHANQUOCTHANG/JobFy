import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: notificationsData, isLoading } = useNotifications({ page: 1, limit: 20 });
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const navigate = useNavigate();

  const notifications = notificationsData?.data || [];

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Logic điều hướng dựa trên loại thông báo
    if (notification.type === 'APPLICATION_STATUS') {
      navigate('/applications');
    } else if (notification.type === 'NEW_JOB' && notification.refId) {
      navigate(`/jobs/${notification.refId}`);
    } else if (notification.type === 'MESSAGE' && notification.refId) {
      // Ví dụ chuyển tới trang chat
    }
    
    setOpen(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    }
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all mr-2">
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white border-[1.5px] border-white shadow-sm">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0 rounded-xl shadow-xl border border-slate-100 z-[4000]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white rounded-t-xl">
          <h3 className="font-bold text-[16px] text-slate-800">Thông báo</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-[13px] text-[#4F46E5] hover:text-[#4338CA] hover:underline font-medium"
            >
              Đánh dấu là đã đọc
            </button>
          )}
        </div>
        
        <ScrollArea className="h-[400px] bg-white rounded-b-xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-slate-500 text-[13px]">
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <Bell size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-500 text-[14px]">Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${
                    !notification.isRead ? 'bg-[#f4f5f5]' : 'bg-white'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <h4 className={`text-[14px] leading-tight mb-1 ${!notification.isRead ? 'font-bold text-slate-800' : 'font-semibold text-slate-700'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-[13px] text-slate-600 mb-1.5 line-clamp-2 leading-relaxed">
                        {notification.body}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
