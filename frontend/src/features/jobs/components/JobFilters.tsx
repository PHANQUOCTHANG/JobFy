import React, { useRef, useEffect, useState } from 'react';
import { useJobCategories, useProvinces } from '../hooks/useJobs';
import { JobFilterParams } from '../types';
import { Search, MapPin, ChevronDown } from 'lucide-react';

interface JobFiltersProps {
  onSearch: (filters: Partial<JobFilterParams>) => void;
  initialKeyword?: string;
  initialProvinceId?: number;
  initialCategoryId?: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  onSearch,
  initialKeyword = '',
  initialProvinceId,
  initialCategoryId,
}) => {
  const [keyword, setKeyword] = React.useState(initialKeyword);
  const [provinceId, setProvinceId] = React.useState<string>(
    initialProvinceId ? String(initialProvinceId) : 'all'
  );
  const [categoryId, setCategoryId] = React.useState<string>(
    initialCategoryId ? String(initialCategoryId) : 'all'
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const provinceRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useJobCategories();
  const { data: provinces } = useProvinces();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
        setShowProvinceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword: keyword || undefined,
      provinceId: provinceId !== 'all' ? Number(provinceId) : undefined,
      categoryId: categoryId !== 'all' ? Number(categoryId) : undefined,
    });
  };

  const selectedCategory = categories?.find((c) => String(c.id) === categoryId);
  const selectedProvince = provinces?.find((p) => String(p.id) === provinceId);

  return (
    <form onSubmit={handleSearch} className="flex items-stretch gap-0 bg-white rounded-lg overflow-hidden h-12">
      {/* Category Selector */}
      <div ref={categoryRef} className="relative border-r border-[#e8e8e8]">
        <button
          type="button"
          onClick={() => {
            setShowCategoryDropdown(!showCategoryDropdown);
            setShowProvinceDropdown(false);
          }}
          className="h-full px-4 flex items-center gap-2 text-[14px] font-medium text-[#212f3f] hover:bg-[#f8f8f8] transition-colors whitespace-nowrap min-w-[170px]"
        >
          <svg className="w-4 h-4 text-[#6f7882]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8M4 18h8" />
          </svg>
          <span className="flex-1 text-left truncate max-w-[120px]">
            {selectedCategory ? selectedCategory.name : 'Danh mục Nghề'}
          </span>
          <ChevronDown size={14} className="text-[#6f7882]" />
        </button>

        {showCategoryDropdown && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-[#e8e8e8] rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            <div
              className="px-4 py-2.5 text-[13px] text-[#6f7882] hover:bg-[#f5f5f5] cursor-pointer"
              onClick={() => { setCategoryId('all'); setShowCategoryDropdown(false); }}
            >
              Tất cả danh mục
            </div>
            {(categories || []).map((cat) => (
              <div
                key={cat.id}
                className={`px-4 py-2.5 text-[13px] cursor-pointer hover:bg-[#f5f5f5] transition-colors ${
                  categoryId === String(cat.id) ? 'text-[#4F46E5] font-semibold bg-blue-50' : 'text-[#212f3f]'
                }`}
                onClick={() => { setCategoryId(String(cat.id)); setShowCategoryDropdown(false); }}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keyword Input */}
      <div className="flex-1 relative flex items-center border-r border-[#e8e8e8]">
        <Search className="absolute left-3.5 w-4 h-4 text-[#9ea5af]" />
        <input
          type="text"
          placeholder="Vị trí tuyển dụng, tên công ty..."
          className="w-full h-full pl-10 pr-4 text-[14px] text-[#212f3f] placeholder-[#9ea5af] bg-transparent outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Province Selector */}
      <div ref={provinceRef} className="relative border-r border-[#e8e8e8]">
        <button
          type="button"
          onClick={() => {
            setShowProvinceDropdown(!showProvinceDropdown);
            setShowCategoryDropdown(false);
          }}
          className="h-full px-4 flex items-center gap-2 text-[14px] font-medium text-[#212f3f] hover:bg-[#f8f8f8] transition-colors whitespace-nowrap min-w-[150px]"
        >
          <MapPin size={15} className="text-[#6f7882] flex-shrink-0" />
          <span className="flex-1 text-left truncate max-w-[100px]">
            {selectedProvince ? selectedProvince.name : 'Địa điểm'}
          </span>
          <ChevronDown size={14} className="text-[#6f7882]" />
        </button>

        {showProvinceDropdown && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-[#e8e8e8] rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            <div
              className="px-4 py-2.5 text-[13px] text-[#6f7882] hover:bg-[#f5f5f5] cursor-pointer"
              onClick={() => { setProvinceId('all'); setShowProvinceDropdown(false); }}
            >
              Tất cả địa điểm
            </div>
            {(provinces || []).map((prov) => (
              <div
                key={prov.id}
                className={`px-4 py-2.5 text-[13px] cursor-pointer hover:bg-[#f5f5f5] transition-colors ${
                  provinceId === String(prov.id) ? 'text-[#4F46E5] font-semibold bg-blue-50' : 'text-[#212f3f]'
                }`}
                onClick={() => { setProvinceId(String(prov.id)); setShowProvinceDropdown(false); }}
              >
                {prov.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-6 h-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-[15px] transition-colors whitespace-nowrap flex-shrink-0"
      >
        Tìm kiếm
      </button>
    </form>
  );
};
