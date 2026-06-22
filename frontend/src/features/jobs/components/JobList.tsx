import React from 'react';
import { Job, JobFilterParams } from '../types';
import { JobCard } from './JobCard';
import { JobSkeletonCard } from './JobSkeletonCard';
import { toast } from 'sonner';
import { SearchX } from 'lucide-react';
import { JobPagination } from './JobPagination';
import { cn } from '@/lib/utils';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  filters?: JobFilterParams;
  onClearFilters?: () => void;
  viewMode?: 'list' | 'grid';
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  filters,
  onClearFilters,
  viewMode = 'list',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSaveJob = (id: string) => {
    toast.success('Đã lưu việc làm vào danh sách yêu thích');
  };

  const hasActiveFilters =
    filters &&
    (filters.experienceLevel ||
      filters.jobType ||
      filters.salaryMin ||
      filters.isRemote ||
      filters.keyword ||
      filters.provinceId ||
      filters.categoryId);

  if (isLoading) {
    return (
      <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'flex flex-col gap-3')}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <JobSkeletonCard key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-[#e8e8e8] rounded-lg">
        <div className="w-16 h-16 bg-[#f0f0f0] rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-[#9ea5af]" />
        </div>
        <p className="text-[16px] font-bold text-[#212f3f] mb-2">
          Không tìm thấy công việc phù hợp
        </p>
        <p className="text-[13px] text-[#6f7882] mb-5 max-w-sm mx-auto leading-relaxed">
          Hãy thử thay đổi từ khóa hoặc điều chỉnh bộ lọc để tìm kiếm kết quả khác.
        </p>
        {hasActiveFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-5 py-2 border border-[#4F46E5] text-[#4F46E5] text-[13px] font-semibold rounded-md hover:bg-[#4F46E5] hover:text-white transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'flex flex-col gap-3')}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onSave={handleSaveJob} viewMode={viewMode} disableHoverCard={true} />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <JobPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
