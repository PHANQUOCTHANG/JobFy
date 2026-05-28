import React from 'react';
import { CompanyCard } from './CompanyCard';
import { Company } from '../types';
import { Skeleton } from '@/components/ui/skeleton';

interface CompanyListProps {
  companies: Company[];
  isLoading?: boolean;
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-xl border p-4 shadow-sm">
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed">
        <h3 className="text-lg font-medium">Không tìm thấy công ty nào</h3>
        <p className="text-muted-foreground mt-1">Hãy thử thay đổi bộ lọc tìm kiếm của bạn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};
