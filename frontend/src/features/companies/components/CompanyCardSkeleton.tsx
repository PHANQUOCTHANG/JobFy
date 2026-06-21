import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

export const CompanyCardSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden flex flex-row items-center bg-white border border-[#e8e8e8] p-4 shadow-sm h-[130px] rounded-xl">
      <div className="w-[85px] h-[85px] flex-shrink-0 bg-white border border-[#e8e8e8] rounded-xl flex items-center justify-center mr-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-1.5">
        <Skeleton className="w-full h-full rounded-lg bg-[#f0f0f0] skeleton-shimmer" />
      </div>
      
      <div className="flex flex-col flex-grow justify-between h-full py-1">
        <div>
          <Skeleton className="h-5 w-3/4 mb-2 bg-[#f0f0f0] skeleton-shimmer" />
          <Skeleton className="h-4 w-full bg-[#f0f0f0] skeleton-shimmer" />
        </div>
        
        <div className="mt-1">
          <Skeleton className="h-6 w-[140px] rounded-md bg-[#f0f0f0] skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
