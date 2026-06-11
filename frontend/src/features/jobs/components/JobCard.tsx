import React from 'react';
import { Job } from '../types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MapPin, DollarSign, Clock, Building2, Bookmark, BookmarkCheck, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ job, isSaved = false, onSave, className }) => {
  const isHot = job.viewCount > 100;
  const daysUntilExpiry = job.expiresAt ? differenceInDays(new Date(job.expiresAt), new Date()) : 999;
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry >= 0;

  return (
    <div className={cn(
      "group bg-white border border-slate-200 rounded-xl p-4 hover:border-[#1A56DB]/40 hover:shadow-lg hover:shadow-[#1A56DB]/5 transition-all duration-300 relative overflow-hidden",
      isExpiringSoon && "border-red-100",
      className
    )}>
      {/* Optional: Add a left border accent for HOT jobs */}
      {isHot && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
        {/* Company Logo - Left */}
        <Link to={job.company?.slug ? `/companies/${job.company.slug}` : '#'} className="block flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm group-hover:border-[#1A56DB]/20 transition-colors">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>
        </Link>
        
        {/* Main Content - Middle */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/jobs/${job.slug}`} className="block group/title truncate">
              <h3 className="font-bold text-lg sm:text-[19px] text-slate-900 truncate leading-tight group-hover/title:text-[#1A56DB] transition-colors" title={job.title}>
                {job.title}
              </h3>
            </Link>
            {isHot && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-1.5 py-0 text-[10px] uppercase tracking-wider h-5 hidden sm:inline-flex items-center">
                Hot
              </Badge>
            )}
          </div>
          
          <Link to={job.company?.slug ? `/companies/${job.company.slug}` : '#'} className="text-sm font-medium text-slate-500 hover:text-slate-800 truncate transition-colors mb-3">
            {job.company?.name || 'Công ty ẩn danh'}
          </Link>

          {/* Badges Info */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 rounded-md font-medium px-2 py-0.5 whitespace-nowrap">
              <MapPin className="w-3 h-3 mr-1.5 text-slate-400" />
              {job.address?.split(',')[0] || 'Nhiều địa điểm'}
            </Badge>
            {job.experienceLevel && (
              <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 rounded-md font-medium px-2 py-0.5 whitespace-nowrap capitalize">
                {job.experienceLevel.replace('_', ' ')}
              </Badge>
            )}
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400 ml-auto sm:ml-2">
               <Clock className="w-3.5 h-3.5" />
               <span className={isExpiringSoon ? "text-red-500 font-semibold" : ""}>
                 {job.expiresAt ? (
                   isExpiringSoon 
                     ? `Còn ${daysUntilExpiry} ngày` 
                     : `Hạn: ${new Date(job.expiresAt).toLocaleDateString('vi-VN')}`
                 ) : 'Vừa đăng'}
               </span>
            </div>
          </div>
        </div>

        {/* Right Section - Salary & Actions */}
        <div className="w-full sm:w-auto sm:min-w-[180px] flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 gap-3">
          {/* Salary block highly emphasized */}
          <div className="flex items-center text-[#1A56DB] font-bold text-lg">
            <DollarSign className="w-5 h-5 mr-0.5" />
            {job.isSalaryPublic ? (
              job.salaryMin && job.salaryMax 
                ? `${job.salaryMin / 1000000} - ${job.salaryMax / 1000000} Tr`
                : (job.salaryMin ? `Từ ${job.salaryMin / 1000000} Tr` : 'Thỏa thuận')
            ) : 'Thương lượng'}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-lg border transition-all",
                isSaved ? "bg-[#1A56DB]/10 border-[#1A56DB]/20 text-[#1A56DB]" : "bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
              )}
              onClick={(e) => {
                e.preventDefault();
                onSave?.(job.id);
              }}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </Button>
            
            <Button className="h-9 px-4 rounded-lg bg-[#1A56DB] hover:bg-[#1447C0] text-white font-medium text-sm shadow-sm">
              Ứng tuyển
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

