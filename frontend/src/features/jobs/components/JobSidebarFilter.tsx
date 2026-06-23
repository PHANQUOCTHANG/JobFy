import React, { useState } from "react";
import { JobFilterParams } from "../types";
import { Filter, ChevronDown, Star } from "lucide-react";
import { useIndustries, useJobCategories } from "../hooks/useJobs";

interface JobSidebarFilterProps {
  filters: JobFilterParams;
  onFilterChange: (newFilters: Partial<JobFilterParams>) => void;
  onClearFilters: () => void;
}

const EXP_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "fresher", label: "Mới tốt nghiệp" },
  { value: "junior", label: "Dưới 2 năm" },
  { value: "mid", label: "Từ 2-4 năm" },
  { value: "senior", label: "Trên 5 năm" },
  { value: "manager", label: "Quản lý" },
];

const SALARY_OPTIONS = [
  { value: "all", label: "Tất cả", min: undefined, max: undefined },
  { value: "lt10", label: "Dưới 10 triệu", min: undefined, max: 9_999_999 },
  { value: "10-15", label: "10 - 15 triệu", min: 10_000_000, max: 15_000_000 },
  { value: "15-20", label: "15 - 20 triệu", min: 15_000_000, max: 20_000_000 },
  { value: "20-25", label: "20 - 25 triệu", min: 20_000_000, max: 25_000_000 },
  { value: "25-30", label: "25 - 30 triệu", min: 25_000_000, max: 30_000_000 },
  { value: "30-50", label: "30 - 50 triệu", min: 30_000_000, max: 50_000_000 },
  { value: "gt50", label: "Trên 50 triệu", min: 50_000_000, max: undefined },
  { value: "negotiable", label: "Thoả thuận", min: 0, max: 0 },
];

const JOB_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "full_time", label: "Toàn thời gian" },
  { value: "part_time", label: "Bán thời gian" },
  { value: "contract", label: "Hợp đồng" },
  { value: "internship", label: "Thực tập" },
  { value: "freelance", label: "Làm tự do" },
  { value: "remote", label: "Từ xa" },
];

