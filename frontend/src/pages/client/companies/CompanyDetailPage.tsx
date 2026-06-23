import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useCompany, 
  useCompanyReviews, 
  CompanyHeader, 
  CompanyReviews 
} from '@/features/companies';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Briefcase, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useJobs } from '@/features/jobs';
import { JobCard } from '@/features/jobs/components/JobCard';
import { JobSkeletonCard } from '@/features/jobs/components/JobSkeletonCard';

const tabs = [
  { id: 'about', label: 'Giới thiệu', icon: Building2 },
  { id: 'jobs', label: 'Tuyển dụng', icon: Briefcase },
  { id: 'reviews', label: 'Đánh giá', icon: Star },
];

export const CompanyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('about');
  
  const { data: company, isLoading: isLoadingCompany } = useCompany(slug || '');
  const { data: reviews, isLoading: isLoadingReviews } = useCompanyReviews(company?.id || '');
  const { data: companyJobsResponse, isLoading: isLoadingCompanyJobs } = useJobs({ companyId: company?.id });
  const companyJobs = companyJobsResponse?.data || [];

  if (isLoadingCompany) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1140px] mx-auto py-8 px-4 space-y-6">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-[320px] w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-[26px] font-black text-foreground mb-3 tracking-tight">Không tìm thấy công ty</h2>
          <p className="text-muted-foreground text-[15px] mb-8">Công ty bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.</p>
          <Button asChild className="rounded-xl px-6 py-5 font-bold shadow-brand">
            <Link to="/companies">← Quay lại danh sách công ty</Link>
          </Button>
        </div>
      </div>
    );
  }

  const tabCountMap: Record<string, number | undefined> = {
    jobs: companyJobsResponse?.meta?.total || companyJobs.length,
    reviews: company.totalReviews,
  };

  return (
    <div className="bg-background min-h-screen pb-20 font-sans">
      <div className="max-w-[1140px] mx-auto py-8 px-4">
        <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 font-semibold rounded-xl px-3">
          <Link to="/companies">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </Button>

        <CompanyHeader company={company} />

        <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-border/40 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const count = tabCountMap[tab.id];
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 py-4 px-6 text-[14.5px] font-bold whitespace-nowrap border-b-2 transition-all duration-200 flex-1 justify-center",
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {count !== undefined && (
                    <span className={cn(
                      "text-[11px] font-black px-2 py-0.5 rounded-full ml-1",
                      activeTab === tab.id
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8">
                <h3 className="text-[22px] font-black text-foreground mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-primary rounded-full shadow-glow-sm"></span>
                  Về chúng tôi
                </h3>
                <div className="prose prose-slate max-w-none text-[15px] leading-[1.8] text-foreground/90">
                  {company.description ? (
                    <div dangerouslySetInnerHTML={{ __html: company.description }} />
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Công ty chưa cập nhật thông tin giới thiệu.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {company.locations && company.locations.length > 0 && (
                <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8">
                  <h3 className="text-[22px] font-black text-foreground mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-7 bg-primary rounded-full shadow-glow-sm"></span>
                    Vị trí / Chi nhánh
                  </h3>
                  <div className="space-y-4">
                    {company.locations.map((loc, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="mt-0.5">
                          <Building2 className="w-5 h-5 text-primary/70" />
                        </div>
                        <div>
                          <div className="font-bold text-[15px] text-foreground mb-1">
                            {loc.isHeadquarters ? "Trụ sở chính" : "Chi nhánh"}
                          </div>
                          <div className="text-muted-foreground text-[14.5px]">
                            {loc.address}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {isLoadingCompanyJobs ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <JobSkeletonCard key={`skeleton-${index}`} />
                  ))
                ) : companyJobs.length > 0 ? (
                  companyJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className="col-span-full bg-card border border-border/40 rounded-2xl shadow-sm p-10 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Briefcase className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-[18px] font-bold text-foreground mb-2">Hiện chưa có việc làm nào</h3>
                    <p className="text-muted-foreground text-[14.5px]">Công ty này hiện tại không có công việc nào đang mở.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <CompanyReviews reviews={reviews || []} isLoading={isLoadingReviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
