import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJob, JobDetailContent } from '@/features/jobs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, DollarSign, Clock, Building2, Send, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ApplyJobModal, useApplicationStatus } from '@/features/applications';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  
  const { data: job, isLoading } = useJob(slug || '');
  const { data: applicationStatus, isLoading: isLoadingStatus } = useApplicationStatus(job?.id || '');

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy công việc</h2>
        <p className="text-muted-foreground mb-6">Tin tuyển dụng này có thể đã hết hạn hoặc bị xóa.</p>
        <Button asChild>
          <Link to="/jobs">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6 -ml-4">
        <Link to="/jobs">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
      </Button>

      {/* Header */}
      <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
            <Link to={job.company?.slug ? `/companies/${job.company.slug}` : '#'} className="text-lg text-primary hover:underline flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5" />
              {job.company?.name || 'Công ty ẩn danh'}
            </Link>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium text-foreground">
                  {job.isSalaryPublic ? (
                    job.salaryMin && job.salaryMax 
                      ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
                      : 'Thỏa thuận'
                  ) : 'Thương lượng'}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                <MapPin className="w-4 h-4" />
                <span>{job.address || 'Không xác định'}</span>
              </div>

              {job.publishedAt && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                  <Clock className="w-4 h-4" />
                  <span>
                    Đăng {formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: vi })}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            {applicationStatus ? (
              <Button size="lg" className="w-full text-base" variant="secondary" disabled>
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                Đã ứng tuyển
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full text-base"
                onClick={() => setIsApplyModalOpen(true)}
                disabled={isLoadingStatus}
              >
                <Send className="w-4 h-4 mr-2" />
                Ứng tuyển ngay
              </Button>
            )}
            <Button variant="outline" size="lg" className="w-full text-base">
              Lưu tin
            </Button>
            
            {job.expiresAt && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Hết hạn: {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <JobDetailContent job={job} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Thông tin chung</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Kinh nghiệm</span>
                <span className="font-medium capitalize">{job.experienceLevel?.replace('_', ' ') || 'Không yêu cầu'}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Cấp bậc</span>
                <span className="font-medium capitalize">{job.jobType?.replace('_', ' ') || 'Nhân viên'}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Số lượng tuyển</span>
                <span className="font-medium">{job.quantity || 'Không giới hạn'} người</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Hình thức</span>
                <span className="font-medium">{job.isRemote ? 'Làm việc từ xa' : 'Tại văn phòng'}</span>
              </li>
            </ul>
          </div>
          
          {job.company && (
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">Về công ty</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold line-clamp-2">{job.company.name}</h4>
                  <Link to={`/companies/${job.company.slug}`} className="text-sm text-primary hover:underline">
                    Xem trang công ty
                  </Link>
                </div>
              </div>
            </div>
          )}
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
