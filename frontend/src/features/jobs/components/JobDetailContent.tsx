import React from 'react';
import { Job } from '../types';

interface JobDetailContentProps {
  job: Job;
}

export const JobDetailContent: React.FC<JobDetailContentProps> = ({ job }) => {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8 space-y-8">
      <section>
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3 mb-4">Mô tả công việc</h2>
        <div className="prose max-w-none dark:prose-invert">
          {job.description ? (
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          ) : (
            <p className="text-muted-foreground italic">Đang cập nhật...</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3 mb-4">Yêu cầu ứng viên</h2>
        <div className="prose max-w-none dark:prose-invert">
          {job.requirements ? (
            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
          ) : (
            <p className="text-muted-foreground italic">Đang cập nhật...</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold border-l-4 border-primary pl-3 mb-4">Quyền lợi</h2>
        <div className="prose max-w-none dark:prose-invert">
          {job.benefits ? (
            <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
          ) : (
            <p className="text-muted-foreground italic">Đang cập nhật...</p>
          )}
        </div>
      </section>
    </div>
  );
};
