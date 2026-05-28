import React, { useState } from 'react';
import { useJobs, JobFilters, JobList } from '@/features/jobs';

export const JobSearchPage: React.FC = () => {
  const [filters, setFilters] = useState({});
  const { data: response, isLoading } = useJobs(filters);
  
  const handleSearch = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Tìm kiếm công việc mơ ước của bạn
        </h1>
        <p className="text-lg text-muted-foreground">
          Khám phá hàng ngàn cơ hội việc làm từ các công ty hàng đầu.
        </p>
      </div>

      <JobFilters onSearch={handleSearch} />

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isLoading ? 'Đang tìm kiếm...' : (
              <>Việc làm phù hợp ({response?.meta?.total || (response?.data?.length || 0)})</>
            )}
          </h2>
        </div>
        
        <JobList jobs={response?.data || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default JobSearchPage;
