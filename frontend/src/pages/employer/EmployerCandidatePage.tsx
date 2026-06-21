import React, { useState, useEffect } from "react";
import { useCandidates, useUpdateCandidateStatus } from "@/features/employer/hooks/useCandidates";
import { CandidateFilterSidebar } from "@/features/employer/components/candidates/CandidateFilterSidebar";
import { CandidateCard } from "@/features/employer/components/candidates/CandidateCard";
import { CandidateAIInsights } from "@/features/employer/components/candidates/CandidateAIInsights";
import { ResumeViewerModal } from "@/features/employer/components/candidates/ResumeViewerModal";
import { ConversionReportModal } from "@/features/employer/components/candidates/ConversionReportModal";
import { RecruitmentHistoryModal } from "@/features/employer/components/candidates/RecruitmentHistoryModal";
import { useUpdateBulkCandidateStatus } from "@/features/employer/hooks/useCandidates";
import { toast } from "sonner";
import api from "@/lib/axios";

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const EmployerCandidatePage = () => {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    keyword: "",
    experience: [] as string[],
    status: "",
    jobId: "",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  const debouncedFilters = useDebounce(filters, 500);
  const { data, isLoading } = useCandidates(debouncedFilters);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCandidateStatus();
  const { mutate: updateBulkStatus, isPending: isBulkUpdating } = useUpdateBulkCandidateStatus();

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (data?.data) {
      if (selectedIds.length === data.data.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(data.data.map(item => item.id));
      }
    }
  };

  const handleBulkUpdate = (status: string) => {
    if (selectedIds.length === 0) return;
    updateBulkStatus(
      { applicationIds: selectedIds, status },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật trạng thái cho ${selectedIds.length} ứng viên!`);
          setSelectedIds([]);
        },
        onError: () => toast.error("Có lỗi xảy ra khi cập nhật hàng loạt"),
      }
    );
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatus(
      { id, status },
      {
        onSuccess: () => {
          if (status === "interviewed" || status === "rejected") {
            toast.success("✅ Đã cập nhật! Email đã được gửi tới ứng viên.");
          } else {
            toast.success("Đã cập nhật trạng thái hồ sơ");
          }
        },
        onError: () => toast.error("Có lỗi xảy ra khi cập nhật"),
      }
    );
  };

  const handleExport = async () => {
    try {
      toast.info("Đang xử lý dữ liệu báo cáo...");
      // Clean params giống như hook useCandidates
      const cleanedParams = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      const res = await api.get("/employer/candidates/export", { 
        params: cleanedParams,
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `danh_sach_ung_vien_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Đã tải xuống file báo cáo thành công!");
    } catch (e) {
      toast.error("Không thể xuất file lúc này.");
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Filters */}
        <div className="lg:col-span-3">
          <CandidateFilterSidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* Center Column: List */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-end justify-between bg-white rounded-3xl p-6 border border-[#F1F5F9] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)]">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Danh sách ứng viên</h2>
              <p className="text-[#64748B] text-[15px] font-medium mt-1">
                {isLoading ? "Đang tải..." : `Có ${data?.pagination.total || 0} hồ sơ phù hợp`}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {/* Select All Checkbox */}
              {data?.data && data.data.length > 0 && (
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === data.data.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[14px] font-bold text-slate-700">Chọn tất cả</span>
                </label>
              )}

              <select 
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:border-[#00307c]"
              >
                <option value="newest">Mới nhất</option>
                <option value="ai_score">Điểm AI</option>
              </select>
              <button onClick={handleExport} className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl text-[14px] font-semibold flex items-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                Xuất
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              // Skeleton Loading
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-[#F1F5F9] animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-slate-200 rounded w-20"></div>
                        <div className="h-6 bg-slate-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : data?.data.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-[#F1F5F9] text-center">
                <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
                  <span className="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Không tìm thấy ứng viên</h3>
                <p className="text-[#64748B]">Hãy thử thay đổi điều kiện bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            ) : (
              <>
                {data?.data.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onUpdateStatus={handleUpdateStatus} 
                    onViewDetail={(id) => setSelectedApplicationId(id)}
                    isSelected={selectedIds.includes(candidate.id)}
                    onToggleSelect={handleToggleSelect}
                    isUpdating={isUpdating} 
                  />
                ))}

                {/* Pagination */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-[#F1F5F9] mt-6 shadow-sm">
                    <span className="text-[#64748B] text-[14px] font-medium px-2">
                      Đang xem <span className="font-bold text-[#0F172A]">{(data.pagination.page - 1) * data.pagination.limit + 1}</span> - <span className="font-bold text-[#0F172A]">{Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)}</span> trong <span className="font-bold text-[#0F172A]">{data.pagination.total}</span> ứng viên
                    </span>
                    <div className="flex gap-2">
                      <button
                        disabled={data.pagination.page === 1}
                        onClick={() => {
                          setFilters({ ...filters, page: filters.page - 1 });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-xl font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <div className="h-10 px-4 flex items-center justify-center font-bold text-[#00307c] bg-blue-50 border border-blue-100 rounded-xl">
                        {data.pagination.page} / {data.pagination.totalPages}
                      </div>
                      <button
                        disabled={data.pagination.page === data.pagination.totalPages}
                        onClick={() => {
                          setFilters({ ...filters, page: filters.page + 1 });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-xl font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-3">
          <CandidateAIInsights 
            filters={debouncedFilters} 
            onOpenConversionReport={() => setShowConversionModal(true)}
            onOpenHistory={() => setShowHistoryModal(true)}
          />
        </div>

      </div>

      {/* CV Viewer Modal */}
      {selectedApplicationId && (
        <ResumeViewerModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}

      {/* Conversion Report Modal */}
      {showConversionModal && (
        <ConversionReportModal onClose={() => setShowConversionModal(false)} />
      )}

      {/* Recruitment History Modal */}
      {showHistoryModal && (
        <RecruitmentHistoryModal onClose={() => setShowHistoryModal(false)} />
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] rounded-2xl p-4 shadow-2xl flex items-center gap-6 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-[14px]">
              {selectedIds.length}
            </div>
            <span className="text-white font-medium text-[15px]">ứng viên được chọn</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              disabled={isBulkUpdating}
              onClick={() => handleBulkUpdate('rejected')}
              className="px-5 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-bold text-[14px] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Từ chối hàng loạt
            </button>
            <button 
              disabled={isBulkUpdating}
              onClick={() => handleBulkUpdate('interviewed')}
              className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-bold text-[14px] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Mời phỏng vấn hàng loạt
            </button>
          </div>
          
          <button 
            onClick={() => setSelectedIds([])}
            className="ml-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployerCandidatePage;
