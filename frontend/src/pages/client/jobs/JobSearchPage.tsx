import React, { useState } from 'react';
import { useJobs } from '@/features/jobs';
import { JobFilters } from '@/features/jobs/components/JobFilters';
import { JobList } from '@/features/jobs/components/JobList';
import { JobSidebarFilter } from '@/features/jobs/components/JobSidebarFilter';
import { JobSortBar } from '@/features/jobs/components/JobSortBar';
import { JobFilterParams } from '@/features/jobs/types';

export const JobSearchPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilterParams>({});
  const [sortBy, setSortBy] = useState('latest');
  
  const { data: response, isLoading } = useJobs({ ...filters, sort: sortBy } as any);
  
  const handleSearch = (newFilters: Partial<JobFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      keyword: prev.keyword,
      provinceId: prev.provinceId,
      categoryId: prev.categoryId,
    }));
  };

  const totalResults = response?.meta?.total || (response?.data?.length || 0);

  return (
    <div className="min-h-screen bg-[#F4F5F5] pb-12">
      {/* TopCV Style Hero Banner - Shorter, Flat Blue */}
      <div className="bg-[#1A56DB] pt-10 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium">
            Tiếp cận 30,000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>
        </div>
      </div>

      {/* Main Content Area - Shifted up to overlap the banner */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
        
        {/* Search Bar Container */}
        <div className="mb-6">
          <JobFilters 
            onSearch={handleSearch} 
            initialKeyword={filters.keyword}
            initialProvinceId={filters.provinceId}
            initialCategoryId={filters.categoryId}
          />
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <JobSidebarFilter 
              filters={filters} 
              onFilterChange={handleSearch} 
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Right Main Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <JobSortBar 
              totalResults={totalResults} 
              isLoading={isLoading} 
              sortBy={sortBy} 
              onSortChange={setSortBy} 
            />
            
            <JobList 
              jobs={response?.data || []} 
              isLoading={isLoading} 
              filters={filters} 
              onClearFilters={handleClearFilters} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
