import React from 'react';
import { Heart } from 'lucide-react';
import { Job } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { formatSalary } from '@/utils/formatters';
import { useAppSelector } from '@/store/hooks';
import { useSavedJobIds, useSaveJob, useUnsaveJob } from '../hooks/useJobs';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  viewMode?: 'list' | 'grid' | 'compact';
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave, viewMode = 'list' }) => {
  const timeAgo = formatDistanceToNow(new Date(job.publishedAt || job.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  const salaryDisplay =
    job.isSalaryPublic && job.salaryMin && job.salaryMax
      ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
      : 'Thoả thuận';

  const formatTimeAgoText = (text: string) => {
    return text.replace('khoảng ', '').replace('trước', '').trim() + ' trước';
  };

  const timeDisplay = formatTimeAgoText(timeAgo);

  const { user } = useAppSelector((state) => state.auth);
  const isCandidate = user?.role === 'candidate';
  const { data: savedIds = [] } = useSavedJobIds(isCandidate);
  const { mutate: saveJob } = useSaveJob();
  const { mutate: unsaveJob } = useUnsaveJob();

  const isSaved = savedIds.includes(job.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCandidate) {
      toast.info('Vui lòng đăng nhập với tư cách ứng viên để lưu công việc');
      return;
    }
    if (isSaved) {
      unsaveJob(job.id, {
        onSuccess: () => toast.success('Đã bỏ lưu công việc'),
      });
    } else {
      saveJob(job.id, {
        onSuccess: () => toast.success('Đã lưu công việc'),
      });
    }
    onSave?.(job.id);
  };

  if (viewMode === 'compact') {
    return (
      <div className="group bg-white border border-[#e8e8e8] rounded-lg p-3 transition-all hover:border-[#4F46E5] hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between h-full">
        {/* Top section: Logo + Title + Company */}
        <div className="flex items-start gap-3 mb-3">
          {/* Small Logo */}
          <div className="w-[48px] h-[48px] border border-[#e8e8e8] rounded flex-shrink-0 bg-white p-1 flex items-center justify-center">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-[#f0f0f0] rounded flex items-center justify-center text-[8px] text-center text-[#6f7882] break-words">
                {job.company?.name || 'Company'}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[14px] text-[#212f3f] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors mb-1">
              {job.title}
            </h3>
            <p className="text-[#6f7882] text-[12px] uppercase truncate">
              {job.company?.name}
            </p>
          </div>
        </div>

        {/* Bottom section: Pills + Heart */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px] font-medium">
              {salaryDisplay}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
              {job.address || 'Hồ Chí Minh'}
            </span>
          </div>
          
          <button
            onClick={handleToggleSave}
            className={cn(
              "w-7 h-7 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
              isSaved 
                ? "border-[#4F46E5] bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:border-[#4338CA]" 
                : "border-[#4F46E5] text-[#4F46E5] hover:bg-blue-50"
            )}
          >
            <Heart size={14} className={isSaved ? "fill-white" : ""} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group bg-white border border-[#e8e8e8] rounded-lg p-4 transition-all hover:border-[#4F46E5] flex gap-4',
        viewMode === 'grid' ? 'flex-col' : 'flex-row items-start'
      )}
    >
      {/* Logo */}
      <div className="w-[80px] h-[80px] border border-[#e8e8e8] rounded flex-shrink-0 bg-white p-1.5 flex items-center justify-center">
        {job.company?.logoUrl ? (
          <img
            src={job.company.logoUrl}
            alt={job.company.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-[#f0f0f0] rounded flex items-center justify-center text-[10px] text-center text-[#6f7882] break-words">
            {job.company?.name || 'Company'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-[16px] text-[#212f3f] leading-snug truncate group-hover:text-[#4F46E5] transition-colors">
            {job.title}
          </h3>
          <span className="flex-shrink-0 text-[#4F46E5] font-bold text-[15px] whitespace-nowrap">
            {salaryDisplay}
          </span>
        </div>

        {/* Company name */}
        <p className="text-[#6f7882] text-[13px] uppercase truncate mb-2">
          {job.company?.name}
        </p>

        {/* Chips row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
            {job.address || 'Hồ Chí Minh'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
            {job.experienceLevel === 'fresher' ? 'Không yêu cầu' : '1 năm'}
          </span>
        </div>

        {/* Skills and Date row */}
        <div className="flex items-end justify-between mt-auto">
          {/* Skills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#6f7882]">
            {job.jobSkills?.slice(0, 3).map((js, index) => (
              <React.Fragment key={js.skillId}>
                {index > 0 && <span>|</span>}
                <span className="truncate max-w-[120px]">{js.skill?.name || 'Kỹ năng'}</span>
              </React.Fragment>
            ))}
            {job.jobSkills && job.jobSkills.length > 3 && (
              <>
                <span>|</span>
                <span>+{job.jobSkills.length - 3}</span>
              </>
            )}
          </div>

          {/* Date and Heart */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="text-[12px] text-[#9ea5af] whitespace-nowrap">Đăng {timeDisplay}</span>
            <button
              onClick={handleToggleSave}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                isSaved 
                  ? "border-[#4F46E5] bg-[#4F46E5] text-white hover:bg-[#4338CA] hover:border-[#4338CA]" 
                  : "border-[#4F46E5] text-[#4F46E5] hover:bg-blue-50"
              )}
            >
              <Heart size={16} className={isSaved ? "fill-white" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
