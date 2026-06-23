import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";
import api from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { useProvinces, useIndustries, useMyCompany } from "@/features/companies/hooks/useManageCompany";
import type { ApiResponse, PagedResponse } from "@/types/api.type";
import { EditJobModal } from "@/features/jobs/components/EditJobModal";



type JobStatusUi = "all" | "active" | "pending" | "rejected" | "draft" | "expired" | "closed" | "paused";

type JobRow = {
  id: string;
  companyId?: string;
  categoryId?: number;
  title: string;
  slug?: string;
  description?: string | null;
  requirements?: string | null;
  benefits?: string | null;

  jobType?: string;
  experienceLevel?: string | null;
  quantity?: number;

  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string;
  salaryCurrency?: string;
  isSalaryPublic?: boolean;

  provinceId?: number | null;
  districtId?: number | null;
  address?: string | null;
  isRemote?: boolean;

  status?: string;
  publishedAt?: string | null;
  expiresAt?: string | null;

  viewCount?: number;
  applyCount?: number;
  saveCount?: number;
  createdAt?: string;

  company?: { id?: string; name?: string; logoUrl?: string; provinceId?: number | null };
  province?: { id?: number; name?: string };
  category?: { id?: number; name?: string };
  skills?: any[];
  tags?: any[];
};

