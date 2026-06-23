import React from 'react';
import { Heart, MapPin, Briefcase, Clock, Building2 } from 'lucide-react';
import { Job } from '../types';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { formatSalary } from '@/utils/formatters';
import { useAppSelector } from '@/store/hooks';
import { useSavedJobIds, useSaveJob, useUnsaveJob } from '../hooks/useJobs';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
  viewMode?: 'list' | 'grid' | 'compact';
  disableHoverCard?: boolean;
}

const EXPERIENCE_LABEL: Record<string, string> = {
  intern: 'Thực tập sinh',
  fresher: 'Không yêu cầu',
  junior: 'Dưới 1 năm',
  mid: '1 - 3 năm',
  senior: '3 - 5 năm',
  lead: '5 - 7 năm',
  manager: 'Trên 7 năm',
};

const formatSalaryVND = (min?: number, max?: number, isPublic?: boolean) => {
  if (!isPublic) return 'Thỏa thuận';
  if (!min && !max) return 'Thỏa thuận';
  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${v / 1_000_000} triệu`;
    return `${v.toLocaleString('vi-VN')} đ`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `Từ ${fmt(min)}`;
  if (max) return `Đến ${fmt(max)}`;
  return 'Thỏa thuận';
};

export const JobCard: React.FC<JobCardProps> = ({ job, onSave, isSaved = false, viewMode = 'list', disableHoverCard = false }) => {
  const navigate = useNavigate();
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

  const isActuallySaved = savedIds.includes(job.id) || isSaved;

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCandidate) {
      toast.error('Vui lòng đăng nhập với tư cách ứng viên để lưu công việc');
      return;
    }
    if (isActuallySaved) {
      unsaveJob(job.id);
    } else {
      saveJob(job.id);
    }
    onSave?.(job.id);
  };
  const daysLeft = job.expiresAt ? differenceInDays(new Date(job.expiresAt), new Date()) : null;

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to job detail which will automatically open the apply modal if configured, or just navigate
    navigate(`/jobs/${job.slug || job.id}`);
  };

  const renderCardContent = () => {
    if (viewMode === 'compact') {
      return (
        <Link target="_blank" rel="noopener noreferrer" to={`/jobs/${job.slug || job.id}`} className="group bg-white border border-[#e8e8e8] rounded-lg p-3 transition-all hover:border-indigo-600 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between h-full block">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-[48px] h-[48px] border border-[#e8e8e8] rounded flex-shrink-0 bg-white p-1 flex items-center justify-center">
              {job.company?.logoUrl ? (
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-300" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-bold text-[14px] text-[#212f3f] leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
                      {job.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] bg-slate-900 text-white text-sm">
                    {job.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-[#6f7882] text-[12px] uppercase truncate">
                {job.company?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px] font-medium">
                {salaryDisplay}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
                {job.address || [job.district?.name, job.province?.name].filter(Boolean).join(", ") || 'Toàn quốc'}
              </span>
            </div>
            
            <button
              onClick={handleToggleSave}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 flex-shrink-0",
                isActuallySaved ? "bg-indigo-600 text-white" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              )}
              title={isActuallySaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
            >
              <Heart size={14} className={isActuallySaved ? "fill-white" : ""} />
            </button>
          </div>
        </Link>
      );
    }

    if (viewMode === 'list') {
      return (
        <Link
          target="_blank" 
          rel="noopener noreferrer"
          to={`/jobs/${job.slug || job.id}`}
          className="group bg-white border border-[#4F46E5] rounded-[16px] p-4 transition-all hover:shadow-md cursor-pointer flex flex-row items-start gap-4 w-full"
        >
          <div className="w-[100px] h-[100px] border border-[#4F46E5] rounded-xl flex-shrink-0 bg-white p-2 flex items-center justify-center">
             {job.company?.logoUrl ? (
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-slate-300" />
              )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
            <div>
               <div className="flex items-start justify-between gap-3 mb-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h3 className="font-bold text-[16px] text-[#212f3f] leading-snug truncate group-hover:text-[#4F46E5] transition-colors flex items-center gap-1.5">
                          {job.title}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                            <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="#4F46E5"/>
                            <path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </h3>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] bg-slate-900 text-white text-sm">
                        {job.title}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 text-[#4F46E5] font-bold text-[15px] whitespace-nowrap">
                      {salaryDisplay}
                    </span>
                    <button
                      onClick={handleToggleSave}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 flex-shrink-0",
                        isActuallySaved ? "bg-indigo-600 text-white shadow-sm" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                      )}
                      title={isActuallySaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
                    >
                      <Heart size={15} className={isActuallySaved ? "fill-white" : ""} />
                    </button>
                  </div>
               </div>
               
               <p className="text-[#6f7882] text-[13px] uppercase truncate mb-3 flex items-center gap-1.5">
                 {job.company?.name || 'CÔNG TY ẨN DANH'}
               </p>

               <div className="flex flex-wrap items-center gap-2">
                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f4f5f5] text-[#212f3f] text-[13px]">
                  <span className="truncate">{job.address || [job.district?.name, job.province?.name].filter(Boolean).join(", ") || 'Toàn quốc'}</span>
                 </span>
                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f4f5f5] text-[#212f3f] text-[13px]">
                   {EXPERIENCE_LABEL[job.experienceLevel || ''] || 'Không yêu cầu'}
                 </span>
               </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center text-[13px] text-[#6f7882]">
               <span className="truncate max-w-[80%]">
                 {EXPERIENCE_LABEL[job.experienceLevel || ''] || 'Không yêu cầu'} kinh nghiệm chuyên môn
                 {job.jobSkills && job.jobSkills.length > 0 && (
                    <>
                      <span className="mx-1.5">|</span>
                      {job.jobSkills[0].skill?.name}
                    </>
                 )}
               </span>
               {job.jobSkills && job.jobSkills.length > 1 && (
                 <span className="ml-1.5 font-medium text-[#212f3f]">+{job.jobSkills.length - 1}</span>
               )}
            </div>
          </div>
        </Link>
      );
    }

    // Grid View Fallback
    return (
      <Link
        target="_blank" 
        rel="noopener noreferrer"
        to={`/jobs/${job.slug || job.id}`}
        className="group bg-white border border-[#e8e8e8] rounded-lg p-4 transition-all hover:border-indigo-600 hover:shadow-md cursor-pointer flex flex-col gap-4 block"
      >
        <div className="w-[80px] h-[80px] border border-[#e8e8e8] rounded flex-shrink-0 bg-white p-1.5 flex items-center justify-center">
          {job.company?.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <Building2 className="w-10 h-10 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="font-bold text-[16px] text-[#212f3f] leading-snug truncate group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 text-indigo-600 font-bold text-[15px] whitespace-nowrap">
                {salaryDisplay}
              </span>
              <button
                onClick={handleToggleSave}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 flex-shrink-0",
                  isActuallySaved ? "bg-indigo-600 text-white shadow-sm" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                )}
                title={isActuallySaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
              >
                <Heart size={14} className={isActuallySaved ? "fill-white" : ""} />
              </button>
            </div>
          </div>

          <p className="text-[#6f7882] text-[13px] uppercase truncate mb-2">
            {job.company?.name}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
              {job.address ? job.address.split(',')[0] : (job.province?.name || 'Toàn quốc')}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
              {EXPERIENCE_LABEL[job.experienceLevel || ''] || 'Không yêu cầu'}
            </span>
          </div>

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#6f7882]">
              {job.jobSkills?.slice(0, 3).map((js, index) => (
                <React.Fragment key={js.skillId}>
                  {index > 0 && <span>|</span>}
                  <span className="truncate max-w-[120px]">{js.skill?.name || 'Kỹ năng'}</span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <span className="text-[12px] text-[#9ea5af] whitespace-nowrap">Đăng {timeDisplay}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (disableHoverCard) {
    return (
      <div className="w-full">
        {renderCardContent()}
      </div>
    );
  }

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="w-full">
          {renderCardContent()}
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent side="right" align="start" sideOffset={16} className="w-[450px] p-6 shadow-2xl rounded-2xl border-slate-100 z-[100] bg-white hidden lg:block">
        <div className="flex items-start gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="w-16 h-16 border border-slate-100 rounded-lg p-1 flex-shrink-0 flex items-center justify-center bg-white">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{job.title}</h3>
            <p className="text-sm text-slate-500 uppercase mb-2">{job.company?.name || 'Công ty ẩn danh'}</p>
            <div className="font-bold text-indigo-600">
              {formatSalaryVND(job.salaryMin, job.salaryMax, job.isSalaryPublic)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" /> 
            <span className="truncate max-w-[150px]">{job.address || 'Đang cập nhật'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" /> 
            {EXPERIENCE_LABEL[job.experienceLevel || ''] || 'Không yêu cầu'}
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> 
              {daysLeft >= 0 ? `Còn ${daysLeft} ngày` : 'Hết hạn'}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="font-bold text-slate-900 mb-2 border-l-4 border-indigo-600 pl-2 text-base">
            Mô tả công việc
          </div>
          <div 
            className="text-sm text-slate-600 line-clamp-4 prose prose-sm max-w-none leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-4 [&_p]:mb-2" 
            dangerouslySetInnerHTML={{ __html: job.description || 'Chưa cập nhật mô tả. Nhấn Xem chi tiết để biết thêm.' }} 
          />
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl"
            onClick={handleApplyClick}
          >
            Ứng tuyển
          </Button>
          <Button 
            className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
            onClick={() => navigate(`/jobs/${job.slug || job.id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
