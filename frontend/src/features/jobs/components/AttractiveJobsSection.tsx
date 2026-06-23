import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { JobCard } from './JobCard';
import { JobSkeletonCard } from './JobSkeletonCard';
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

export const AttractiveJobsSection: React.FC = () => {
  const [page, setPage] = useState(1);
  const [activeFilterType, setActiveFilterType] = useState('location');

  // Filter values
  const [locationValue, setLocationValue] = useState<string>('all');
  const [salaryValue, setSalaryValue] = useState<string>('all');
  const [expValue, setExpValue] = useState<string>('all');
  const [categoryValue, setCategoryValue] = useState<string>('all');

  const { data: provinces } = useProvinces();
  const { data: categories } = useJobCategories();

  const resolveLocation = (val: string): { provinceId?: number; region?: string } => {
    if (val === 'all') return {};
    const provinceMap: Record<string, string> = {
      hanoi: 'Hà Nội',
      hcm: 'Hồ Chí Minh',
      danang: 'Đà Nẵng',
    };
    if (provinceMap[val]) {
      return { provinceId: provinces?.find(p => p.name === provinceMap[val])?.id };
    }
    const regionMap: Record<string, string> = {
      north: 'Miền Bắc',
      south: 'Miền Nam',
      central: 'Miền Trung',
    };
    if (regionMap[val]) {
      return { region: regionMap[val] };
    }
    return {};
  };

  const { provinceId, region } = resolveLocation(locationValue);
  const { min: salaryMin, max: salaryMax } = SALARY_PARAM_MAP[salaryValue] ?? {};
  const experienceLevel = EXPERIENCE_PARAM_MAP[expValue];
  const categorySlug = categoryValue === 'all' ? undefined : categoryValue;

  const { data: response, isLoading } = useJobs({
    limit: 6,
    page,
    provinceId,
    region,
    salaryMin,
    salaryMax,
    experienceLevel,
    categorySlug,
  });

  const jobs = response?.data !== undefined ? response.data : [];
  const totalPages = response?.meta?.totalPages ? Math.max(response.meta.totalPages, 1) : 1;

  const categoryQuickOptions = [
    { label: 'Tất cả', value: 'all' },
    ...(categories || []).slice(0, 8).map(c => ({ label: c.name, value: c.slug })),
  ];

  const quickOptions =
    activeFilterType === 'location'   ? LOCATION_QUICK_OPTIONS :
    activeFilterType === 'salary'     ? SALARY_QUICK_OPTIONS :
    activeFilterType === 'experience' ? EXPERIENCE_QUICK_OPTIONS :
    categoryQuickOptions;

  const activeQuickValue =
    activeFilterType === 'location'   ? locationValue :
    activeFilterType === 'salary'     ? salaryValue :
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
    <div className="max-w-[1140px] mx-auto px-4 mt-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#4F46E5] flex items-center gap-2">
                Việc làm hấp dẫn
                <span className="text-[#9ea5af] mx-1">|</span>
                <span className="flex items-center gap-1 text-[#212f3f] text-[13px] font-normal">
                  Đề xuất bởi <span className="font-bold text-[#4F46E5] ml-1">TOPPY<span className="text-[#6f7882]">AI</span></span>
                </span>
              </h2>
              <button className="text-[13px] text-[#4F46E5] hover:text-[#3730A3] font-medium underline underline-offset-2 transition-colors whitespace-nowrap">
                Xem tất cả
              </button>
            </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => <JobSkeletonCard key={i} viewMode="compact" />)
            ) : jobs.length > 0 ? (
              jobs.map((job, idx) => (
                <div key={`${job.id}-${idx}`} className="relative">
                  {idx === 0 && (
                    <div className="absolute -top-2 left-4 z-10 bg-[#ff4b4b] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-white">
                      HOT
                    </div>
                  )}
                  {idx === 4 && (
                    <div className="absolute -top-2 left-4 z-10 bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-white flex items-center gap-1">
                      <Zap size={10} /> MỚI
                    </div>
                  )}
                  <JobCard job={job} viewMode="compact" />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-[#6f7882]">
                Không có việc làm nào phù hợp với bộ lọc hiện tại.
              </div>
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

        <div className="w-full lg:w-[300px] rounded-lg overflow-hidden shadow-sm hidden lg:block flex-shrink-0">
          <img
            src="/images/banners/vertical_ad.png"
            alt="Quảng cáo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