const ManageJobsPage = () => {
  const navigate = useNavigate();

  const jobTypeLabel = (value?: string | null) => {
    switch (value) {
      case "full_time":
        return "Toàn thời gian";
      case "part_time":
        return "Bán thời gian";
      case "contract":
        return "Hợp đồng / Dự án ngắn hạn";
      case "internship":
        return "Thực tập sinh";
      case "freelance":
        return "Làm tự do";
      case "remote":
        return "Làm việc từ xa hoàn toàn";
      default:
        return value ? value : "—";
    }
  };

  const experienceLabel = (value?: string | null) => {
    switch (value) {
      case "intern":
        return "Thực tập sinh";
      case "fresher":
        return "Mới tốt nghiệp / Chưa có kinh nghiệm";
      case "junior":
        return "Junior (Dưới 2 năm kinh nghiệm)";
      case "mid":
        return "Mid (2-4 năm kinh nghiệm)";
      case "senior":
        return "Senior (Trên 5 năm kinh nghiệm)";
      case "lead":
        return "Trưởng nhóm kỹ thuật / Team Lead";
      case "manager":
        return "Trưởng phòng / Quản lý";
      case "director":
        return "Giám đốc bộ phận";
      case "executive":
        return "Giám đốc điều hành / C-level";
      default:
        return value ? value : "—";
    }
  };

  const [activeTab, setActiveTab] = useState<"Tất cả" | "Đang hoạt động" | "Chờ duyệt" | "Tạm dừng" | "Bản nháp" | "Từ chối" | "Hết hạn" | "Đã đóng">(
    "Tất cả",
  );
  const [page, setPage] = useState(1);
  // Tối đa 5 tin / 1 trang
  const [limit] = useState(5);

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline job detail (GET /jobs/{id})
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobRow | null>(null);
  const [isJobDetailLoading, setIsJobDetailLoading] = useState(false);
  const [jobDetailErrorMessage, setJobDetailErrorMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 500);
  const [filterJobType, setFilterJobType] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const { data: provinces } = useProvinces() as any;
  const { data: myCompany } = useMyCompany();
  const { data: industries } = useIndustries() as any;
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete" | "edit" | null;
    jobId: string | null;
  }>({ isOpen: false, type: null, jobId: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = useMemo(
    () => ["Tất cả", "Đang hoạt động", "Chờ duyệt", "Từ chối", "Tạm dừng", "Bản nháp", "Hết hạn", "Đã đóng"] as const,
    [],
  );

  const tabToStatus = useMemo(() => {
    const map: Record<(typeof tabs)[number], JobStatusUi> = {
      "Tất cả": "all",
      "Đang hoạt động": "active",
      "Chờ duyệt": "pending",
      "Từ chối": "rejected",
      "Tạm dừng": "paused",
      "Bản nháp": "draft",
      "Hết hạn": "expired",
      "Đã đóng": "closed",
    };
    return map;
  }, [tabs]);

  const statusQuery = useMemo(() => {
    const ui = tabToStatus[activeTab];
    // Backend JobStatus is Prisma enum. Mapping theo swagger: draft, published, closed, expired, paused
    // UI labels:
    // - Đang hoạt động => published/paused (chọn published trước để đúng nghĩa đang chạy)
    // - Chờ duyệt => draft (chưa published) (nếu backend có pending riêng thì đổi sau)
    // - Bản nháp => draft
    // - Hết hạn => expired
    // - Đã đóng => closed
    switch (ui) {
      case "active":
        return "published";
      case "pending":
        return "pending";
      case "rejected":
        return "rejected";
      case "paused":
        return "paused";
      case "draft":
        return "draft";
      case "expired":
        return "expired";
      case "closed":
        return "closed";
      case "all":
      default:
        return undefined;
    }
  }, [activeTab, tabToStatus]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedKeyword, filterJobType, filterProvince, filterCategory]);

  useEffect(() => {
    let cancelled = false;
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const params: Record<string, any> = { page, limit };
        if (statusQuery) params.status = statusQuery;
        if (debouncedKeyword.trim()) params.search = debouncedKeyword.trim();
        if (filterJobType) params.jobType = filterJobType;
        if (filterProvince) params.provinceId = Number(filterProvince);
        if (myCompany?.id) params.companyId = myCompany.id;
        if (filterCategory) params.categoryId = Number(filterCategory);

        const resp = await api.get("/employer/jobs", { params });
        const payload = resp.data as any;

        /**
         * Backend đang trả về dạng (ví dụ bạn cung cấp):
         * {
         *   status: "success",
         *   data: [...],
         *   meta: { total, page, limit, totalPages, results }
         * }
         *
         * Code hiện tại đang parse theo pagination khác => totalItems bị 0.
         */

        const listCandidate = payload?.data;

        const list: JobRow[] = Array.isArray(listCandidate)
          ? listCandidate
          : (listCandidate?.data as JobRow[]) ?? [];

        // Hỗ trợ thêm các shape pagination cũ (nếu backend thay đổi)
        const meta = payload?.meta as any;

        const totalFromMeta = Number(meta?.total ?? meta?.totalItems ?? 0);
        const totalFromPagination = Number(
          payload?.pagination?.totalItems ?? payload?.data?.pagination?.totalItems ?? 0,
        );

        const tPagesFromMeta = Number(meta?.totalPages ?? meta?.totalPagesCount ?? 1);
        const tPagesFromPagination = Number(
          payload?.pagination?.totalPages ?? payload?.data?.pagination?.totalPages ?? 1,
        );

        const total = Number.isFinite(totalFromMeta) && totalFromMeta > 0 ? totalFromMeta : totalFromPagination;
        const computedTotalPages =
          Number.isFinite(tPagesFromMeta) && tPagesFromMeta > 0 ? tPagesFromMeta : tPagesFromPagination;

        if (!Array.isArray(listCandidate)) {
          // Nếu không có data dạng mảng thì coi như format không hợp lệ
          throw new Error("Response format không hợp lệ (data không phải mảng)");
        }

        if (cancelled) return;
        setJobs(list);
        setTotalItems(total);
        setTotalPages(computedTotalPages);
      } catch (e: any) {
        if (cancelled) return;
        setErrorMessage(e?.response?.data?.message || "Không thể tải danh sách tuyển dụng");
        setJobs([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    };

    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, [page, limit, statusQuery, debouncedKeyword, filterJobType, filterProvince, filterCategory, myCompany]);

  const displayFrom = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const displayTo = Math.min(page * limit, totalItems);

  const paginationRange = useMemo(() => {
    // Hiển thị tối đa 5 nút trang (không tính dấu ...)
    // Range format: (number | "...")
    const total = totalPages;

    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const current = page;

    // Gợi ý logic "5 số": [1,2,3,4,5] hoặc [1,...,3,4,5] hoặc [1,...,2,3,4] hoặc [1,2,3,4,...,last]
    // Để tối ưu UI, ta dùng 3 số ở giữa quanh current, nhưng giữ chặt tổng kích thước <= ~7 phần tử (kèm "...").
    if (current <= 3) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 2) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  }, [page, totalPages]);

  const formatDateShort = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  };

  const formatMoney = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) return "—";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const salaryTypeLabel = (value?: string | null) => {
    switch (value) {
      case "hourly":
        return "Lương theo giờ";
      case "daily":
        return "Lương theo ngày";
      case "monthly":
        return "Lương theo tháng";
      case "yearly":
        return "Lương theo năm";
      case "negotiable":
        return "Lương thỏa thuận";
      default:
        return value ? value : "—";
    }
  };

  const salaryLabel = (job: JobRow) => {
    if (job.isSalaryPublic === false) return "Chưa công khai";
    if (job.salaryMin != null && job.salaryMax != null) {
      const currency = job.salaryCurrency ?? "";
      const typeLabel = job.salaryType ? `/ ${salaryTypeLabel(job.salaryType)}` : "";
      return `${formatMoney(job.salaryMin)} - ${formatMoney(job.salaryMax)} ${currency}${typeLabel}`.trim();
    }
    return "—";
  };

  const statusUi = (status?: string) => {
    if (status === "published") return { label: "Đang hoạt động", cls: "inline-flex px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200" };
    if (status === "pending") return { label: "Chờ duyệt", cls: "inline-flex px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[12px] font-bold border border-blue-200" };
    if (status === "rejected") return { label: "Từ chối", cls: "inline-flex px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200" };
    if (status === "draft") return { label: "Bản nháp", cls: "inline-flex px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200" };
    if (status === "expired") return { label: "Hết hạn", cls: "inline-flex px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200" };
    if (status === "closed") return { label: "Đã đóng", cls: "inline-flex px-3 py-1.5 bg-[#E2E8F0] text-[#475569] rounded-lg text-[12px] font-bold border border-[#CBD5E1]" };
    if (status === "paused") return { label: "Tạm dừng", cls: "inline-flex px-3 py-1.5 bg-[#E2E8F0] text-[#475569] rounded-lg text-[12px] font-bold border border-[#CBD5E1]" };
    // fallback
    return { label: status ? status : "—", cls: "inline-flex px-3 py-1.5 bg-[#E2E8F0] text-[#475569] rounded-lg text-[12px] font-bold border border-[#CBD5E1]" };
  };

  const fetchJobDetail = async (id: string, signal?: AbortSignal) => {
    // optimistic UX: clear previous error, keep old detail until new data arrives
    setJobDetailErrorMessage(null);
    setIsJobDetailLoading(true);

    try {
      const resp = await api.get(`/employer/jobs/${id}`, { signal });
      const payload = resp.data as any;

      // Swagger: { status: 'success', data: Job }
      const jobData: unknown = payload?.data;
      if (!jobData || typeof jobData !== "object") {
        throw new Error("Response format không hợp lệ (Job detail rỗng)");
      }

      setSelectedJobDetail(jobData as JobRow);
    } catch (e: any) {
      // cancel / race conditions
      if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") return;

      setJobDetailErrorMessage(e?.response?.data?.message || "Không thể tải chi tiết tuyển dụng");
      setSelectedJobDetail(null);
    } finally {
      setIsJobDetailLoading(false);
    }
  };


  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-8 flex-1 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[#00307c] bg-blue-50 border border-blue-100 rounded-xl p-2">
              work
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              Quản lý Tuyển dụng
            </h2>
          </div>
          <p className="text-[#64748B] text-[15px] font-medium">
            Theo dõi và quản lý các tin tuyển dụng tại doanh nghiệp của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border ${isFilterOpen ? 'border-[#00307c] text-[#00307c]' : 'border-[#E2E8F0] text-[#475569] hover:border-[#00307c] hover:text-[#00307c]'} rounded-xl transition-all font-bold shadow-sm`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Lọc nâng cao
          </button>

          <button
            onClick={() => navigate(`/employer/${EMPLOYER_PATHS.CREATE_JOB}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl hover:shadow-[0_10px_24px_-10px_rgba(0,48,124,0.45)] hover:-translate-y-0.5 transition-all duration-300 font-bold"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Đăng tin mới
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {isFilterOpen && (
        <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm animate-fade-in mt-[-10px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Search Keyword */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vị trí</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Tiêu đề, mô tả..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white"
                />
              </div>
            </div>

            {/* Province */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Địa điểm</label>
              <div className="relative">
                <select
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả địa điểm</option>
                  {provinces?.map((p: any) => (
                    <option key={p.id} value={p.id.toString()}>{p.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Danh mục</label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả danh mục</option>
                  {industries?.map((ind: any) => (
                    <option key={ind.id} value={ind.id.toString()}>{ind.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Loại hình</label>
              <div className="relative">
                <select
                  value={filterJobType}
                  onChange={(e) => setFilterJobType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/10 outline-none transition-all text-[14.5px] font-medium text-[#0F172A] bg-[#F8FAFC] focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả loại hình</option>
                  <option value="full_time">Toàn thời gian</option>
                  <option value="part_time">Bán thời gian</option>
                  <option value="contract">Hợp đồng / Dự án</option>
                  <option value="internship">Thực tập sinh</option>
                  <option value="freelance">Làm tự do</option>
                  <option value="remote">Làm việc từ xa</option>
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[20px] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          {(searchKeyword || filterJobType || filterProvince || filterCategory) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchKeyword("");
                  setFilterJobType("");
                  setFilterProvince("");
                  setFilterCategory("");
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-bold text-[14px] whitespace-nowrap transition-all duration-300 border-b-2 ${activeTab === tab
              ? "border-[#00307c] text-[#00307c]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      < div className="bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vị trí</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Loại hình</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Kinh nghiệm</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Địa điểm</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Ứng viên</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Lương / Loại</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#64748B] font-bold">
                    Đang tải...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#64748B] font-bold">
                    Không có tin tuyển dụng.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors group">
                    {/* Vị trí */}
                    <td className="px-6 py-5">
                      <div>
                        <p
                          className={`text-[15px] font-bold group-hover:text-[#00307c] cursor-pointer transition-colors ${selectedJobId === job.id ? "text-[#00307c]" : "text-[#0F172A]"
                            }`}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            const controller = new AbortController();
                            fetchJobDetail(job.id, controller.signal);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedJobId(job.id);
                              const controller = new AbortController();
                              fetchJobDetail(job.id, controller.signal);
                            }
                          }}
                        >
                          {job.title}
                        </p>

                      </div>
                    </td>


                    {/* Job Type */}
                    <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">
                      {jobTypeLabel(job.jobType)}
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">
                      {experienceLabel(job.experienceLevel)}
                    </td>

                    {/* Địa điểm */}
                    <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">{job.address || "—"}</td>

                    {/* Ứng viên */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[16px] font-black text-[#0F172A]">{job.applyCount ?? 0}</span>
                          <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Ứng tuyển</span>
                        </div>
                        <div className="h-8 w-px bg-[#E2E8F0]"></div>
                        <div className="flex flex-col">
                          <span className="text-[16px] font-black text-emerald-600">
                            {Math.max(0, (job.viewCount ?? 0) - (job.applyCount ?? 0))}
                          </span>
                          <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Tiềm năng</span>
                        </div>
                      </div>
                    </td>

                    {/* Lương / Loại */}
                    <td className="px-6 py-5">
                      <p className="text-[12.5px] text-[#64748B] font-semibold">{salaryLabel(job)}</p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-5">
                      <span
                        className={
                          job.status === "published"
                            ? "inline-flex px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200"
                            : job.status === "draft"
                              ? "inline-flex px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200"
                              : job.status === "expired"
                                ? "inline-flex px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200"
                                : "inline-flex px-3 py-1.5 bg-[#E2E8F0] text-[#475569] rounded-lg text-[12px] font-bold border border-[#CBD5E1]"
                        }
                      >
                        {job.status === "published"
                          ? "Đang hoạt động"
                          : job.status === "pending"
                            ? "Chờ duyệt"
                            : job.status === "rejected"
                              ? "Từ chối"
                              : job.status === "draft"
                                ? "Bản nháp"
                                : job.status === "expired"
                                  ? "Hết hạn"
                                  : job.status === "closed"
                                    ? "Đã đóng"
                                    : job.status === "paused"
                                      ? "Tạm dừng"
                                      : "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#F1F5F9] bg-[#F8FAFC]">
          <p className="text-[14px] text-[#64748B] font-medium">
            Hiển thị{" "}
            <span className="font-bold text-[#0F172A]">
              {displayFrom}-{displayTo}
            </span>{" "}
            của <span className="font-bold text-[#0F172A]">{totalItems}</span> tin tuyển dụng
          </p>

          <div className="flex items-center gap-1.5">
            <button
              className="w-9 h-9 flex items-center justify-center border-2 border-[#E2E8F0] rounded-lg text-[#94A3B8] disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {paginationRange.map((item, idx) => {
              if (item === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-[#94A3B8] font-bold">
                    ...
                  </span>
                );
              }

              // item is guaranteed to be a number here (see paginationRange logic)
              const p = item as number;

              return (
                <button
                  key={p}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-[14px] font-bold transition-all ${p === page
                    ? "bg-[#00307c] text-white shadow-sm"
                    : "border-2 border-transparent hover:border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]"
                    }`}
                  onClick={() => setPage(p)}
                  type="button"
                >
                  {p}
                </button>
              );
            })}

            <button
              className="w-9 h-9 flex items-center justify-center border-2 border-[#E2E8F0] rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Job Detail Panel (inline) */}
      <div className="bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
        <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">CHI TIẾT TIN TUYỂN DỤNG</p>
            <p className="text-[15px] font-black text-[#0F172A] mt-1">
              {selectedJobDetail?.title || (selectedJobId ? "Đang tải..." : "Chọn một tin để xem")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedJobDetail?.status ? (
              <span className={statusUi(selectedJobDetail.status).cls}>
                {statusUi(selectedJobDetail.status).label}
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-6">
          {!selectedJobId ? (
            <div className="text-[#64748B] text-[14px] font-medium">
              Chọn một tin trong bảng để xem thông tin chi tiết.
            </div>
          ) : isJobDetailLoading ? (
            <div className="text-[#64748B] text-[14px] font-bold">Đang tải chi tiết...</div>
          ) : jobDetailErrorMessage ? (
            <div className="text-rose-700 text-[14px] font-bold">{jobDetailErrorMessage}</div>
          ) : selectedJobDetail ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Mô tả</p>
                    <div className="text-[14.5px] text-[#0F172A] font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedJobDetail.description || "—"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Yêu cầu</p>
                    <div className="text-[14.5px] text-[#334155] font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedJobDetail.requirements || "—"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Quyền lợi</p>
                    <div className="text-[14.5px] text-[#334155] font-medium leading-relaxed whitespace-pre-wrap">
                      {selectedJobDetail.benefits || "—"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Kỹ năng</p>
                    {selectedJobDetail.skills && selectedJobDetail.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedJobDetail.skills.map((skill: any) => (
                          <span
                            key={skill.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[14.5px] text-[#334155] font-medium leading-relaxed">—</div>
                    )}
                  </div>
                </div>

                {/* Actions (bên trái) */}
                <div className="mt-auto space-y-3 space-x-3">
                  <button
                    type="button"
                    className="w-auto px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] text-[#475569] hover:text-[#00307c] transition-all font-bold shadow-sm inline-flex items-center gap-2"
                    title="Chỉnh sửa"
                    onClick={() => setConfirmModal({ isOpen: true, type: "edit", jobId: selectedJobId })}
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                    Chỉnh sửa
                  </button>

                  <button
                    type="button"
                    className="w-auto px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-800 hover:text-rose-900 transition-all font-bold inline-flex items-center gap-2"
                    title="Xóa"
                    onClick={() => setConfirmModal({ isOpen: true, type: "delete", jobId: selectedJobId })}
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                    Xóa
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                      Thông tin chung
                    </p>
                  </div>

                  <div className="mt-3 space-y-2 text-[#334155] text-[14px] font-medium">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Loại hình</span>
                      <span>{jobTypeLabel(selectedJobDetail.jobType)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Kinh nghiệm</span>
                      <span>{experienceLabel(selectedJobDetail.experienceLevel)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Địa điểm</span>
                      <span>{selectedJobDetail.address || "—"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Lương</span>
                      <span>{salaryLabel(selectedJobDetail)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-[#E2E8F0] rounded-2xl">
                  <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">
                    Thời gian
                  </p>

                  <div className="mt-3 space-y-2 text-[#334155] text-[14px] font-medium">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Đăng</span>
                      <span>{formatDateShort(selectedJobDetail.publishedAt)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#64748B]">Hạn nộp</span>
                      <span>{formatDateShort(selectedJobDetail.expiresAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[#64748B] text-[14px] font-medium">Không có dữ liệu.</div>
          )}
        </div>
      </div>


      {/* Confirm Action Modal */}
      {confirmModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transform transition-all">
            <div className={`p-6 border-b border-[#F1F5F9] flex items-center justify-between ${confirmModal.type === 'delete' ? 'bg-rose-50/50' : 'bg-blue-50/50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${confirmModal.type === 'delete' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-[#00307c]'}`}>
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {confirmModal.type === 'delete' ? 'warning' : 'edit_square'}
                  </span>
                </div>
                <div>
                  <h3 className="text-[18px] font-black text-[#0F172A]">
                    {confirmModal.type === 'delete' ? 'Xác nhận xóa' : 'Xác nhận chỉnh sửa'}
                  </h3>
                  <p className="text-[13px] font-medium text-[#64748B] mt-1">
                    {confirmModal.type === 'delete' ? 'Hành động này không thể hoàn tác' : 'Bạn muốn tiếp tục chỉnh sửa?'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-[14.5px] font-medium text-[#475569] leading-relaxed">
                {confirmModal.type === 'delete'
                  ? 'Bạn có chắc chắn muốn xóa tin tuyển dụng này khỏi hệ thống không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.'
                  : 'Bạn đang chuyển sang chế độ chỉnh sửa. Bạn có thể thay đổi các thông tin của tin tuyển dụng này ngay bây giờ.'}
              </p>
            </div>

            <div className="p-5 bg-[#F8FAFC] border-t border-[#F1F5F9] flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: null, jobId: null })}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl font-bold text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors text-[14.5px] disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={async () => {
                  if (confirmModal.type === 'edit') {
                    setConfirmModal({ isOpen: false, type: null, jobId: null });
                    setIsEditModalOpen(true);
                  } else if (confirmModal.type === 'delete') {
                    if (!confirmModal.jobId) return;
                    setIsProcessing(true);
                    try {
                      await api.delete(`/employer/jobs/${confirmModal.jobId}`);
                      toast.success("Xóa tin tuyển dụng thành công");

                      // Refetch current list
                      const params: Record<string, any> = { page, limit };
                      if (statusQuery) params.status = statusQuery;
                      if (myCompany?.id) params.companyId = myCompany.id;

                      const resp = await api.get("/employer/jobs", { params });
                      const payload = resp.data as any;

                      const listCandidate = payload?.data;
                      const list: JobRow[] = Array.isArray(listCandidate) ? listCandidate : (listCandidate?.data as JobRow[]) ?? [];

                      const meta = payload?.meta as any;
                      const totalFromMeta = Number(meta?.total ?? meta?.totalItems ?? 0);
                      const totalFromPagination = Number(payload?.pagination?.totalItems ?? payload?.data?.pagination?.totalItems ?? 0);

                      const tPagesFromMeta = Number(meta?.totalPages ?? meta?.totalPagesCount ?? 1);
                      const tPagesFromPagination = Number(payload?.pagination?.totalPages ?? payload?.data?.pagination?.totalPages ?? 1);

                      const total = Number.isFinite(totalFromMeta) && totalFromMeta > 0 ? totalFromMeta : totalFromPagination;
                      const computedTotalPages = Number.isFinite(tPagesFromMeta) && tPagesFromMeta > 0 ? tPagesFromMeta : tPagesFromPagination;

                      setJobs(list);
                      setTotalItems(total);
                      setTotalPages(computedTotalPages);

                      setSelectedJobId(null);
                      setSelectedJobDetail(null);
                      setConfirmModal({ isOpen: false, type: null, jobId: null });
                    } catch (e: any) {
                      toast.error(e?.response?.data?.message || "Xóa tin thất bại");
                    } finally {
                      setIsProcessing(false);
                    }
                  }
                }}
                disabled={isProcessing}
                className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 text-[14.5px] shadow-sm disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none hover:-translate-y-0.5 ${confirmModal.type === 'delete'
                  ? 'bg-rose-600 hover:bg-rose-700 hover:shadow-[0_4px_12px_rgba(225,29,72,0.3)]'
                  : 'bg-gradient-to-r from-[#00307c] to-[#0052cc] hover:shadow-[0_4px_12px_rgba(0,48,124,0.3)]'
                  }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : confirmModal.type === 'delete' ? (
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                )}
                {isProcessing ? "Đang xử lý..." : confirmModal.type === 'delete' ? "Xóa tin này" : "Tiếp tục"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        job={selectedJobDetail}
        onSuccess={() => {
          if (selectedJobId) {
            const controller = new AbortController();
            fetchJobDetail(selectedJobId, controller.signal);
            // Optional: refresh list
            setPage(1);
          }
        }}
      />

      {/* Bento Widgets for Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,48,124,0.05)]">
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-[#00307c] mb-2 uppercase tracking-wider">TỶ LỆ CHUYỂN ĐỔI</h3>
            <p className="text-4xl font-black text-[#0F172A] tracking-tight">32.4%</p>
            <p className="text-[14px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              Tăng 4.2% so với tháng trước
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] text-blue-600/5 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
            trending_up
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(16,185,129,0.05)]">
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-emerald-700 mb-2 uppercase tracking-wider">THỜI GIAN TUYỂN TRUNG BÌNH</h3>
            <p className="text-4xl font-black text-[#0F172A] tracking-tight">18 Ngày</p>
            <p className="text-[14px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Nhanh hơn 3 ngày so với KPI
            </p>
          </div>

          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] text-emerald-600/5 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
            timer
          </span>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 p-6 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.05)] flex flex-col justify-between group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-indigo-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              GỢI Ý TỪ AI
            </h3>
            <p className="text-[15px] font-bold text-[#0F172A] leading-relaxed mt-2">
              Vị trí <span className="text-indigo-600">UI/UX Designer</span> đang có 8 ứng viên tiềm năng cao chưa được xem.
            </p>
          </div>
          <button className="mt-4 text-[14px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10 w-fit">
            Xem ngay <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;
