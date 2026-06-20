import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useJob, JobDetailContent } from "@/features/jobs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  DollarSign,
  Building2,
  ChevronRight,
  Briefcase,
  AlertCircle,
  LogIn,
  Send,
  Heart,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { ApplyJobModal, useCheckApplied } from "@/features/applications";
import { JobDetailSidebar } from "@/features/jobs/components/JobDetailSidebar";
import { RelatedJobs } from "@/features/jobs/components/RelatedJobs";
import { JobFilters } from "@/features/jobs/components/JobFilters";
import { useAppSelector } from "@/store/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AUTH_PATHS } from "@/config/paths";
import { differenceInDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PRIMARY_COLOR = "#4F46E5";

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

// eslint-disable-next-line unused-imports/no-unused-vars
const JOB_TYPE_LABEL: Record<string, string> = {
  full_time: "Toàn thời gian",
  part_time: "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
  freelance: "Freelance",
  remote: "Remote",
};

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { data: job, isLoading } = useJob(slug || "");
  const { data: applicationStatus, isLoading: isLoadingStatus } =
    useCheckApplied(job?.id || "", user?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [job]);

  const handleApplyClick = () => {
    if (!user) {
      setIsLoginAlertOpen(true);
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Chỉ ứng viên mới có thể nộp hồ sơ ứng tuyển.');
      return;
    }
    setIsApplyModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (newFilters: any) => {
    const params = new URLSearchParams();
    if (newFilters.keyword) params.set("keyword", newFilters.keyword);
    if (newFilters.categorySlug) params.set("categorySlug", newFilters.categorySlug);
    if (newFilters.provinceId) params.set("provinceId", String(newFilters.provinceId));
    
    navigate(`/jobs?${params.toString()}`);
  };

  const handleGoToLogin = () => {
    setIsLoginAlertOpen(false);
    navigate(`${AUTH_PATHS.LOGIN}?redirect=${location.pathname}`);
  };

  if (isLoading) {
    return (
      <div className="bg-[#f4f5f5] min-h-screen pt-4 pb-16">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <Skeleton className="h-6 w-72 bg-gray-200" />
          <Skeleton className="h-64 w-full rounded-lg bg-white" />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <Skeleton className="h-96 w-full rounded-lg bg-white" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-lg bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f4f5f5] text-center px-4">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-5">
          <Briefcase className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Không tìm thấy công việc
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Tin tuyển dụng này có thể đã hết hạn hoặc đường dẫn không chính xác.
        </p>
        <button
          onClick={() => navigate("/jobs")}
          style={{ backgroundColor: PRIMARY_COLOR }}
          className="text-white font-semibold px-6 py-2.5 rounded-md hover:opacity-90 transition-opacity"
        >
          Khám phá việc làm khác
        </button>
      </div>
    );
  }

  const daysLeft = job.expiresAt
    ? differenceInDays(new Date(job.expiresAt), new Date())
    : null;
  const deadlineStr = job.expiresAt
    ? format(new Date(job.expiresAt), "dd/MM/yyyy", { locale: vi })
    : null;
  const isApplied = !!applicationStatus;

  return (
    <div className="bg-[#f4f5f5] min-h-screen pb-10">
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow transition-transform duration-300",
          isStickyVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm font-semibold border-b-0">
            <span className="text-[#4F46E5] border-b-2 border-[#4F46E5] pb-0.5 py-4">
              Chi tiết tin tuyển dụng
            </span>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
              Việc làm liên quan
            </span>
          </div>
          <button
            onClick={handleApplyClick}
            disabled={isApplied}
            style={{ backgroundColor: isApplied ? "#6b7280" : PRIMARY_COLOR }}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-md hover:opacity-90 transition-opacity disabled:cursor-default flex-shrink-0"
          >
            <Send className="w-4 h-4" />
            {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
          </button>
        </div>
      </div>

      <div className="bg-[#4F46E5] py-3 px-4">
        <div className="max-w-6xl mx-auto">
          <JobFilters onSearch={handleSearch} />
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500 gap-1">
            <Link to="/" className="hover:text-[#4F46E5] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/jobs" className="hover:text-[#4F46E5] transition-colors">
              Tìm việc làm
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 line-clamp-1">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-4 space-y-4">
        <div ref={headerRef} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 border border-gray-200 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
              {job.company?.logoUrl ? (
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-gray-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-1">
                {job.title}
                {job.company?.isVerified && (
                  <span
                    className="inline-flex items-center ml-2 text-[#4F46E5]"
                    title="Đã xác minh"
                  >
                    ✔
                  </span>
                )}
              </h1>

              <Link
                to={job.company?.slug ? `/companies/${job.company.slug}` : "#"}
                style={{ color: PRIMARY_COLOR }}
                className="text-base font-semibold hover:underline"
              >
                {job.company?.name || "Công ty ẩn danh"}
              </Link>

              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#e6f4ee" }}
                  >
                    <DollarSign
                      className="w-5 h-5"
                      style={{ color: PRIMARY_COLOR }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Mức lương</div>
                    <div className="font-bold text-gray-900 text-sm">
                      {formatSalaryVND(
                        job.salaryMin,
                        job.salaryMax,
                        job.isSalaryPublic,
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#e6f4ee" }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: PRIMARY_COLOR }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Địa điểm</div>
                    <div className="font-bold text-gray-900 text-sm line-clamp-1 max-w-[160px]">
                      {job.address || "Đang cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#e6f4ee" }}
                  >
                    <Briefcase
                      className="w-5 h-5"
                      style={{ color: PRIMARY_COLOR }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Kinh nghiệm</div>
                    <div className="font-bold text-gray-900 text-sm">
                      {EXPERIENCE_LABEL[job.experienceLevel || ""] ||
                        "Không yêu cầu"}
                    </div>
                  </div>
                </div>
              </div>

              {deadlineStr && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Hạn nộp hồ sơ:{" "}
                  <strong
                    className={
                      daysLeft !== null && daysLeft <= 3
                        ? "text-red-500"
                        : "text-gray-800"
                    }
                  >
                    {deadlineStr}
                    {daysLeft !== null && daysLeft >= 0 && (
                      <span className="ml-1 font-normal text-gray-500">
                        (Còn {daysLeft} ngày)
                      </span>
                    )}
                    {daysLeft !== null && daysLeft < 0 && (
                      <span className="ml-1 font-normal text-red-500">
                        (Đã hết hạn)
                      </span>
                    )}
                  </strong>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={handleApplyClick}
                  disabled={isApplied || isLoadingStatus}
                  style={{
                    backgroundColor: isApplied ? "#6b7280" : PRIMARY_COLOR,
                  }}
                  className="flex items-center gap-2 text-white font-bold px-8 py-3 rounded-md hover:opacity-90 transition-opacity disabled:cursor-default text-sm"
                >
                  <Send className="w-4 h-4" />
                  {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                </button>

                <button
                  style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  className="flex items-center gap-2 font-bold px-6 py-3 rounded-md border-2 bg-white hover:bg-indigo-50 transition-colors text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Lưu tin
                </button>

                <div className="flex items-center gap-2 ml-auto">
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          <div className="space-y-4">
            <JobDetailContent job={job} />

            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-600 text-sm mb-4 text-center">
                Hạn nộp hồ sơ:{" "}
                <strong className="text-gray-900">
                  {deadlineStr || "Không giới hạn"}
                </strong>
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleApplyClick}
                  disabled={isApplied}
                  style={{
                    backgroundColor: isApplied ? "#6b7280" : PRIMARY_COLOR,
                  }}
                  className="flex items-center gap-2 text-white font-bold px-8 py-3 rounded-md hover:opacity-90 transition-opacity disabled:cursor-default text-sm"
                >
                  <Send className="w-4 h-4" />
                  {isApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                </button>
                <button
                  style={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                  className="flex items-center gap-2 font-bold px-6 py-3 rounded-md border-2 bg-white hover:bg-indigo-50 transition-colors text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Lưu tin
                </button>
              </div>

              <p className="text-center mt-4 text-xs text-gray-400">
                Báo cáo tin tuyển dụng:{" "}
                <button className="underline hover:text-red-500 transition-colors">
                  Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu
                  hiệu lừa đảo,{" "}
                  <span style={{ color: PRIMARY_COLOR }}>
                    hãy phản ánh với chúng tôi.
                  </span>
                </button>
              </p>
            </div>

            <RelatedJobs
              categorySlug={job.category?.slug}
              categoryId={job.categoryId}
              currentJobId={job.id}
            />
          </div>

          <div className="sticky top-16 space-y-4">
            <JobDetailSidebar
              job={job}
              applicationStatus={applicationStatus}
              isLoadingStatus={isLoadingStatus}
              onApplyClick={handleApplyClick}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={isLoginAlertOpen} onOpenChange={setIsLoginAlertOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-[420px] bg-white border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-[#4F46E5]/10 pt-8 pb-6 px-6 flex flex-col items-center border-b border-[#4F46E5]/10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#4F46E5]/20">
              <AlertCircle className="w-8 h-8 text-[#4F46E5]" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-bold text-gray-900">
              Yêu cầu đăng nhập
            </AlertDialogTitle>
          </div>
          
          <div className="px-6 py-6">
            <AlertDialogDescription className="text-center text-[15px] leading-relaxed text-gray-600 mb-6">
              Bạn cần đăng nhập bằng tài khoản ứng viên để có thể tiếp tục nộp hồ sơ ứng tuyển cho công việc này.
            </AlertDialogDescription>
            
            <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-0">
              <AlertDialogCancel className="mt-0 w-full rounded-xl h-12 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors">
                Để sau
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGoToLogin}
                style={{ backgroundColor: PRIMARY_COLOR }}
                className="w-full rounded-xl h-12 font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập ngay
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {job && (
        <ApplyJobModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company?.name || "Công ty ẩn danh"}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
