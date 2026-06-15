import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';
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
  currentPage = 1,
  limit = 10,
}) => {
  const searchModeOptions: { value: 'title' | 'company' | 'both'; label: string }[] = [
    { value: 'title', label: 'Tên việc làm' },
    { value: 'company', label: 'Tên công ty' },
    { value: 'both', label: 'Cả hai' },
  ];

  return (
    <div className="mb-3">
      {/* Search mode toggle row */}
      <div className="flex items-center gap-3 mb-3 text-[13px]">
        <span className="text-[#6f7882] font-medium whitespace-nowrap">Tìm kiếm theo:</span>
        <div className="flex items-center border border-[#e8e8e8] rounded-md overflow-hidden bg-white">
          {searchModeOptions.map((opt, idx) => (
            <React.Fragment key={opt.value}>
              {idx > 0 && <div className="w-px h-5 bg-[#e8e8e8]" />}
              <button
                onClick={() => onSearchModeChange?.(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap',
                  searchMode === opt.value
                    ? 'bg-[#4F46E5] text-white'
                    : 'text-[#212f3f] hover:bg-[#f5f5f5]'
                )}
              >
                {opt.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort + View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-[#e8e8e8] rounded-md overflow-hidden">
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'p-1.5 transition-all',
                viewMode === 'list' ? 'bg-[#4F46E5] text-white' : 'text-[#6f7882] hover:bg-[#f5f5f5]'
              )}
              title="Danh sách"
            >
              <List size={16} />
            </button>
            <div className="w-px h-5 bg-[#e8e8e8]" />
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-1.5 transition-all',
                viewMode === 'grid' ? 'bg-[#4F46E5] text-white' : 'text-[#6f7882] hover:bg-[#f5f5f5]'
              )}
              title="Lưới"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[13px] text-[#6f7882]">
            <span className="whitespace-nowrap font-medium">Sắp xếp theo:</span>
            <div className="w-[150px]">
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="h-8 text-[13px] border-[#e8e8e8] text-[#212f3f] bg-white font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Mới nhất</SelectItem>
                  <SelectItem value="relevant">Phù hợp nhất</SelectItem>
                  <SelectItem value="salary_desc">Lương cao nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!isLoading && (
        <div className="text-[13px] text-[#6f7882]">
          Tìm thấy{' '}
          <span className="text-[#4F46E5] font-bold">{totalResults.toLocaleString('vi-VN')}</span>{' '}
          việc làm phù hợp
        </div>
      )}
    </div>
  );
};
