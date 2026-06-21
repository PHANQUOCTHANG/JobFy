import React from "react";
import { useRecruitmentHistory } from "@/features/employer/hooks/useCandidates";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface Props {
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  pending: { label: "Nộp hồ sơ", icon: "inbox", color: "text-amber-600", bgColor: "bg-amber-100" },
  reviewed: { label: "Đã xem hồ sơ", icon: "visibility", color: "text-indigo-600", bgColor: "bg-indigo-100" },
  interviewed: { label: "Hẹn phỏng vấn", icon: "event", color: "text-purple-600", bgColor: "bg-purple-100" },
  offered: { label: "Gửi đề nghị", icon: "handshake", color: "text-fuchsia-600", bgColor: "bg-fuchsia-100" },
  accepted: { label: "Đã nhận việc", icon: "check_circle", color: "text-emerald-600", bgColor: "bg-emerald-100" },
  rejected: { label: "Từ chối", icon: "cancel", color: "text-rose-600", bgColor: "bg-rose-100" },
};

export const RecruitmentHistoryModal: React.FC<Props> = ({ onClose }) => {
  const { data: history, isLoading } = useRecruitmentHistory();

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-200">
      <div className="bg-white w-[90%] max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Lịch sử tuyển dụng</h2>
            <p className="text-slate-500 text-sm mt-1">Các hoạt động cập nhật trạng thái gần đây nhất</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !history || history.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[40px]">history_toggle_off</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có lịch sử nào</h3>
              <p className="text-slate-500 text-[15px] max-w-sm mx-auto">
                Hệ thống sẽ ghi nhận lại mỗi khi bạn thay đổi trạng thái của bất kỳ ứng viên nào.
              </p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
              {history.map((app: any) => {
                const config = statusConfig[app.status] || statusConfig.pending;
                return (
                  <div key={app.id} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${config.bgColor}`}>
                      <span className={`material-symbols-outlined text-[14px] ${config.color}`}>{config.icon}</span>
                    </div>

                    {/* Content Card */}
                    <div className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl p-4 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-slate-400 text-sm font-medium">
                            {dayjs(app.reviewedAt || app.appliedAt).fromNow()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                          <img 
                            src={app.candidate?.user?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(app.candidate?.fullName || "User")} 
                            alt={app.candidate?.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-slate-800 font-medium">
                            <span className="font-bold text-blue-600">{app.candidate?.fullName}</span>
                          </p>
                          <p className="text-slate-500 text-sm mt-0.5">
                            Vị trí: <span className="font-medium text-slate-700">{app.job?.title}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
