import React from 'react';
import { cn } from '@/lib/utils';

interface QuickCategory {
  id: string | number;
  label: string;
  icon: React.ReactNode;
}

interface JobCategoryChipsProps {
  activeCategoryId?: number;
  onSelectCategory: (categoryId: number | undefined) => void;
}

// Icon SVGs inline để không cần thêm thư viện
const quickCategories: QuickCategory[] = [
  {
    id: 'no-degree',
    label: 'Không yêu cầu bằng cấp',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#eef2ff"/>
        <path d="M10 28l8-8 4 4 8-10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="28" cy="14" r="4" fill="#4F46E5" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: 'intern',
    label: 'Việc thực tập sinh',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#f0fdf4"/>
        <path d="M20 10l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#22c55e" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: 'part-time',
    label: 'Việc part-time, thời vụ',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#fff7ed"/>
        <circle cx="20" cy="20" r="8" stroke="#f97316" strokeWidth="2"/>
        <path d="M20 14v6l4 3" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'sales',
    label: 'Bán hàng/Kinh doanh',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#fef3c7"/>
        <path d="M12 28V20l8-8 8 8v8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="17" y="22" width="6" height="6" stroke="#f59e0b" strokeWidth="2" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Hành chính/Văn phòng',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#f5f3ff"/>
        <rect x="12" y="14" width="16" height="12" rx="2" stroke="#8b5cf6" strokeWidth="2"/>
        <path d="M16 14V12h8v2M16 22h8" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'it',
    label: 'IT-Công nghệ thông tin',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
        <rect width="40" height="40" rx="8" fill="#eff6ff"/>
        <path d="M14 18l-4 2 4 2M26 18l4 2-4 2M18 26l4-12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export const JobCategoryChips: React.FC<JobCategoryChipsProps> = ({
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {quickCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(typeof cat.id === 'number' ? cat.id : undefined)}
          className={cn(
            'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:border-[#4F46E5] hover:bg-blue-50/50 text-center',
            activeCategoryId === cat.id
              ? 'border-[#4F46E5] bg-blue-50'
              : 'border-[#e8e8e8] bg-white'
          )}
        >
          {cat.icon}
          <span className="text-[12px] text-[#212f3f] leading-tight font-medium line-clamp-2">
            {cat.label}
          </span>
        </button>
      ))}
    </div>
  );
};
