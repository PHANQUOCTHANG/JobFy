import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { JobFilterParams } from '../types';

interface JobSidebarFilterProps {
  filters: JobFilterParams;
  onFilterChange: (newFilters: Partial<JobFilterParams>) => void;
  onClearFilters: () => void;
}

export const JobSidebarFilter: React.FC<JobSidebarFilterProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    jobType: true,
    salary: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = Object.keys(filters).length > 0 && 
    (filters.experienceLevel || filters.jobType || filters.salaryMin || filters.isRemote);

  const experienceOptions = [
    { value: 'intern', label: 'Thực tập sinh' },
    { value: 'fresher', label: 'Mới tốt nghiệp' },
    { value: 'junior', label: 'Nhân viên (Junior)' },
    { value: 'mid', label: 'Chuyên viên (Mid)' },
    { value: 'senior', label: 'Chuyên viên cao cấp (Senior)' },
    { value: 'manager', label: 'Quản lý / Trưởng phòng' }
  ];

  const jobTypeOptions = [
    { value: 'full_time', label: 'Toàn thời gian' },
    { value: 'part_time', label: 'Bán thời gian' },
    { value: 'freelance', label: 'Làm việc tự do (Freelance)' },
    { value: 'contract', label: 'Hợp đồng' }
  ];

  const handleSalaryChange = (value: number[]) => {
    onFilterChange({ salaryMin: value[0] });
  };

  return (
    <div className="bg-white rounded-lg p-5 h-fit sticky top-24 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between pb-3 mb-4">
        <h3 className="font-bold text-[17px] text-slate-800 flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          Lọc kết quả
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className="text-[13px] text-red-500 hover:text-red-600 font-medium hover:underline"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Tùy chọn Làm việc từ xa */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-0.5">
          <Label htmlFor="remote-mode" className="text-[15px] font-bold text-slate-800">
            Làm việc từ xa
          </Label>
        </div>
        <Switch 
          id="remote-mode" 
          checked={!!filters.isRemote}
          onCheckedChange={(checked) => onFilterChange({ isRemote: checked || undefined })}
          className="data-[state=checked]:bg-[#1A56DB]"
        />
      </div>

      {/* Lọc theo Cấp bậc kinh nghiệm */}
      <div className="mb-5">
        <button 
          className="flex items-center justify-between w-full text-left font-bold text-[15px] text-slate-800 mb-3"
          onClick={() => toggleSection('experience')}
        >
          Cấp bậc
          {expandedSections.experience ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        
        {expandedSections.experience && (
          <div className="space-y-3 mt-2">
            {experienceOptions.map(option => (
              <div key={option.value} className="flex items-start space-x-3">
                <Checkbox 
                  id={`exp-${option.value}`} 
                  checked={filters.experienceLevel === option.value}
                  onCheckedChange={(checked) => {
                    onFilterChange({ 
                      experienceLevel: checked ? option.value : undefined 
                    });
                  }}
                  className="border-slate-300 data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB] rounded-sm mt-0.5"
                />
                <Label 
                  htmlFor={`exp-${option.value}`}
                  className="text-[14px] font-medium text-slate-600 leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lọc theo Loại hình */}
      <div className="mb-5">
        <button 
          className="flex items-center justify-between w-full text-left font-bold text-[15px] text-slate-800 mb-3"
          onClick={() => toggleSection('jobType')}
        >
          Loại hình
          {expandedSections.jobType ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        
        {expandedSections.jobType && (
          <div className="space-y-3 mt-2">
            {jobTypeOptions.map(option => (
              <div key={option.value} className="flex items-start space-x-3">
                <Checkbox 
                  id={`type-${option.value}`} 
                  checked={filters.jobType === option.value}
                  onCheckedChange={(checked) => {
                    onFilterChange({ 
                      jobType: checked ? option.value : undefined 
                    });
                  }}
                  className="border-slate-300 data-[state=checked]:bg-[#1A56DB] data-[state=checked]:border-[#1A56DB] rounded-sm mt-0.5"
                />
                <Label 
                  htmlFor={`type-${option.value}`}
                  className="text-[14px] font-medium text-slate-600 leading-tight cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lọc theo Mức lương */}
      <div>
        <button 
          className="flex items-center justify-between w-full text-left font-bold text-[15px] text-slate-800 mb-4"
          onClick={() => toggleSection('salary')}
        >
          Mức lương tối thiểu
          {expandedSections.salary ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
        
        {expandedSections.salary && (
          <div className="px-2 pt-2">
            <Slider
              defaultValue={[filters.salaryMin ? filters.salaryMin / 1000000 : 0]}
              max={100}
              step={5}
              onValueCommit={(val) => handleSalaryChange([val[0] * 1000000])}
              className="mb-4 [&_[role=slider]]:border-[#1A56DB] [&_[role=slider]]:bg-white [&_.bg-primary]:bg-[#1A56DB]"
            />
            <div className="flex justify-between text-[13px] text-slate-500 font-medium">
              <span>0 Tr</span>
              <span className="text-[#1A56DB] font-bold text-sm">
                {filters.salaryMin ? `Từ ${filters.salaryMin / 1000000} Tr` : 'Tất cả mức lương'}
              </span>
              <span>100+ Tr</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
