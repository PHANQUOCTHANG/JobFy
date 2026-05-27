import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
}

export const JobList: React.FC<JobListProps> = ({ jobs, isLoading }) => {
  const handleSaveJob = (id: string) => {
    toast.success(`Đã lưu tin tuyển dụng ${id}`);
    // Thực tế sẽ gọi API useSaveJob
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-xl p-5 flex flex-col h-full space-y-4">
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-xl bg-muted/20">
        <p className="text-lg font-medium text-foreground mb-2">Không tìm thấy công việc phù hợp</p>
        <p className="text-muted-foreground">Vui lòng thử điều chỉnh lại bộ lọc tìm kiếm của bạn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onSave={handleSaveJob} />
      ))}
    </div>
  );
};
