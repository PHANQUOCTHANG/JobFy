import React from "react";
import { useCandidateAIInsights } from "../../hooks/useCandidates";
import { toast } from "sonner";

interface Props {
  filters: any;
  onOpenConversionReport?: () => void;
  onOpenHistory?: () => void;
}

export const CandidateAIInsights: React.FC<Props> = ({ filters, onOpenConversionReport, onOpenHistory }) => {
  const { data: aiData, isLoading, refetch, isFetching } = useCandidateAIInsights(filters);

  return (
    <div className="space-y-6">
      {/* AI Suggestions Box */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl border border-indigo-100 p-6 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.15)] group">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[20px] text-indigo-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="text-[15px] font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Gợi ý từ AI
            </h3>
          </div>
          
          {isLoading || isFetching ? (
            <div className="animate-pulse space-y-4 mb-6">
              <div className="h-4 bg-indigo-100 rounded w-full"></div>
              <div className="h-4 bg-indigo-100 rounded w-4/5"></div>
              <div className="space-y-3 mt-4">
                <div className="h-2 bg-indigo-100 rounded w-full"></div>
                <div className="h-2 bg-indigo-100 rounded w-full"></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[13.5px] text-[#475569] leading-relaxed font-medium mb-5">
                {aiData?.overview || "Dựa trên phân tích hàng trăm hồ sơ, đây là các tiêu chí quan trọng nhất cho vị trí của bạn."}
              </p>

              <div className="space-y-4 mb-6">
                {aiData?.skills?.map((skill: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[13px] font-bold text-[#0F172A] mb-1.5">
                      <span>{skill.name}</span>
                      <span className="text-emerald-500">{skill.percentage}</span>
                    </div>
                    <div className="h-1.5 bg-indigo-100/50 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${skill.match}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button 
            disabled={isFetching}
            onClick={() => {
              toast.promise(refetch(), {
                loading: 'Đang dùng AI để tối ưu hóa lại trọng số thuật toán...',
                success: 'Đã tối ưu hóa lại dựa trên dữ liệu mới nhất!',
                error: 'Có lỗi xảy ra khi phân tích'
              });
            }}
            className="w-full mt-4 py-2.5 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl text-[14px] hover:bg-indigo-50 hover:border-indigo-200 transition-colors disabled:opacity-50"
          >
            Điều chỉnh thuật toán
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl border border-[#F1F5F9] p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)]">
        <h3 className="font-bold text-[#0F172A] text-[16px] mb-4">Hành động nhanh</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-slate-100 rounded-2xl transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#00307c] transition-colors">mail</span>
              <span className="text-[14px] font-semibold text-[#334155] group-hover:text-[#00307c] transition-colors">Gửi thư mời hàng loạt</span>
            </div>
          </button>

          <button 
            onClick={onOpenHistory}
            className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-slate-100 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#00307c] transition-colors">history</span>
              <span className="text-[14px] font-semibold text-[#334155] group-hover:text-[#00307c] transition-colors">Lịch sử tuyển dụng</span>
            </div>
          </button>

          <button 
            onClick={onOpenConversionReport}
            className="w-full flex items-center justify-between p-3 bg-[#F8FAFC] hover:bg-slate-100 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#00307c] transition-colors">bar_chart</span>
              <span className="text-[14px] font-semibold text-[#334155] group-hover:text-[#00307c] transition-colors">Báo cáo chuyển đổi</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
