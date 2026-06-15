import React, { useState } from 'react';
import { JobFilterParams } from '../types';
import { useJobCategories } from '../hooks/useJobs';
import { Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface JobSidebarFilterProps {
  filters: JobFilterParams;
  onFilterChange: (newFilters: Partial<JobFilterParams>) => void;
  onClearFilters: () => void;
}

const levels = [
  'Tất cả',
  'Nhân viên',
  'Trưởng nhóm',
  'Trưởng/Phó phòng',
  'Quản lý / Giám sát',
  'Trưởng chi nhánh',
  'Phó giám đốc',
  'Giám đốc',
  'Thực tập sinh'
];

const jobTypes = [
  { value: 'all', label: 'Tất cả' },
  { value: 'full_time', label: 'Toàn thời gian' },
  { value: 'part_time', label: 'Bán thời gian' },
  { value: 'intern', label: 'Thực tập' },
  { value: 'other', label: 'Khác' }
];

export const JobSidebarFilter: React.FC<JobSidebarFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const handleApplySalary = () => {
    onFilterChange({
      salaryMin: minSalary ? parseInt(minSalary) * 1000000 : undefined,
      salaryMax: maxSalary ? parseInt(maxSalary) * 1000000 : undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-[#4F46E5] font-bold text-[16px]">
        <Filter size={18} />
        <h2>Lọc nâng cao</h2>
      </div>

      {/* SALARY */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="radio"
            id="salary-negotiable"
            name="salary-type"
            className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
            checked={!filters.salaryMin && !filters.salaryMax}
            onChange={() => {
              setMinSalary('');
              setMaxSalary('');
              onFilterChange({ salaryMin: undefined, salaryMax: undefined });
            }}
          />
          <label htmlFor="salary-negotiable" className="text-[14px] text-[#212f3f] cursor-pointer">
            Thoả thuận
          </label>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Từ"
            className="w-full h-8 px-2 border border-[#e8e8e8] rounded text-[13px] outline-none focus:border-[#4F46E5]"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <span className="text-[#9ea5af]">-</span>
          <input
            type="number"
            placeholder="Đến"
            className="w-full h-8 px-2 border border-[#e8e8e8] rounded text-[13px] outline-none focus:border-[#4F46E5]"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
          <span className="text-[#6f7882] text-[13px]">triệu</span>
        </div>
        
        <button
          onClick={handleApplySalary}
          disabled={!minSalary && !maxSalary}
          className="w-full py-1.5 bg-[#f5f5f5] text-[#212f3f] text-[13px] font-medium rounded hover:bg-[#e8e8e8] transition-colors disabled:opacity-50"
        >
          Áp dụng
        </button>
      </div>

      <div className="w-full h-px border-t border-dashed border-[#e8e8e8] mb-6" />

      {/* CẤP BẬC */}
      <div className="mb-6">
        <h3 className="font-bold text-[15px] text-[#212f3f] mb-3">Cấp bậc</h3>
        <div className="flex flex-col gap-3">
          {levels.map((level, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                id={`level-${idx}`}
                name="level"
                className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
                defaultChecked={idx === 0}
              />
              <label htmlFor={`level-${idx}`} className="text-[14px] text-[#212f3f] cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px border-t border-dashed border-[#e8e8e8] mb-6" />

      {/* LOẠI HÌNH LÀM VIỆC */}
      <div className="mb-6">
        <h3 className="font-bold text-[15px] text-[#212f3f] mb-3">Loại hình làm việc</h3>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          {jobTypes.map((type, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                id={`type-${idx}`}
                name="jobType"
                className="w-4 h-4 accent-[#4F46E5] cursor-pointer"
                checked={filters.jobType ? filters.jobType === type.value : type.value === 'all'}
                onChange={() => onFilterChange({ jobType: type.value === 'all' ? undefined : type.value as any })}
              />
              <label htmlFor={`type-${idx}`} className="text-[14px] text-[#212f3f] cursor-pointer truncate">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onClearFilters}
          className="text-[#6f7882] text-[14px] whitespace-nowrap hover:text-[#4F46E5] transition-colors"
        >
          Xóa lọc
        </button>
        <button className="flex-1 bg-white border border-[#4F46E5] text-[#4F46E5] py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-blue-50 transition-colors">
          <Star size={16} fill="currentColor" />
          Lưu bộ lọc
        </button>
      </div>
    </div>
  );
};
