import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Job as RealJob } from "@/features/jobs/types";
import { JobCard } from "@/features/jobs/components/JobCard";
import { useJobs, useProvinces, useJobCategories } from "@/features/jobs/hooks/useJobs";
import { mockJobs } from "@/features/jobs/api/mockData";
import { SectionFilterBar } from "@/features/jobs/components/SectionFilterBar";
import { JobSkeletonCard } from "@/features/jobs/components/JobSkeletonCard";
import {
  JOB_FILTER_TYPES,
  SALARY_QUICK_OPTIONS,
  SALARY_PARAM_MAP,
  EXPERIENCE_QUICK_OPTIONS,
  EXPERIENCE_PARAM_MAP,
  LOCATION_QUICK_OPTIONS,
} from "@/features/jobs/constants/filterOptions";

const LIMIT = 9;

// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-explicit-any
const getProvinceIdsByRegion = (region: string, provinces: any[]): number[] => {
  return provinces
    .filter((p) => p.region === region)
    .map((p) => p.id);
};

export function FeaturedJobs({ jobs: propJobs }: { jobs: RealJob[] }) {
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState<string[]>([]);
  const [activeFilterType, setActiveFilterType] = useState('location');

  const [locationValue, setLocationValue] = useState<string>('all');
  const [salaryValue, setSalaryValue] = useState<string>('all');
  const [expValue, setExpValue] = useState<string>('all');
  const [categoryValue, setCategoryValue] = useState<string>('all');

  const { data: provinces } = useProvinces();
  const { data: categories } = useJobCategories();

  const resolveProvinceId = (val: string): number | undefined => {
    if (val === 'all') return undefined;
    const nameMap: Record<string, string> = {
      hanoi: 'Hà Nội',
      hcm: 'Hồ Chí Minh',
      danang: 'Đà Nẵng',
    };
    if (nameMap[val]) {
      return provinces?.find(p => p.name === nameMap[val])?.id;
    }
    return undefined; // north/south/central skip for now
  };

  const provinceId = resolveProvinceId(locationValue);
  const { min: salaryMin, max: salaryMax } = SALARY_PARAM_MAP[salaryValue] ?? {};
  const experienceLevel = EXPERIENCE_PARAM_MAP[expValue];
  const categorySlug = categoryValue === 'all' ? undefined : categoryValue;

  const { data: response, isLoading } = useJobs({
    limit: LIMIT,
    page,
    provinceId,
    salaryMin,
    salaryMax,
    experienceLevel,
    categorySlug,
    status: 'published'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  const jobs = response?.data && response.data.length > 0
    ? response.data
    : propJobs && propJobs.length > 0
      ? propJobs
      : mockJobs.slice(0, LIMIT);

  const totalPages = response?.meta?.totalPages
    ? Math.max(response.meta.totalPages, 1)
    : 1;

  const toggleSave = (id: string) => {
    setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  const categoryQuickOptions = [
    { label: 'Tất cả', value: 'all' },
    ...(categories || []).slice(0, 8).map(c => ({ label: c.name, value: c.slug })),
  ];

  const quickOptions =
    activeFilterType === 'location' ? LOCATION_QUICK_OPTIONS :
    activeFilterType === 'salary'   ? SALARY_QUICK_OPTIONS :
    activeFilterType === 'experience' ? EXPERIENCE_QUICK_OPTIONS :
    categoryQuickOptions;

  const activeQuickValue =
    activeFilterType === 'location' ? locationValue :
    activeFilterType === 'salary'   ? salaryValue :
    activeFilterType === 'experience' ? expValue :
    categoryValue;

  const handleQuickOptionSelect = (value: string | number) => {
    const v = String(value);
    setPage(1);
    if (activeFilterType === 'location') setLocationValue(v);
    else if (activeFilterType === 'salary') setSalaryValue(v);
    else if (activeFilterType === 'experience') setExpValue(v);
    else setCategoryValue(v);
  };

  return (
    <section className="py-10 px-5 lg:px-10 bg-[#f0f0f0]">
      <div className="max-w-[1140px] mx-auto">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-4 flex-shrink-0">
              <h2 className="text-[24px] font-bold text-[#4F46E5] flex items-center gap-2">
                Việc làm tốt nhất
                <span className="text-[#9ea5af] mx-2">|</span>
                <span className="flex items-center gap-1.5 text-[#212f3f] text-[14px]">
                  Đề xuất bởi <span className="font-bold text-[#4F46E5]">TOPPY<span className="text-[#6f7882]">AI</span></span>
                </span>
              </h2>
            </div>
            
            <div className="flex-1 md:ml-6 min-w-0">
              <SectionFilterBar
                filterTypes={JOB_FILTER_TYPES}
                activeFilterType={activeFilterType}
                onFilterTypeChange={(t) => { setActiveFilterType(t); setPage(1); }}
                quickOptions={quickOptions}
                activeQuickValue={activeQuickValue}
                onQuickOptionSelect={handleQuickOptionSelect}
                accentColor="#4F46E5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <JobSkeletonCard key={i} viewMode="compact" />
              ))
            ) : (
              jobs.map((job, idx) => (
                <JobCard
                  key={`${job.id}-${idx}`}
                  job={job}
                  viewMode="compact"
                  isSaved={saved.includes(job.id)}
                  onSave={toggleSave}
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 pt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] disabled:cursor-not-allowed hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[14px] text-[#212f3f] font-medium">
              <span className="text-[#4F46E5]">{page}</span> / {totalPages} trang
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] disabled:cursor-not-allowed hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
