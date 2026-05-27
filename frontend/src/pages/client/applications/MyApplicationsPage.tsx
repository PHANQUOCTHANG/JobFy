import React from 'react';
import { useMyApplications, ApplicationList } from '@/features/applications';

export const MyApplicationsPage: React.FC = () => {
  const { data: applications, isLoading } = useMyApplications();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lịch sử ứng tuyển</h1>
        <p className="text-muted-foreground mt-1">
          Theo dõi trạng thái các công việc bạn đã nộp hồ sơ.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[400px]">
        <ApplicationList applications={applications || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default MyApplicationsPage;
