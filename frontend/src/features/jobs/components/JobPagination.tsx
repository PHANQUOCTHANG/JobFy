import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const JobPagination: React.FC<JobPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6 mb-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded border border-[#e8e8e8] text-[#6f7882] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
      >
        <ChevronLeft size={15} />
      </button>

      {generatePageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`dot-${index}`} className="w-9 h-9 flex items-center justify-center text-[#9ea5af] text-[13px]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded border text-[13px] font-medium transition-all',
              currentPage === page
                ? 'bg-[#4F46E5] border-[#4F46E5] text-white'
                : 'border-[#e8e8e8] text-[#212f3f] hover:border-[#4F46E5] hover:text-[#4F46E5] bg-white'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded border border-[#e8e8e8] text-[#6f7882] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
};
