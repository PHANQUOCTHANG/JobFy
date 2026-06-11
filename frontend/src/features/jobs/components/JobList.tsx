import React from 'react';
import { Job, JobFilterParams } from '../types';
import { JobCard } from './JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  filters?: JobFilterParams;
  onClearFilters?: () => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, isLoading, filters, onClearFilters }) => {
  const handleSaveJob = (id: string) => {
    toast.success(`Đã lưu tin tuyển dụng ${id}`);
    // Thực tế sẽ gọi API useSaveJob
  };

  const hasActiveFilters = filters && Object.keys(filters).length > 0 && 
    (filters.experienceLevel || filters.jobType || filters.salaryMin || filters.isRemote || filters.keyword);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 h-[120px]">
            <Skeleton className="w-20 h-20 rounded-lg bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4 bg-slate-100" />
              <Skeleton className="h-4 w-1/2 bg-slate-100" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-20 bg-slate-100" />
                <Skeleton className="h-6 w-24 bg-slate-100" />
              </div>
            </div>
            <div className="hidden sm:flex flex-col justify-between items-end">
              <Skeleton className="h-6 w-32 bg-slate-100" />
              <Skeleton className="h-9 w-24 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center p-16 border border-dashed border-slate-300 rounded-xl bg-white shadow-sm mt-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy công việc phù hợp</p>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">Chúng tôi không tìm thấy kết quả nào khớp với bộ lọc của bạn. Hãy thử thay đổi từ khóa hoặc mở rộng tiêu chí tìm kiếm.</p>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="px-6 py-2.5 bg-[#1A56DB]/10 text-[#1A56DB] font-semibold rounded-lg hover:bg-[#1A56DB]/20 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-slate-500 mr-2">Đang lọc theo:</span>
          {filters.keyword && (
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 py-1 px-2.5 rounded-md font-medium">
              Từ khóa: {filters.keyword}
            </Badge>
          )}
          {filters.salaryMin && (
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 py-1 px-2.5 rounded-md font-medium">
              Lương &gt; {filters.salaryMin / 1000000} Tr
            </Badge>
          )}
          {filters.experienceLevel && (
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 py-1 px-2.5 rounded-md font-medium capitalize">
              {filters.experienceLevel.replace('_', ' ')}
            </Badge>
          )}
          {filters.isRemote && (
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-700 py-1 px-2.5 rounded-md font-medium">
              Làm việc từ xa
            </Badge>
          )}
          {hasActiveFilters && onClearFilters && (
            <button 
              onClick={onClearFilters}
              className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline ml-2"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      )}

      {/* 1 Column Layout */}
      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onSave={handleSaveJob} />
        ))}
      </div>
    </div>
  );
};

