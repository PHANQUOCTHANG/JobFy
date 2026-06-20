import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Check, ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobSortBarProps {
  totalResults: number;
  isLoading: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  searchMode?: 'title' | 'company' | 'both';
  onSearchModeChange?: (mode: 'title' | 'company' | 'both') => void;
  currentPage?: number;
  limit?: number;
}

export const JobSortBar: React.FC<JobSortBarProps> = ({
  totalResults,
  isLoading,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  searchMode = 'both',
  onSearchModeChange,
}) => {
  const searchModeOptions: { value: 'title' | 'company' | 'both'; label: string }[] = [
    { value: 'title', label: 'Tên việc làm' },
    { value: 'company', label: 'Tên công ty' },
    { value: 'both', label: 'Cả hai' },
  ];

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-4 text-[13px] bg-white rounded-xl p-3 border border-[#e8e8e8] shadow-sm">
        {/* Search mode toggle */}
        <div className="flex items-center gap-3">
          <span className="text-[#212f3f] font-bold whitespace-nowrap">Tìm kiếm theo:</span>
          <div className="flex items-center gap-2">
            {searchModeOptions.map((opt) => {
              const isSelected = searchMode === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSearchModeChange?.(opt.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5',
                    isSelected
                      ? 'border border-[#4F46E5] text-[#4F46E5] bg-white'
                      : 'bg-[#e8eaef] text-[#6f7882] hover:bg-[#e0e3e8] border border-transparent'
                  )}
                >
                  {isSelected && <Check size={14} strokeWidth={2.5} />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-px h-5 bg-[#d1d5db] hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[#212f3f] font-bold">
            <ArrowDownUp size={14} />
            <span className="whitespace-nowrap">Sắp xếp theo:</span>
          </div>
          <div className="w-[160px]">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-8 text-[13px] border border-[#e8e8e8] text-[#212f3f] bg-white hover:bg-[#f8f9fa] font-medium rounded-full focus:ring-0 focus:ring-offset-0 transition-colors shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#e8e8e8] text-[#212f3f] rounded-xl shadow-lg min-w-[160px] p-1">
                <SelectItem value="latest" className="py-2.5 focus:bg-[#f4f5f5] focus:text-[#212f3f] data-[state=checked]:text-[#4F46E5] data-[state=checked]:bg-indigo-50 cursor-pointer rounded-lg">
                  Search by AI
                </SelectItem>
                <SelectItem value="relevant" className="py-2.5 focus:bg-[#f4f5f5] focus:text-[#212f3f] data-[state=checked]:text-[#4F46E5] data-[state=checked]:bg-indigo-50 cursor-pointer rounded-lg">
                  Phù hợp nhất
                </SelectItem>
                <SelectItem value="salary_desc" className="py-2.5 focus:bg-[#f4f5f5] focus:text-[#212f3f] data-[state=checked]:text-[#4F46E5] data-[state=checked]:bg-indigo-50 cursor-pointer rounded-lg">
                  Lương cao nhất
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1" />

        {/* View mode toggle (kept for functionality) */}
        <div className="flex items-center gap-1 bg-[#e8eaef] rounded-full p-1 border border-transparent">
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-1.5 rounded-full transition-all flex items-center justify-center',
              viewMode === 'list' ? 'bg-white shadow-sm text-[#4F46E5]' : 'text-[#6f7882] hover:text-[#212f3f]'
            )}
            title="Danh sách"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded-full transition-all flex items-center justify-center',
              viewMode === 'grid' ? 'bg-white shadow-sm text-[#4F46E5]' : 'text-[#6f7882] hover:text-[#212f3f]'
            )}
            title="Lưới"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-[13px] text-[#6f7882] mt-3 pl-1">
          Tìm thấy{' '}
          <span className="text-[#4F46E5] font-bold">{totalResults.toLocaleString('vi-VN')}</span>{' '}
          việc làm phù hợp
        </div>
      )}
    </div>
  );
};
