import React, { useState } from "react";
import { Heart, Briefcase, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSavedJobs } from "@/features/jobs/hooks/useJobs";
import { JobList } from "@/features/jobs/components/JobList";

const SavedJobsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data, isLoading } = useSavedJobs({ page, limit });
  const savedJobs = data?.data || [];
  const meta = data?.meta;

  const jobsToDisplay = savedJobs.map((item: any) => ({
    ...item.job,
    // Provide some fallback for missing details in JobCard
    publishedAt: item.savedAt,
    createdAt: item.savedAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Việc làm đã lưu</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách các công việc bạn đã quan tâm và lưu lại để ứng tuyển sau.
        </p>
      </div>

      {isLoading ? (
        <JobList jobs={[]} isLoading={true} viewMode="grid" />
      ) : savedJobs.length > 0 ? (
        <JobList 
          jobs={jobsToDisplay} 
          viewMode="grid" 
          currentPage={meta?.page}
          totalPages={meta?.totalPages}
          onPageChange={setPage}
        />
      ) : (
        <div className="rounded-xl border bg-card p-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-blue-50 text-[#4F46E5] rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="fill-[#4F46E5]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Bạn chưa lưu công việc nào</h3>
          <p className="text-[#64748B] mb-6 max-w-sm text-[15px] leading-relaxed">
            Khám phá hàng ngàn công việc hấp dẫn và lưu lại để không bỏ lỡ cơ hội nghề nghiệp phù hợp.
          </p>
          <Button asChild className="bg-[#4F46E5] hover:bg-[#4338CA] h-11 px-8 rounded-xl font-bold">
            <Link to="/jobs">Khám phá Việc làm ngay</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
