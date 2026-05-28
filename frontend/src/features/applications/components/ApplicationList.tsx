import React from 'react';
import { JobApplication } from '../types';
import { ApplicationCard } from './ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ApplicationListProps {
  applications: JobApplication[];
  isLoading?: boolean;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({ applications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-5 flex gap-4">
            <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-xl bg-muted/20 flex flex-col items-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Chưa có hồ sơ ứng tuyển</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Bạn chưa ứng tuyển công việc nào. Khám phá hàng ngàn cơ hội việc làm hấp dẫn ngay bây giờ!
        </p>
        <Button asChild>
          <Link to="/jobs">Tìm việc ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
};
