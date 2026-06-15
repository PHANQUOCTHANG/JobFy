import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJob, JobDetailContent } from '@/features/jobs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, Clock, Building2, Send, CheckCircle2, ChevronRight, Bookmark, Share2, Briefcase } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ApplyJobModal, useApplicationStatus } from '@/features/applications';
import { cn } from '@/lib/utils';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  
  const { data: job, isLoading } = useJob(slug || '');
  const { data: applicationStatus, isLoading: isLoadingStatus } = useApplicationStatus(job?.id || '');

  if (isLoading) {
    return (
      <div className="bg-[#F4F6FA] min-h-screen pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-40 w-full rounded-2xl mb-8 bg-white/60" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl bg-white/60" />
            </div>
            <div>
              <Skeleton className="h-[500px] w-full rounded-2xl bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F4F6FA] text-center px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
          <Briefcase className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy công việc</h2>
        <p className="text-slate-500 mb-8 max-w-md">Tin tuyển dụng này có thể đã hết hạn, bị xóa hoặc đường dẫn không chính xác.</p>
        <Button asChild size="lg" className="bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl">
          <Link to="/jobs">Khám phá các việc làm khác</Link>
        </Button>
      </div>
    );
  }

  const daysUntilExpiry = job.expiresAt ? differenceInDays(new Date(job.expiresAt), new Date()) : 999;
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry >= 0;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-[#4F46E5] transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <Link to="/jobs" className="hover:text-[#4F46E5] transition-colors">Việc làm</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <span className="text-slate-800 truncate max-w-[200px] md:max-w-md">{job.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cột trái: Nội dung chính */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-3 shadow-sm flex-shrink-0">
                  {job.company?.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-slate-300" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                    {job.title}
                  </h1>
                  <Link to={job.company?.slug ? `/companies/${job.company.slug}` : '#'} className="text-lg font-medium text-slate-600 hover:text-[#4F46E5] transition-colors flex items-center gap-2 mb-6">
                    {job.company?.name || 'Công ty ẩn danh'}
                  </Link>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0 rounded-lg font-semibold px-3 py-1.5 text-sm">
                      <DollarSign className="w-4 h-4 mr-1.5" />
                      {job.isSalaryPublic ? (
                        job.salaryMin && job.salaryMax 
                          ? `${job.salaryMin / 1000000} - ${job.salaryMax / 1000000} Triệu`
                          : (job.salaryMin ? `Từ ${job.salaryMin / 1000000} Triệu` : 'Thỏa thuận')
                      ) : 'Mức lương thương lượng'}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 rounded-lg font-medium px-3 py-1.5 text-sm">
                      <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                      {job.address || 'Không xác định'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Tabs Detail */}
            <JobDetailContent job={job} />

          </div>
          
          {/* Cột phải: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Box Action */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="mb-6 space-y-4">
                  {applicationStatus ? (
                    <Button size="lg" className="w-full h-14 text-base font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Bạn đã ứng tuyển công việc này
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full h-14 text-base font-bold rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20 hover:-translate-y-0.5 transition-all"
                      onClick={() => setIsApplyModalOpen(true)}
                      disabled={isLoadingStatus}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Ứng tuyển ngay
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="lg" className="flex-1 h-12 rounded-xl font-medium border-slate-200 hover:bg-slate-50 text-slate-700">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Lưu tin
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 flex-shrink-0">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Ngày đăng</span>
                    <span className="font-medium text-slate-800">
                      {job.publishedAt ? formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: vi }) : 'Gần đây'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Hạn nộp</span>
                    <span className={cn("font-medium", isExpiringSoon ? "text-red-600" : "text-slate-800")}>
                      {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </span>
                  </div>
                  {isExpiringSoon && (
                    <div className="mt-2 text-xs font-medium text-red-500 bg-red-50 p-2 rounded-md text-center">
                      Nhanh tay! Chỉ còn {daysUntilExpiry} ngày nữa là hết hạn.
                    </div>
                  )}
                </div>
              </div>

              {/* Box Company Summary */}
              {job.company && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#4F46E5]" />
                    Thông tin chung
                  </h3>
                  
                  <ul className="space-y-4 text-sm">
                    <li className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                      <span className="text-slate-500">Cấp bậc / Kinh nghiệm</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {job.experienceLevel?.replace('_', ' ') || 'Không yêu cầu'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                      <span className="text-slate-500">Loại hình công việc</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {job.jobType?.replace('_', ' ') || 'Toàn thời gian'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                      <span className="text-slate-500">Số lượng cần tuyển</span>
                      <span className="font-semibold text-slate-800">
                        {job.quantity ? `${job.quantity} người` : 'Không giới hạn'}
                      </span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="text-slate-500">Hình thức làm việc</span>
                      <span className="font-semibold text-slate-800">
                        {job.isRemote ? 'Làm việc từ xa (Remote)' : 'Tại văn phòng'}
                      </span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <Link to={`/companies/${job.company.slug}`} className="text-[#4F46E5] text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                      Xem hồ sơ công ty <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {job && (
        <ApplyJobModal 
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.company?.name || 'Công ty ẩn danh'}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
