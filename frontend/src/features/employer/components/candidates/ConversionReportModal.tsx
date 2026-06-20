import React from "react";
import { useConversionReport } from "@/features/employer/hooks/useCandidates";

interface Props {
  onClose: () => void;
}

export const ConversionReportModal: React.FC<Props> = ({ onClose }) => {
  const { data, isLoading } = useConversionReport();

  if (isLoading || !data) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { total, pending, reviewed, interviewed, offered, accepted, rejected } = data;

  // Tính tỷ lệ phễu so với mốc lớn nhất (Total)
  const getPercent = (value: number) => total > 0 ? Math.round((value / total) * 100) : 0;

  const funnelSteps = [
    { label: "Tổng CV nhận được", value: total, percent: 100, color: "bg-blue-600" },
    { label: "Đã xem xét", value: reviewed + interviewed + offered + accepted + rejected, percent: getPercent(reviewed + interviewed + offered + accepted + rejected), color: "bg-indigo-500" },
    { label: "Mời phỏng vấn", value: interviewed + offered + accepted, percent: getPercent(interviewed + offered + accepted), color: "bg-purple-500" },
    { label: "Đề nghị nhận việc", value: offered + accepted, percent: getPercent(offered + accepted), color: "bg-fuchsia-500" },
    { label: "Nhận việc", value: accepted, percent: getPercent(accepted), color: "bg-emerald-500" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center animate-in fade-in duration-200">
      <div className="bg-white w-[95%] max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Báo cáo chuyển đổi</h2>
            <p className="text-[#64748B] text-[15px] font-medium mt-1">Thống kê hiệu quả tuyển dụng trên toàn bộ hệ thống</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto">
          {total === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[48px]">monitoring</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có dữ liệu thống kê</h3>
              <p className="text-slate-500 text-[15px] max-w-md mx-auto">
                Hệ thống cần ít nhất 1 hồ sơ ứng viên để có thể vẽ biểu đồ chuyển đổi. Hãy bắt đầu bằng việc đăng một tin tuyển dụng mới!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Funnel Chart */}
              <div className="flex flex-col gap-4">
                {funnelSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-slate-700">{step.label}</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 text-lg">{step.value}</span>
                        <span className="text-slate-400 text-sm ml-1">ứng viên</span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="h-10 bg-slate-100 rounded-xl overflow-hidden w-full relative">
                      <div 
                        className={`h-full ${step.color} rounded-xl transition-all duration-1000 ease-out flex items-center px-4`}
                        style={{ width: `${Math.max(step.percent, 5)}%` }} // Ít nhất 5% để thấy được thanh màu
                      >
                        {step.percent > 10 && (
                          <span className="text-white font-bold text-sm">{step.percent}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng nộp</p>
                  <p className="text-2xl font-black text-slate-800">{total}</p>
                </div>
                <div className="text-center border-l border-slate-200">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Đang chờ</p>
                  <p className="text-2xl font-black text-amber-500">{pending}</p>
                </div>
                <div className="text-center border-l border-slate-200">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Đã từ chối</p>
                  <p className="text-2xl font-black text-rose-500">{rejected}</p>
                </div>
                <div className="text-center border-l border-slate-200">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tỉ lệ chốt</p>
                  <p className="text-2xl font-black text-emerald-500">{getPercent(accepted)}%</p>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
