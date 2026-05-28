import React from 'react';
import { Resume } from '../types';
import { ResumeCard } from './ResumeCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ResumeListProps {
  resumes: Resume[];
  isLoading?: boolean;
  onAddClick?: () => void;
  onEditClick?: (id: string) => void;
  onDeleteClick?: (id: string) => void;
  isPublicView?: boolean;
}

export const ResumeList: React.FC<ResumeListProps> = ({ 
  resumes, 
  isLoading, 
  onAddClick,
  onEditClick,
  onDeleteClick,
  isPublicView = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-4 space-y-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Danh sách CV của bạn</h3>
        {!isPublicView && (
          <Button onClick={onAddClick}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo CV mới
          </Button>
        )}
      </div>

      {(!resumes || resumes.length === 0) ? (
        <div className="text-center p-12 border border-dashed rounded-xl bg-muted/20">
          <p className="text-muted-foreground mb-4">Bạn chưa có hồ sơ CV nào.</p>
          {!isPublicView && (
            <Button variant="outline" onClick={onAddClick}>Tạo CV ngay</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard 
              key={resume.id} 
              resume={resume} 
              onEdit={onEditClick}
              onDelete={onDeleteClick}
              isPublicView={isPublicView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
