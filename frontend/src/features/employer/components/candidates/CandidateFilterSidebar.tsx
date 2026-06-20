import React from "react";
import { useEmployerJobsDropdown } from "../../hooks/useCandidates";

interface Props {
  filters: {
    keyword: string;
    experience: string[];
    status: string;
    jobId: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export const CandidateFilterSidebar: React.FC<Props> = ({ filters, setFilters }) => {
  const { data: jobs, isLoading: isJobsLoading } = useEmployerJobsDropdown();

  const handleExperienceChange = (value: string) => {
    const newExp = filters.experience.includes(value)
      ? filters.experience.filter((e) => e !== value)
      : [...filters.experience, value];
    setFilters({ ...filters, experience: newExp });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#F1F5F9] p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] h-max sticky top-24">
      <div className="flex justify-between items-center mb-6 border-b border-[#F1F5F9] pb-4">
        <h3 className="font-bold text-[#0F172A] text-lg">Bộ lọc nâng cao</h3>
        <button 
          onClick={() => setFilters({ keyword: "", experience: [], status: "", jobId: "" })}
          className="text-[#00307c] text-[13px] font-bold hover:underline"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-6">
        {/* Job Filter */}
        <div className="space-y-3">
          <label className="text-[12px] font-black uppercase text-[#94A3B8] tracking-widest">Chiến dịch tuyển dụng</label>
          <select 
            value={filters.jobId}
            onChange={(e) => setFilters({...filters, jobId: e.target.value})}
            className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-4 py-3 text-[14px] font-bold text-[#00307c] focus:outline-none focus:ring-2 focus:ring-[#00307c]/20 focus:border-[#00307c]"
          >
            <option value="">Tất cả tin tuyển dụng</option>
            {isJobsLoading ? (
              <option disabled>Đang tải danh sách...</option>
            ) : (
              jobs?.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} {job.status === 'closed' ? '(Đã đóng)' : ''}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <label className="text-[12px] font-black uppercase text-[#94A3B8] tracking-widest">Trạng thái hồ sơ</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#00307c]/20 focus:border-[#00307c]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Mới nộp (Pending)</option>
            <option value="reviewing">Đang xem xét</option>
            <option value="interviewed">Đã phỏng vấn</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <label className="text-[12px] font-black uppercase text-[#94A3B8] tracking-widest">Kinh nghiệm</label>
          <div className="space-y-2.5">
            {[
              { id: "fresher", label: "Dưới 1 năm" },
              { id: "junior", label: "1 - 3 năm" },
              { id: "mid", label: "3 - 5 năm" },
              { id: "senior", label: "Trên 5 năm" },
            ].map((exp) => (
              <label key={exp.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[#CBD5E1] rounded-[6px] checked:bg-[#00307c] checked:border-[#00307c] transition-colors cursor-pointer"
                    checked={filters.experience.includes(exp.id)}
                    onChange={() => handleExperienceChange(exp.id)}
                  />
                  <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity font-bold">
                    check
                  </span>
                </div>
                <span className="text-[14.5px] font-semibold text-[#475569] group-hover:text-[#0F172A] transition-colors">
                  {exp.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Mock other filters */}
        <div className="space-y-3 opacity-60 cursor-not-allowed">
          <label className="text-[12px] font-black uppercase text-[#94A3B8] tracking-widest">Khu vực</label>
          <select disabled className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-[14px] font-semibold text-[#0F172A] cursor-not-allowed">
            <option>Tất cả khu vực</option>
          </select>
        </div>
      </div>
    </div>
  );
};
