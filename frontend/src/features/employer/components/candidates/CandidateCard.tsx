import React from "react";
import { CandidateItem } from "../../hooks/useCandidates";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Props {
  candidate: CandidateItem;
  onUpdateStatus: (id: string, status: string) => void;
  onViewDetail: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isUpdating: boolean;
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Mới nộp", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "Đang xem xét", color: "bg-amber-100 text-amber-700" },
  interviewed: { label: "Hẹn phỏng vấn", color: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Từ chối", color: "bg-rose-100 text-rose-700" },
};

export const CandidateCard: React.FC<Props> = ({ 
  candidate, 
  onUpdateStatus, 
  onViewDetail, 
  isSelected, 
  onToggleSelect, 
  isUpdating 
}) => {
  const { id, status, appliedAt, jobTitle } = candidate;
  const { fullName, avatarUrl, experienceLevel, latestExperience, skills, expectedSalaryMin, expectedSalaryMax } = candidate.candidate;

  const statusInfo = statusMap[status] || { label: "Khác", color: "bg-gray-100 text-gray-700" };
  const timeAgo = formatDistanceToNow(new Date(appliedAt), { addSuffix: true, locale: vi });

  // Mock AI Score for now (random between 70 and 98)
  const aiScore = React.useMemo(() => Math.floor(Math.random() * (98 - 70 + 1) + 70), [id]);
  const scoreColor = aiScore >= 90 ? "text-emerald-500 border-emerald-500" : aiScore >= 80 ? "text-blue-500 border-blue-500" : "text-amber-500 border-amber-500";
  const scoreText = aiScore >= 90 ? "Rất cao" : aiScore >= 80 ? "Khá tốt" : "Phù hợp";

  return (
    <div className={cn("bg-white rounded-3xl p-6 border transition-all hover:shadow-[0_8px_30px_-12px_rgba(0,48,124,0.12)] relative", isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-[#F1F5F9]')}>
      {/* Checkbox */}
      {onToggleSelect && (
        <div className="absolute top-6 right-6 z-10">
          <input 
            type="checkbox" 
            checked={isSelected || false}
            onChange={() => onToggleSelect(id)}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4 pr-8">
        {/* Avatar & Info */}
        <div className="flex gap-4">
          <div className="relative">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=00307c&color=fff`} 
              alt={fullName} 
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[17px] font-bold text-[#0F172A]">{fullName}</h3>
              <span className={cn("px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider", statusInfo.color)}>
                {statusInfo.label}
              </span>
              <span className="text-[#94A3B8] text-[13px] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">history</span>
                {timeAgo}
              </span>
            </div>
            <p className="text-[#475569] text-[15px] font-medium mb-3">Ứng tuyển: <span className="text-[#0F172A] font-semibold">{jobTitle}</span></p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[#64748B] mb-4">
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                <span className="material-symbols-outlined text-[16px]">work</span>
                {experienceLevel || "Chưa cập nhật"}
              </div>
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                {expectedSalaryMin ? `${expectedSalaryMin} - ${expectedSalaryMax} Tr` : "Thỏa thuận"}
              </div>
              {latestExperience && (
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                  {latestExperience.jobTitle} tại {latestExperience.companyName}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-[#00307c] rounded-lg text-[12px] font-bold">
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] rounded-lg text-[12px] font-bold">
                  +{skills.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Score */}
        <div className="flex flex-col items-center">
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-full border-[3px] font-black text-lg shadow-sm bg-white mb-1", scoreColor)}>
            {aiScore}<span className="text-[12px]">%</span>
          </div>
          <span className={cn("text-[11px] font-bold uppercase", scoreColor.split(' ')[0])}>
            Điểm AI
          </span>
          <span className="text-[#64748B] text-[11px] font-bold">{scoreText}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-5 border-t border-[#F1F5F9] flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetail(id)}
            className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
            title="Xem CV"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Lưu hồ sơ">
            <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
          </button>
        </div>
        
        <div className="flex gap-3">
          <button 
            disabled={isUpdating || status === 'rejected'}
            onClick={() => onUpdateStatus(id, 'rejected')}
            className="px-4 py-2 text-[14px] font-bold text-[#475569] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] rounded-xl transition-all disabled:opacity-50"
          >
            Từ chối
          </button>
          <button 
            disabled={isUpdating || status === 'interviewed'}
            onClick={() => onUpdateStatus(id, 'interviewed')}
            className="px-5 py-2 text-[14px] font-bold text-white bg-[#00307c] hover:bg-[#002568] rounded-xl transition-all shadow-[0_4px_12px_rgba(0,48,124,0.2)] hover:shadow-[0_6px_16px_rgba(0,48,124,0.3)] disabled:opacity-70 disabled:shadow-none"
          >
            Hẹn phỏng vấn
          </button>
        </div>
      </div>
    </div>
  );
};
