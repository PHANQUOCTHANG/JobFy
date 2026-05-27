import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useCompany, 
  useCompanyReviews, 
  CompanyHeader, 
  CompanyReviews 
} from '@/features/companies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const CompanyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('about');
  
  const { data: company, isLoading: isLoadingCompany } = useCompany(slug || '');
  const { data: reviews, isLoading: isLoadingReviews } = useCompanyReviews(company?.id || '');

  if (isLoadingCompany) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-64 w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Không tìm thấy công ty</h2>
        <p className="text-muted-foreground mb-6">Công ty bạn đang tìm kiếm không tồn tại hoặc đã bị xoá.</p>
        <Button asChild>
          <Link to="/companies">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" asChild className="mb-6 -ml-4">
        <Link to="/companies">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Link>
      </Button>

      <CompanyHeader company={company} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="about">Giới thiệu</TabsTrigger>
          <TabsTrigger value="jobs">Tuyển dụng ({company.totalJobs})</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({company.totalReviews})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
            <div className="prose max-w-none dark:prose-invert">
              {company.description ? (
                <div dangerouslySetInnerHTML={{ __html: company.description }} />
              ) : (
                <p className="text-muted-foreground">Công ty chưa cập nhật thông tin giới thiệu.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="bg-card p-6 rounded-xl border shadow-sm text-center py-12">
            <p className="text-muted-foreground">Tính năng danh sách việc làm đang được cập nhật...</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <CompanyReviews reviews={reviews || []} isLoading={isLoadingReviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetailPage;
