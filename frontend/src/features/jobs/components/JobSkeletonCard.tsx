import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface JobSkeletonCardProps {
  viewMode?: 'list' | 'grid' | 'compact';
}

export const JobSkeletonCard: React.FC<JobSkeletonCardProps> = ({ viewMode = 'list' }) => {
  if (viewMode === 'compact') {
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-lg p-3 flex flex-col justify-between h-full">
        {/* Top section: Logo + Title + Company */}
        <div className="flex items-start gap-3 mb-3">
          {/* Small Logo */}
          <Skeleton className="w-[48px] h-[48px] rounded flex-shrink-0 bg-[#f0f0f0] skeleton-shimmer" />
          
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-full bg-[#f0f0f0] skeleton-shimmer" />
            <Skeleton className="h-3 w-2/3 bg-[#f0f0f0] skeleton-shimmer" />
          </div>
        </div>

        {/* Bottom section: Pills + Heart */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded bg-[#f0f0f0] skeleton-shimmer" />
            <Skeleton className="h-5 w-16 rounded bg-[#f0f0f0] skeleton-shimmer" />
          </div>
          
          <Skeleton className="w-7 h-7 rounded-full bg-[#f0f0f0] flex-shrink-0 skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white border border-[#e8e8e8] rounded-lg p-4 flex gap-4',
        viewMode === 'grid' ? 'flex-col' : 'flex-row items-start'
      )}
    >
      {/* Logo */}
      <Skeleton className="w-[80px] h-[80px] rounded bg-[#f0f0f0] flex-shrink-0 skeleton-shimmer" />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <Skeleton className="h-5 w-3/4 bg-[#f0f0f0] skeleton-shimmer" />
          <Skeleton className="h-5 w-24 bg-[#f0f0f0] flex-shrink-0 skeleton-shimmer" />
        </div>

        {/* Company name */}
        <Skeleton className="h-4 w-1/2 bg-[#f0f0f0] mb-2 skeleton-shimmer" />

        {/* Chips row */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pt-1">
          <Skeleton className="h-6 w-20 rounded bg-[#f0f0f0] skeleton-shimmer" />
          <Skeleton className="h-6 w-24 rounded bg-[#f0f0f0] skeleton-shimmer" />
        </div>

        {/* Skills and Date row */}
        <div className="flex items-end justify-between mt-auto pt-2">
          {/* Skills */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 bg-[#f0f0f0] skeleton-shimmer" />
            <Skeleton className="h-4 w-16 bg-[#f0f0f0] skeleton-shimmer" />
          </div>

          {/* Date and Heart */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <Skeleton className="h-4 w-20 bg-[#f0f0f0] skeleton-shimmer" />
            <Skeleton className="w-8 h-8 rounded-full bg-[#f0f0f0] flex-shrink-0 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
