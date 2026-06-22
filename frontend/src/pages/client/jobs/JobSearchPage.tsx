import React, { useState, useEffect } from "react";
import { useJobs, useJobCategories } from "@/features/jobs";
import { JobFilters } from "@/features/jobs/components/JobFilters";
import { JobList } from "@/features/jobs/components/JobList";
import { JobSidebarFilter } from "@/features/jobs/components/JobSidebarFilter";
import { JobSortBar } from "@/features/jobs/components/JobSortBar";
import { JobFilterParams } from "@/features/jobs/types";
import { Bell, ChevronRight } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { mockJobs } from "@/features/jobs/api/mockData";
import { JobLandingSection } from "@/features/jobs/components/JobLandingSection";
import { TopCompaniesSection } from "@/features/jobs/components/TopCompaniesSection";
import { TopCategoriesSection } from "@/features/jobs/components/TopCategoriesSection";
import { SeoKeywordsSection } from "@/features/jobs/components/SeoKeywordsSection";

export const JobSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialKeyword = searchParams.get("keyword") || undefined;
  const initialProvinceId = searchParams.get("provinceId")
    ? Number(searchParams.get("provinceId"))
    : undefined;
  const initialDistrictIds = searchParams.get("districtIds") || undefined;
  const initialIndustryId = searchParams.get("industryId")
    ? Number(searchParams.get("industryId"))
    : undefined;
  const initialCategorySlug = searchParams.get("categorySlug") || undefined;
  const initialJobType = searchParams.get("jobType") || undefined;
  const initialExperienceLevel =
    searchParams.get("experienceLevel") || undefined;
  const initialSalaryMin = searchParams.get("salaryMin")
    ? Number(searchParams.get("salaryMin"))
    : undefined;
  const initialSalaryMax = searchParams.get("salaryMax")
    ? Number(searchParams.get("salaryMax"))
    : undefined;
  const initialIsRemote = searchParams.get("isRemote")
    ? searchParams.get("isRemote") === "true"
    : undefined;
  const initialPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const [filters, setFilters] = useState<JobFilterParams>({
    page: initialPage,
    limit: 10,
    keyword: initialKeyword,
    provinceId: initialProvinceId,
    districtIds: initialDistrictIds,
    industryId: initialIndustryId,
    categorySlug: initialCategorySlug,
    jobType: initialJobType,
    experienceLevel: initialExperienceLevel,
    salaryMin: initialSalaryMin,
    salaryMax: initialSalaryMax,
    isRemote: initialIsRemote,
  });
  const [sortBy, setSortBy] = useState("latest");
  const [searchMode, setSearchMode] = useState<"title" | "company" | "both">(
    "title",
  );
  const [hasSearched, setHasSearched] = useState(
      !!initialKeyword ||
      !!initialProvinceId ||
      !!initialDistrictIds ||
      !!initialIndustryId ||
      !!initialCategorySlug ||
      !!initialJobType ||
      !!initialExperienceLevel ||
      initialSalaryMin !== undefined ||
      initialSalaryMax !== undefined ||
      initialIsRemote !== undefined,
  );

  // Persist view mode in localStorage
  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    return (
      (localStorage.getItem("jobfy_view_mode") as "list" | "grid") || "list"
    );
  });
  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("jobfy_view_mode", mode);
  };

  const { data: response, isLoading } = useJobs({
    ...filters,
    sort: sortBy,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { data: categories } = useJobCategories();

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.categorySlug) params.set("categorySlug", filters.categorySlug);
    if (filters.provinceId)
      params.set("provinceId", String(filters.provinceId));
    if (filters.districtIds)
      params.set("districtIds", filters.districtIds);
    if (filters.industryId)
      params.set("industryId", String(filters.industryId));
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.experienceLevel)
      params.set("experienceLevel", filters.experienceLevel);
    if (filters.salaryMin !== undefined)
      params.set("salaryMin", String(filters.salaryMin));
    if (filters.salaryMax !== undefined)
      params.set("salaryMax", String(filters.salaryMax));
    if (filters.isRemote !== undefined)
      params.set("isRemote", String(filters.isRemote));
    if (filters.page && filters.page > 1)
      params.set("page", String(filters.page));

    const queryString = params.toString();
    navigate(queryString ? `/jobs?${queryString}` : "/jobs", { replace: true });
  }, [filters, navigate]);

  const handleSearch = (newFilters: Partial<JobFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    setHasSearched(true);
  };

  const handleClearFilters = () => {
    setFilters({ page: 1, limit: 10 });
    setHasSearched(false);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hasSearched) {
    return <JobLandingSection onSearch={handleSearch} />;
  }

  // Pagination and data from Backend
  const displayJobs =
    response?.data && response.data.length > 0 ? response.data : mockJobs;
  const totalResults = response?.meta?.total || mockJobs.length;
  // Lấy tổng số trang từ backend, nếu không có data (hoặc = 0) thì set mặc định là 1
  const totalPages = response?.meta?.totalPages
    ? Math.max(response.meta.totalPages, 1)
    : 1;
  const currentPage = filters.page || 1;

  // Breadcrumb date
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

  return (
    <div className="min-h-screen bg-[#f0f0f0] pb-10">
      <div className="bg-gradient-to-r from-[#e3f2fd] via-[#e3f2fd]/80 to-[#f6f7fa] py-3 px-4 sticky top-0 z-[60] shadow-sm border-b border-blue-100 transition-all duration-300">
        <div className="max-w-[1140px] mx-auto">
          <JobFilters
            onSearch={handleSearch}
            initialKeyword={filters.keyword}
            initialProvinceId={filters.provinceId}
            initialDistrictIds={filters.districtIds}
            initialCategorySlug={filters.categorySlug}
          />
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 py-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <h1 className="text-[16px] font-bold text-[#212f3f] mb-1">
              Tuyển dụng{" "}
              <span className="text-[#4F46E5]">
                {totalResults.toLocaleString("vi-VN")} việc làm
              </span>{" "}
              {filters.keyword && `"${filters.keyword}"`} [Update {dateStr}]
            </h1>
            <div className="flex items-center gap-1 text-[13px] text-[#6f7882]">
              <Link to="/" className="hover:text-[#4F46E5] transition-colors">
                Trang chủ
              </Link>
              <ChevronRight size={13} />
              <Link
                to="/jobs"
                className="hover:text-[#4F46E5] transition-colors"
              >
                Việc làm
              </Link>
              {filters.keyword && (
                <>
                  <ChevronRight size={13} />
                  <span className="text-[#6f7882]">{filters.keyword}</span>
                </>
              )}
            </div>
          </div>

          <button className="flex items-center gap-2 text-[14px] text-[#212f3f] font-medium bg-white rounded-full px-4 py-2 shadow-sm border border-[#e8e8e8] hover:shadow-md hover:text-[#4F46E5] transition-all whitespace-nowrap mt-2 sm:mt-0">
            <Bell size={16} className="text-[#212f3f]" />
            Tạo thông báo việc làm
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <aside className="w-full lg:w-[280px] flex-shrink-0 lg:sticky lg:top-[140px]">
            <JobSidebarFilter
              filters={filters}
              onFilterChange={handleSearch}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <JobSortBar
              totalResults={totalResults}
              isLoading={isLoading}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              searchMode={searchMode}
              onSearchModeChange={setSearchMode}
              currentPage={currentPage}
              limit={filters.limit || 10}
            />

            <JobList
              jobs={displayJobs}
              isLoading={isLoading}
              filters={filters}
              onClearFilters={handleClearFilters}
              viewMode={viewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <TopCategoriesSection />
          <TopCompaniesSection />
          <SeoKeywordsSection />
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
