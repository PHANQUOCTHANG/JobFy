import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { JobFilterParams } from '../types';

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
  initialCategoryId
}) => {
  const [keyword, setKeyword] = React.useState(initialKeyword);
  const [provinceId, setProvinceId] = React.useState<string>(initialProvinceId ? String(initialProvinceId) : 'all');
  const [categoryId, setCategoryId] = React.useState<string>(initialCategoryId ? String(initialCategoryId) : 'all');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      keyword: keyword || undefined,
      provinceId: provinceId !== 'all' ? Number(provinceId) : undefined,
      categoryId: categoryId !== 'all' ? Number(categoryId) : undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-200 w-full">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-0 items-center">
        {/* Search Input */}
        <div className="flex-1 relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1A56DB] transition-colors" />
          <Input 
            placeholder="Tên công việc, vị trí, kỹ năng..." 
            className="pl-11 h-12 bg-transparent border-none shadow-none focus-visible:ring-0 text-base font-medium rounded-none w-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200" />
        
        {/* Location Select */}
        <div className="w-full md:w-56 relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1A56DB] transition-colors z-10" />
          <Select value={provinceId} onValueChange={setProvinceId}>
            <SelectTrigger className="pl-11 h-12 bg-transparent border-none shadow-none focus:ring-0 text-base font-medium rounded-none w-full">
              <SelectValue placeholder="Tất cả địa điểm" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl font-medium">
              <SelectItem value="all">Tất cả địa điểm</SelectItem>
              <SelectItem value="1">Hồ Chí Minh</SelectItem>
              <SelectItem value="2">Hà Nội</SelectItem>
              <SelectItem value="3">Đà Nẵng</SelectItem>
              <SelectItem value="4">Cần Thơ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Category Select */}
        <div className="w-full md:w-64 relative group">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1A56DB] transition-colors z-10" />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="pl-11 h-12 bg-transparent border-none shadow-none focus:ring-0 text-base font-medium rounded-none w-full">
              <SelectValue placeholder="Tất cả ngành nghề" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-80 font-medium">
              <SelectItem value="all">Tất cả ngành nghề</SelectItem>
              <SelectItem value="1">IT - Phần mềm</SelectItem>
              <SelectItem value="2">Marketing / PR</SelectItem>
              <SelectItem value="3">Thiết kế đồ hoạ</SelectItem>
              <SelectItem value="4">Kế toán / Kiểm toán</SelectItem>
              <SelectItem value="5">Nhân sự (HR)</SelectItem>
              <SelectItem value="6">Kinh doanh / Bán hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto md:pl-2 mt-2 md:mt-0">
          <Button 
            type="submit" 
            className="w-full md:w-36 h-12 rounded-md bg-[#1A56DB] hover:bg-[#1447C0] text-white font-bold text-base transition-colors"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </div>
  );
};

