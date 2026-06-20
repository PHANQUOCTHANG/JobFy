import React from "react";
import { useJobs } from "../hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  Heart,
  MapPin,
  Briefcase,
  Clock,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Job } from "../types";
import { mockJobs } from "../api/mockData";

const PRIMARY_COLOR = "#4F46E5";

interface RelatedJobsProps {
  categorySlug?: string;
  categoryId?: number;
  currentJobId: string;
}

const formatSalaryVND = (min?: number, max?: number, isPublic?: boolean) => {
  if (!isPublic) return "Thỏa thuận";
  if (!min && !max) return "Thỏa thuận";
  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${v / 1_000_000} triệu`;
    return `${v.toLocaleString("vi-VN")} đ`;
  };
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `Từ ${fmt(min)}`;
  if (max) return `Đến ${fmt(max)}`;
  return "Thỏa thuận";
};

const EXPERIENCE_LABEL: Record<string, string> = {
  intern: "Thực tập sinh",
  fresher: "Không yêu cầu",
  junior: "Dưới 1 năm",
  mid: "1 - 3 năm",
  senior: "3 - 5 năm",
  lead: "5 - 7 năm",
  manager: "Trên 7 năm",
};

const RelatedJobItem: React.FC<{ job: Job }> = ({ job }) => {
  const navigate = useNavigate();

  const daysLeft = job.expiresAt
    ? differenceInDays(new Date(job.expiresAt), new Date())
    : null;
  const timeUpdated = job.updatedAt
    ? formatDistanceToNow(new Date(job.updatedAt), {
        locale: vi,
        addSuffix: true,
      })
    : "Gần đây";

  const handleClick = (e: React.MouseEvent) => {
    // Only navigate if we didn't click a button
    if (!(e.target as HTMLElement).closest("button")) {
      navigate(`/jobs/${job.slug}`);
    }
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div
          onClick={handleClick}
          className="group relative bg-white border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-indigo-500 hover:bg-indigo-50/20 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 border border-slate-100 rounded-lg bg-white p-1 flex-shrink-0 shadow-sm flex items-center justify-center">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h4>
              <div className="text-sm text-slate-500 uppercase mt-1 mb-2 line-clamp-1">
                {job.company?.name || "Công ty ẩn danh"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                {job.address ? job.address.split(",")[0] : "Đang cập nhật"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between self-stretch w-[160px] flex-shrink-0 pl-2">
            <div className="text-indigo-600 font-bold text-sm text-right line-clamp-1">
              {formatSalaryVND(
                job.salaryMin,
                job.salaryMax,
                job.isSalaryPublic,
              )}
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <div className="hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                <Button
                  size="sm"
                  className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md px-4"
                >
                  Ứng tuyển
                </Button>
              </div>
              <div className="block group-hover:hidden text-xs text-slate-400">
                {timeUpdated}
              </div>
              <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-rose-50 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        sideOffset={16}
        className="w-[450px] p-6 shadow-2xl rounded-2xl border-slate-100 z-[100] bg-white"
      >
        <div className="flex items-start gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="w-16 h-16 border border-slate-100 rounded-lg p-1 flex-shrink-0 flex items-center justify-center bg-white">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 uppercase mb-2">
              {job.company?.name || "Công ty ẩn danh"}
            </p>
            <div className="font-bold text-indigo-600">
              {formatSalaryVND(
                job.salaryMin,
                job.salaryMax,
                job.isSalaryPublic,
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600 mb-5 bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[150px]">
              {job.address || "Đang cập nhật"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            {EXPERIENCE_LABEL[job.experienceLevel || ""] || "Không yêu cầu"}
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              {daysLeft >= 0 ? `Còn ${daysLeft} ngày` : "Hết hạn"}
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
            dangerouslySetInnerHTML={{
              __html: job.description || "Chưa cập nhật mô tả",
            }}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl"
            onClick={(e) => {
              e.stopPropagation(); /* TODO: handle apply open */
            }}
          >
            Ứng tuyển
          </Button>
          <Button
            className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20"
            onClick={() => navigate(`/jobs/${job.slug}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export const RelatedJobs: React.FC<RelatedJobsProps> = ({
  categorySlug,
  categoryId,
  currentJobId,
}) => {
  const navigate = useNavigate();
  const { data: jobsData, isLoading } = useJobs({
    categorySlug: categorySlug || undefined,
    categoryId: !categorySlug ? categoryId : undefined,
    limit: 6, // Fetch slightly more to ensure we have enough after filtering
  });

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
          Việc làm liên quan
        </h3>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl bg-white/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-white/60" />
          <Skeleton className="h-24 w-full rounded-xl bg-white/60" />
        </div>
      </div>
    );
  }

  // Lấy danh sách lọc bỏ công việc hiện tại
  let relatedJobs =
    jobsData?.data?.filter((job) => job.id !== currentJobId) || [];

  // Nếu BE trả về rỗng (có thể do chưa có data cùng danh mục), dùng mock data để demo UI
  if (relatedJobs.length === 0) {
    relatedJobs = mockJobs.filter((job) => job.id !== currentJobId);
  }

  relatedJobs = relatedJobs.slice(0, 5);

  if (relatedJobs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
          Việc làm liên quan
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {relatedJobs.map((job) => (
          <RelatedJobItem key={job.id} job={job} />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/jobs?categorySlug=${categorySlug || categoryId}`)
          }
          className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold"
        >
          Xem thêm công việc
        </Button>
      </div>
    </div>
  );
};
