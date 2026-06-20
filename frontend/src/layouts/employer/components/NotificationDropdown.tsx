import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const NotificationDropdown = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications?limit=10");
      return res.data?.data || [];
    },
    refetchInterval: 30000,
  });

  // Fetch unread count
  const { data: unreadCountData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count");
      return res.data?.data?.count || 0;
    },
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = unreadCountData || 0;
  const notifications = notificationsData || [];

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) {
      markAsReadMutation.mutate(notif.id);
    }
    
    // Điều hướng dựa trên loại thông báo
    setIsOpen(false);
    if (notif.type === 'company_update') {
      navigate('/employer/settings');
    } else if (notif.type === 'application_update') {
      navigate('/employer/applications');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'company_update':
        return <span className="material-symbols-outlined text-blue-600">verified</span>;
      case 'application_update':
        return <span className="material-symbols-outlined text-emerald-600">assignment_ind</span>;
      case 'system':
        return <span className="material-symbols-outlined text-amber-600">info</span>;
      default:
        return <span className="material-symbols-outlined text-[#64748B]">notifications</span>;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative w-11 h-11 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-full transition-all duration-300 focus:outline-none"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[360px] md:w-[400px] max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-[#F1F5F9] bg-white mt-2" align="end" sideOffset={12}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <h3 className="text-[16px] font-black text-[#0F172A]">Thông báo</h3>
          {unreadCount > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsReadMutation.mutate();
              }}
              className="text-[13px] font-bold text-[#00307c] hover:text-[#0052cc] hover:underline transition-all"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar max-h-[450px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <span className="material-symbols-outlined animate-spin text-[#94A3B8] text-[32px]">refresh</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] px-8 text-center">
              <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">notifications_off</span>
              </div>
              <p className="text-[15px] font-bold text-[#475569]">Bạn chưa có thông báo nào</p>
              <p className="text-[13.5px] font-medium text-[#94A3B8] mt-1.5 leading-relaxed">Khi có thông báo về xác thực công ty hoặc ứng viên ứng tuyển, chúng sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif: any) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer flex gap-3.5 ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-blue-100/80 border border-blue-200' : 'bg-[#F1F5F9] border border-[#E2E8F0]'}`}>
                    {getIconForType(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] leading-snug mb-1 ${!notif.isRead ? 'font-black text-[#0F172A]' : 'font-bold text-[#475569]'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[13.5px] font-medium text-[#64748B] line-clamp-2 mb-2 leading-relaxed">
                      {notif.body}
                    </p>
                    <p className="text-[11.5px] font-bold text-[#94A3B8] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px]">schedule</span>
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00307c] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(0,48,124,0.5)]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-[#F1F5F9] bg-[#F8FAFC] text-center">
            <button className="text-[14px] font-black text-[#00307c] hover:text-[#0052cc] hover:underline w-full py-2 transition-all">
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
