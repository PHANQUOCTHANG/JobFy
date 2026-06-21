import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";
import {
  useCandidates,
  useCandidateAIInsights,
  useEmployerJobsDropdown,
  type CandidateQuery,
} from "@/features/employer/hooks/useCandidates";

const ManageApplicationsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CandidateQuery>({ page: 1, limit: 20 });

  const { data: candidatesData, isLoading: isCandidatesLoading } = useCandidates(filters);
  const { data: aiData, isLoading: isAILoading } = useCandidateAIInsights(filters);
  const { data: jobsDropdown } = useEmployerJobsDropdown();

  const candidates = candidatesData?.data ?? [];
  const totalCandidates = candidatesData?.pagination?.total ?? 0;

  const goToCandidate = (id: string) => {
    navigate(`/employer/${EMPLOYER_PATHS.CANDIDATE_DETAIL(id)}`);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    reviewing: "bg-blue-100 text-blue-800 border-blue-200",
    interview: "bg-indigo-100 text-indigo-800 border-indigo-200",
    accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const statusLabels: Record<string, string> = {
    pending: "Chờ xem xét",
    reviewing: "Đang xét",
    interview: "Phỏng vấn",
    accepted: "Đã nhận",
    rejected: "Từ chối",
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 md:p-8 gap-6">
      {/* Filters Sidebar (Left) */}
      <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 hidden lg:flex">
        <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-black text-[#0F172A]">Bộ lọc nâng cao</h3>
            <button
              onClick={() => setFilters({ page: 1, limit: 20 })}
              className="text-[#00307c] text-[12px] font-bold hover:underline"
            >
              Xoá tất cả
            </button>
          </div>

          {/* Status filter */}
          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Trạng thái</p>
            <div className="space-y-2.5">
              {Object.entries(statusLabels).map(([val, label]) => (
                <label key={val} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="status"
                    value={val}
                    checked={filters.status === val}
                    onChange={() => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]"
                  />
                  <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">{label}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={!filters.status}
                  onChange={() => setFilters(prev => ({ ...prev, status: undefined, page: 1 }))}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]"
                />
                <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">Tất cả</span>
              </label>
            </div>
          </div>

          {/* Keyword search */}
          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Tìm kiếm</p>
            <input
              type="text"
              placeholder="Tên, vị trí, kỹ năng..."
              value={filters.keyword ?? ""}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value || undefined, page: 1 }))}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] p-2.5 focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all"
            />
          </div>
        </div>
      </aside>

      {/* Candidate List Canvas (Center) */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Danh sách ứng viên</h2>
            <span className="bg-blue-50 text-[#00307c] px-3 py-1.5 rounded-full text-[12px] font-black border border-blue-100 shadow-sm">
              {isCandidatesLoading ? "..." : `${totalCandidates} Ứng viên`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Job filter */}
            <select
              className="border-2 border-[#E2E8F0] bg-white px-3 py-1.5 rounded-xl text-[13px] font-bold text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#00307c]/20"
              value={filters.jobId ?? ""}
              onChange={(e) => setFilters(prev => ({ ...prev, jobId: e.target.value || undefined, page: 1 }))}
            >
              <option value="">Tất cả tin đăng</option>
              {(jobsDropdown ?? []).map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            <button className="flex items-center gap-1.5 border-2 border-[#E2E8F0] bg-white px-3 py-1.5 rounded-xl text-[13px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* List Container */}
        <div className="flex flex-col gap-5 pb-8">
          {isCandidatesLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-[#F1F5F9] rounded-3xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-3 bg-slate-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#94A3B8]">
              <span className="material-symbols-outlined text-[48px] mb-3">person_search</span>
              <p className="text-[15px] font-bold">Chưa có ứng viên nào</p>
              <p className="text-[13px]">Thay đổi bộ lọc hoặc đợi ứng viên nộp hồ sơ</p>
            </div>
          ) : (
            candidates.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#F1F5F9] rounded-3xl p-5 flex items-start gap-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all group relative overflow-hidden cursor-pointer"
                onClick={() => goToCandidate(item.id)}
              >
                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#00307c] to-[#0047b3] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                {/* Avatar */}
                <div className="relative flex-shrink-0 ml-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center border-2 border-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]">
                    {item.candidate.avatarUrl ? (
                      <img src={item.candidate.avatarUrl} alt={item.candidate.fullName} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <span className="text-2xl font-black text-indigo-400">
                        {item.candidate.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-black text-[#0F172A] group-hover:text-[#00307c] transition-colors">
                      {item.candidate.fullName}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border flex-shrink-0 ${statusColors[item.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {statusLabels[item.status] ?? item.status}
                    </span>
                    <span className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">history</span>
                      {new Date(item.appliedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-[#475569] mb-3">{item.jobTitle}</p>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {item.candidate.experienceLevel && (
                      <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                        <span className="material-symbols-outlined text-[14px]">work</span>
                        {item.candidate.experienceLevel}
                      </span>
                    )}
                    {item.candidate.expectedSalaryMin != null && (
                      <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                        <span className="material-symbols-outlined text-[14px]">payments</span>
                        {Math.round(item.candidate.expectedSalaryMin / 1_000_000)}–{Math.round((item.candidate.expectedSalaryMax ?? item.candidate.expectedSalaryMin) / 1_000_000)}Tr
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(item.candidate.skills ?? []).slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[11px] font-bold text-[#00307c] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{sk}</span>
                      ))}
                      {(item.candidate.skills ?? []).length > 3 && (
                        <span className="text-[11px] font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">+{(item.candidate.skills ?? []).length - 3}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button className="px-3.5 py-1.5 text-[12px] font-bold text-[#475569] bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-all">Từ chối</button>
                      <button
                        onClick={() => goToCandidate(item.id)}
                        className="px-3.5 py-1.5 text-[12px] font-bold bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl shadow-[0_4px_12px_-4px_rgba(0,48,124,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(0,48,124,0.5)] hover:-translate-y-0.5 transition-all"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Utility Panel — AI Insights (DYNAMIC) */}
      <aside className="w-full lg:w-72 flex-shrink-0 flex-col gap-6 hidden xl:flex">
        {/* AI Insight Widget */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 p-5 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.05)] flex flex-col group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h3 className="text-[14px] font-black uppercase tracking-wider">Gợi ý từ AI</h3>
            </div>

            {isAILoading ? (
              <div className="animate-pulse space-y-3 mb-4">
                <div className="h-3 bg-indigo-100 rounded w-full" />
                <div className="h-3 bg-indigo-100 rounded w-4/5" />
                <div className="h-3 bg-indigo-100 rounded w-3/4" />
              </div>
            ) : (
              <>
                <p className="text-[13px] font-medium text-[#64748B] leading-relaxed mb-4">
                  {aiData?.overview ?? "Đang phân tích hồ sơ ứng viên. Vui lòng đảm bảo có ứng viên nộp hồ sơ để AI học."}
                </p>
                <div className="space-y-4">
                  {(aiData?.skills ?? []).slice(0, 4).map((skill: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                        <span className="text-[#0F172A]">{skill.name}</span>
                        <span className="text-emerald-600">{skill.percentage}</span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-700"
                          style={{ width: `${skill.match ?? 50}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {(!aiData?.skills || aiData.skills.length === 0) && (
                    <p className="text-[12px] text-[#94A3B8] italic">
                      Chưa đủ dữ liệu để phân tích kỹ năng. Cần ít nhất 1 ứng viên có CV.
                    </p>
                  )}
                </div>
              </>
            )}
            <button className="w-full mt-6 py-2.5 bg-white border-2 border-indigo-100 text-indigo-700 text-[13px] font-bold rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm">
              Xem phân tích đầy đủ
            </button>
          </div>
        </div>

        {/* Quick Actions Widget */}
        <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <h3 className="text-[16px] font-black text-[#0F172A] mb-4">Hành động nhanh</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">mail</span>
              Gửi thư mời hàng loạt
            </button>
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">history</span>
              Lịch sử tuyển dụng
            </button>
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">analytics</span>
              Báo cáo tỉ lệ chuyển đổi
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ManageApplicationsPage;