const CustomRadio = ({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className="relative flex items-center justify-center flex-shrink-0">
      <input type="radio" className="peer sr-only" checked={checked} onChange={onChange} />
      <div className={`w-4 h-4 rounded-full border transition-all duration-200 flex items-center justify-center ${checked ? 'border-[#4F46E5]' : 'border-[#d1d5db] group-hover:border-[#4F46E5]'}`}>
        <div className={`w-2 h-2 rounded-full bg-[#4F46E5] transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
      </div>
    </div>
    <span className={`text-[13px] transition-colors truncate ${checked ? 'text-[#212f3f] font-medium' : 'text-[#6f7882] group-hover:text-[#212f3f]'}`}>
      {label}
    </span>
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-[14px] text-[#212f3f] mb-3">{children}</h3>
);

const Divider = () => <div className="w-full h-px border-t border-dashed border-[#e8e8e8] my-5" />;

export const JobSidebarFilter: React.FC<JobSidebarFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { data: industries } = useIndustries();
  const { data: categories } = useJobCategories();

  const [minSalary, setMinSalary] = useState(
    filters.salaryMin && filters.salaryMin > 0 ? String(Math.round(filters.salaryMin / 1000000)) : ""
  );
  const [maxSalary, setMaxSalary] = useState(
    filters.salaryMax && filters.salaryMax > 0 ? String(Math.round(filters.salaryMax / 1000000)) : ""
  );

  React.useEffect(() => {
    if (!filters.salaryMin) setMinSalary("");
    else if (filters.salaryMin > 0) setMinSalary(String(Math.round(filters.salaryMin / 1000000)));
    
    if (!filters.salaryMax) setMaxSalary("");
    else if (filters.salaryMax > 0) setMaxSalary(String(Math.round(filters.salaryMax / 1000000)));
  }, [filters.salaryMin, filters.salaryMax]);

  const handleApplySalary = () => {
    onFilterChange({
      salaryMin: minSalary ? parseInt(minSalary) * 1000000 : undefined,
      salaryMax: maxSalary ? parseInt(maxSalary) * 1000000 : undefined,
    });
  };

  return (
    <div className="bg-[#f8f9fa] rounded-lg p-5 shadow-sm border border-[#e8e8e8]">
      <div className="flex items-center gap-2 mb-6 text-[#212f3f] font-bold text-[16px]">
        <Filter size={18} className="text-[#4F46E5]" />
        <h2>Lọc nâng cao</h2>
      </div>

      <Divider />

      <div className="mb-6">
        <SectionTitle>Lĩnh vực công ty</SectionTitle>
        <div className="relative">
          <select
            className="w-full border border-[#e8e8e8] rounded-md bg-white px-3 py-2 text-[13px] text-[#212f3f] cursor-pointer hover:border-[#4F46E5] outline-none appearance-none"
            value={filters.industryId || "all"}
            onChange={(e) => onFilterChange({ industryId: e.target.value === "all" ? undefined : Number(e.target.value) })}
          >
            <option value="all">Tất cả lĩnh vực</option>
            {industries?.map((ind) => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="text-[#9ea5af] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <Divider />

      <div className="mb-6">
        <SectionTitle>Lĩnh vực công việc</SectionTitle>
        <div className="relative">
          <select
            className="w-full border border-[#e8e8e8] rounded-md bg-white px-3 py-2 text-[13px] text-[#212f3f] cursor-pointer hover:border-[#4F46E5] outline-none appearance-none"
            value={filters.categorySlug || "all"}
            onChange={(e) => onFilterChange({ categorySlug: e.target.value === "all" ? undefined : e.target.value })}
          >
            <option value="all">Tất cả nghề nghiệp</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="text-[#9ea5af] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <Divider />

      <div>
        <SectionTitle>Mức lương</SectionTitle>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
          {SALARY_OPTIONS.map((opt) => {
            const isChecked = 
              (opt.value === "all" && !filters.salaryMin && !filters.salaryMax) ||
              (opt.value === "negotiable" && filters.salaryMin === 0 && filters.salaryMax === 0) ||
              (filters.salaryMin === opt.min && filters.salaryMax === opt.max && opt.value !== "all");

            return (
              <CustomRadio
                key={opt.value}
                checked={isChecked}
                onChange={() => {
                  setMinSalary("");
                  setMaxSalary("");
                  onFilterChange({ salaryMin: opt.min, salaryMax: opt.max });
                }}
                label={opt.label}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Từ"
            className="w-0 flex-1 h-9 px-3 border border-[#e8e8e8] rounded-full text-[13px] outline-none focus:border-[#4F46E5] bg-white transition-colors"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <span className="text-[#9ea5af] text-[12px]">-</span>
          <input
            type="number"
            placeholder="Đến"
            className="w-0 flex-1 h-9 px-3 border border-[#e8e8e8] rounded-full text-[13px] outline-none focus:border-[#4F46E5] bg-white transition-colors"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
          <span className="text-[#6f7882] text-[13px] font-medium flex-shrink-0">triệu</span>
        </div>

        <button
          onClick={handleApplySalary}
          disabled={!minSalary && !maxSalary}
          className="w-full py-2.5 bg-[#f0f0f0] text-[#9ea5af] text-[13px] font-bold rounded-full hover:bg-[#e8e8e8] hover:text-[#6f7882] transition-colors disabled:opacity-50"
        >
          Áp dụng
        </button>
      </div>

      <Divider />

      <div className="mb-6">
        <SectionTitle>Kinh nghiệm</SectionTitle>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {EXP_OPTIONS.map((opt) => (
            <CustomRadio
              key={opt.value}
              checked={filters.experienceLevel ? filters.experienceLevel === opt.value : opt.value === "all"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={() => onFilterChange({ experienceLevel: opt.value === "all" ? undefined : (opt.value as any) })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <Divider />

      <div className="mb-8">
        <SectionTitle>Loại hình làm việc</SectionTitle>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {JOB_TYPE_OPTIONS.map((opt) => (
            <CustomRadio
              key={opt.value}
              checked={filters.jobType ? filters.jobType === opt.value : opt.value === "all"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={() => onFilterChange({ jobType: opt.value === "all" ? undefined : (opt.value as any) })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onClearFilters}
          className="px-5 py-2 bg-[#f0f0f0] text-[#9ea5af] font-medium text-[13px] rounded-full hover:bg-[#e8e8e8] transition-colors whitespace-nowrap"
        >
          Xóa lọc
        </button>
        <button className="flex-1 bg-white border border-[#4F46E5] text-[#4F46E5] py-2 rounded-full flex items-center justify-center gap-2 font-medium hover:bg-indigo-50 transition-colors text-[13px]">
          <Star size={14} className="fill-current" />
          Lưu bộ lọc
        </button>
      </div>
    </div>
  );
};
