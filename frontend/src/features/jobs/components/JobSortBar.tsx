import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface JobSortBarProps {
  totalResults: number;
  isLoading: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export const JobSortBar: React.FC<JobSortBarProps> = ({
  totalResults,
  isLoading,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          {isLoading ? 'Đang tìm kiếm...' : (
            <>Tìm thấy <span className="text-[#1A56DB]">{totalResults}</span> việc làm phù hợp</>
          )}
        </h2>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 whitespace-nowrap">Sắp xếp theo:</span>
        <div className="w-[180px]">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="bg-white border-slate-200 h-9 font-medium shadow-sm">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Mới nhất</SelectItem>
              <SelectItem value="relevant">Phù hợp nhất</SelectItem>
              <SelectItem value="salary_desc">Lương (Cao - Thấp)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

