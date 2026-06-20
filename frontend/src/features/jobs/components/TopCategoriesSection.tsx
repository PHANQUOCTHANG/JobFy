import React, { useState } from 'react';
import {
  Laptop, Briefcase, Calculator, PenTool,
  Database, Megaphone, Stethoscope, ShoppingBag, Code2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobCategories, useProvinces } from '../hooks/useJobs';
import { SectionFilterBar } from './SectionFilterBar';
import { LOCATION_QUICK_OPTIONS } from '../constants/filterOptions';
import { QuickFilterOption, FilterType } from './SectionFilterBar';

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  it: <Laptop size={24} />,
  'it-software': <Laptop size={24} />,
  sales: <ShoppingBag size={24} />,
  business: <ShoppingBag size={24} />,
  admin: <Briefcase size={24} />,
  finance: <Calculator size={24} />,
  accounting: <Calculator size={24} />,
  marketing: <Megaphone size={24} />,
  design: <PenTool size={24} />,
  'it-hardware': <Database size={24} />,
  network: <Database size={24} />,
  healthcare: <Stethoscope size={24} />,
};

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'IT Phần mềm', slug: 'it', icon: <Laptop size={24} /> },
  { id: 2, name: 'Kinh doanh / Bán hàng', slug: 'sales', icon: <ShoppingBag size={24} /> },
  { id: 3, name: 'Hành chính / Văn phòng', slug: 'admin', icon: <Briefcase size={24} /> },
  { id: 4, name: 'Kế toán / Kiểm toán', slug: 'finance', icon: <Calculator size={24} /> },
  { id: 5, name: 'Marketing / Truyền thông', slug: 'marketing', icon: <Megaphone size={24} /> },
  { id: 6, name: 'Thiết kế / Mỹ thuật', slug: 'design', icon: <PenTool size={24} /> },
  { id: 7, name: 'IT Phần cứng / Mạng', slug: 'it-hardware', icon: <Database size={24} /> },
  { id: 8, name: 'Y tế / Chăm sóc sức khỏe', slug: 'healthcare', icon: <Stethoscope size={24} /> },
];

// Filter types for categories: just show categories by type/group
const CAT_FILTER_TYPES: FilterType[] = [
  { id: 'all', label: 'Tất cả ngành' },
  { id: 'tech', label: 'Công nghệ' },
  { id: 'business', label: 'Kinh doanh' },
  { id: 'creative', label: 'Sáng tạo' },
  { id: 'service', label: 'Dịch vụ' },
];

// Map filter → slugs to show
const CAT_FILTER_SLUGS: Record<string, string[]> = {
  all: [],
  tech: ['it', 'it-software', 'it-hardware', 'network'],
  business: ['sales', 'finance', 'accounting', 'admin', 'business'],
  creative: ['design', 'marketing'],
  service: ['healthcare', 'customer-service'],
};

const SORT_OPTIONS: QuickFilterOption[] = [
  { label: 'Phổ biến nhất', value: 'popular' },
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Lương cao', value: 'salary' },
  { label: 'Nhiều việc nhất', value: 'jobs' },
];

export const TopCategoriesSection: React.FC = () => {
  const { data: apiCategories, isLoading } = useJobCategories();
  const [activeFilterType, setActiveFilterType] = useState('all');
  const [activeSortValue, setActiveSortValue] = useState<string | number>('popular');

  const rawCategories = React.useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) return FALLBACK_CATEGORIES;
    return apiCategories.slice(0, 12).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: CATEGORY_ICON_MAP[cat.slug] || <Code2 size={24} />,
    }));
  }, [apiCategories]);

  const filteredCategories = React.useMemo(() => {
    const slugs = CAT_FILTER_SLUGS[activeFilterType] || [];
    if (slugs.length === 0) return rawCategories.slice(0, 8);
    const filtered = rawCategories.filter(c => slugs.includes(c.slug));
    return filtered.length > 0 ? filtered.slice(0, 8) : rawCategories.slice(0, 8);
  }, [rawCategories, activeFilterType]);

  return (
    <div className="py-8">
      {/* Header + Filter */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#212f3f]">
          Ngành nghề trọng điểm
        </h2>
        <SectionFilterBar
          filterTypes={CAT_FILTER_TYPES}
          activeFilterType={activeFilterType}
          onFilterTypeChange={setActiveFilterType}
          quickOptions={SORT_OPTIONS}
          activeQuickValue={activeSortValue}
          onQuickOptionSelect={setActiveSortValue}
          accentColor="#4F46E5"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 h-[72px] animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/jobs?categorySlug=${cat.slug}`}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300 hover:border-[#4F46E5] group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#f4f5f5] text-gray-500 flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-colors flex-shrink-0">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-[#212f3f] text-sm md:text-base group-hover:text-[#4F46E5] transition-colors line-clamp-2">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
