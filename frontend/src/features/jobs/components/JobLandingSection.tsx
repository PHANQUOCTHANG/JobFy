import React, { useState } from 'react';
import { JobFilters } from './JobFilters';
import { JobFilterParams } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { mockJobs } from '../api/mockData';
import { JobCard } from './JobCard';
import { JobSkeletonCard } from './JobSkeletonCard';
import { HeroBanner } from './HeroBanner';
import { AttractiveJobsSection } from './AttractiveJobsSection';
import { BigBrandsSection } from './BigBrandsSection';
import { TopCategoriesSection } from './TopCategoriesSection';
import { TopCompaniesSection } from './TopCompaniesSection';
import { SeoKeywordsSection } from './SeoKeywordsSection';
import { useJobs, useProvinces, useJobCategories } from '../hooks/useJobs';
import { SectionFilterBar } from './SectionFilterBar';
import {
  JOB_FILTER_TYPES,
  SALARY_QUICK_OPTIONS,
  SALARY_PARAM_MAP,
  EXPERIENCE_QUICK_OPTIONS,
  EXPERIENCE_PARAM_MAP,
  LOCATION_QUICK_OPTIONS,
} from '../constants/filterOptions';

interface JobLandingSectionProps {
  onSearch: (filters: Partial<JobFilterParams>) => void;
}

export const JobLandingSection: React.FC<JobLandingSectionProps> = ({ onSearch }) => {
  const [page, setPage] = React.useState(1);
  const [activeFilterType, setActiveFilterType] = useState('location');

  // Filter values (one per type)
  const [locationValue, setLocationValue] = useState<string>('all');
  const [salaryValue, setSalaryValue] = useState<string>('all');
  const [expValue, setExpValue] = useState<string>('all');
  const [categoryValue, setCategoryValue] = useState<string>('all');

  // Province id resolved from locationValue
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
    return undefined; // north/south/central - skip for now
  };

  const provinceId = resolveProvinceId(locationValue);
  const { min: salaryMin, max: salaryMax } = SALARY_PARAM_MAP[salaryValue] ?? {};
  const experienceLevel = EXPERIENCE_PARAM_MAP[expValue];
  const categorySlug = categoryValue === 'all' ? undefined : categoryValue;

  const { data: response, isLoading } = useJobs({
    limit: 9,
    page,
    provinceId,
    salaryMin,
    salaryMax,
    experienceLevel,
    categorySlug,
  });

  const jobs = response?.data && response.data.length > 0 ? response.data : mockJobs.slice(0, 9);
  const totalPages = response?.meta?.totalPages ? Math.max(response.meta.totalPages, 1) : 1;

  // Build quick options depending on active filter type
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
    <div className="min-h-screen bg-[#f0f0f0] pb-10">
      <div className="bg-[#4F46E5] pt-10 pb-6 px-4">
        <div className="max-w-[1140px] mx-auto text-center">
          <h1 className="text-[28px] md:text-[32px] font-bold text-white mb-2">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
          </h1>
          <p className="text-white/90 text-[15px] mb-8">
            Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>
          <JobFilters onSearch={onSearch} initialProvinceId={provinceId} />
        </div>
      </div>

      <HeroBanner />

      <div className="max-w-[1140px] mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5">
            <h2 className="text-[24px] font-bold text-[#212f3f] flex-shrink-0">Việc làm tốt nhất</h2>
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
                <JobCard key={`${job.id}-${idx}`} job={job} viewMode="compact" />
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

      <AttractiveJobsSection />
      <BigBrandsSection />

      <div className="max-w-[1140px] mx-auto px-4">
        <TopCategoriesSection />
        <TopCompaniesSection />
        <SeoKeywordsSection />
      </div>
    </div>
  );
};
