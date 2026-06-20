import React, { useState } from 'react';
import { ChevronRight, Building2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/features/companies/hooks/useCompanies';
import { useProvinces } from '../hooks/useJobs';
import { SectionFilterBar } from './SectionFilterBar';
import { LOCATION_QUICK_OPTIONS } from '../constants/filterOptions';
import { FilterType } from './SectionFilterBar';

const FALLBACK_COMPANIES = [
  {
    id: '1', slug: 'fpt-software',
    name: 'Công ty Cổ phần Viễn thông FPT',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-FPT.png',
    totalJobs: 25, shortDescription: 'Môi trường làm việc năng động, chuyên nghiệp.',
  },
  {
    id: '2', slug: 'vng-corporation',
    name: 'Công ty Cổ phần VNG',
    logoUrl: 'https://vng.com.vn/assets/images/logo.png',
    totalJobs: 18, shortDescription: 'Phát triển các sản phẩm hàng triệu người dùng.',
  },
  {
    id: '3', slug: 'tiki',
    name: 'Tiki Corporation',
    logoUrl: 'https://salt.tikicdn.com/ts/upload/ae/f4/6d/4664fae2b7ba50aba552eb5ad54f0081.png',
    totalJobs: 12, shortDescription: 'Nền tảng thương mại điện tử hàng đầu Việt Nam.',
  },
  {
    id: '4', slug: 'masan-group',
    name: 'Tập đoàn Masan',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/vi/thumb/9/9d/Masan_Group_logo.svg/1200px-Masan_Group_logo.svg.png',
    totalJobs: 30, shortDescription: 'Tập đoàn kinh tế tư nhân đa ngành lớn nhất.',
  },
];

const COMPANY_FILTER_TYPES: FilterType[] = [
  { id: 'location', label: 'Địa điểm' },
  { id: 'size', label: 'Quy mô' },
  { id: 'industry', label: 'Ngành nghề' },
];

const SIZE_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 50 người', value: 'small' },
  { label: '50 - 200 người', value: 'medium' },
  { label: '200 - 1000 người', value: 'large' },
  { label: 'Trên 1000 người', value: 'enterprise' },
];

const INDUSTRY_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Công nghệ', value: 'tech' },
  { label: 'Thương mại điện tử', value: 'ecommerce' },
  { label: 'Tài chính / Ngân hàng', value: 'finance' },
  { label: 'Bán lẻ / Tiêu dùng', value: 'retail' },
  { label: 'Giáo dục', value: 'education' },
];

export const TopCompaniesSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilterType, setActiveFilterType] = useState('location');
  const [locationValue, setLocationValue] = useState<string | number>('all');
  const [sizeValue, setSizeValue] = useState<string | number>('all');
  const [industryValue, setIndustryValue] = useState<string | number>('all');

  const { data: provinces } = useProvinces();

  const resolveProvinceId = (val: string | number): number | undefined => {
    if (val === 'all') return undefined;
    const nameMap: Record<string, string> = {
      hanoi: 'Hà Nội', hcm: 'Hồ Chí Minh', danang: 'Đà Nẵng',
    };
    const n = nameMap[String(val)];
    if (n) return provinces?.find(p => p.name === n)?.id;
    return undefined;
  };

  const provinceId = resolveProvinceId(locationValue);

  const { data: apiCompanies, isLoading } = useCompanies({
    limit: 4,
    isActive: true,
    ...(provinceId ? { provinceId } : {}),
  } as any);

  const companies = React.useMemo(() => {
    if (!apiCompanies || apiCompanies.length === 0) return FALLBACK_COMPANIES;
    return apiCompanies.slice(0, 4).map(c => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      logoUrl: c.logoUrl,
      totalJobs: c.totalJobs || 0,
      shortDescription: c.shortDescription || 'Nhà tuyển dụng hàng đầu Việt Nam.',
    }));
  }, [apiCompanies]);

  const quickOptions =
    activeFilterType === 'location' ? LOCATION_QUICK_OPTIONS :
    activeFilterType === 'size'     ? SIZE_OPTIONS :
    INDUSTRY_OPTIONS;

  const activeQuickValue =
    activeFilterType === 'location' ? locationValue :
    activeFilterType === 'size'     ? sizeValue :
    industryValue;

  const handleQuickOptionSelect = (value: string | number) => {
    if (activeFilterType === 'location') setLocationValue(value);
    else if (activeFilterType === 'size') setSizeValue(value);
    else setIndustryValue(value);
  };

  return (
    <div className="py-8 border-t border-gray-200">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-[#212f3f] mb-1">Top Công ty hàng đầu</h2>
          <p className="text-[#6f7882] text-[14px]">Khám phá cơ hội nghề nghiệp tại các công ty uy tín nhất</p>
        </div>
        <button
          onClick={() => navigate('/companies')}
          className="text-[#4F46E5] font-medium flex items-center gap-1 hover:text-[#3730a3] transition-colors text-[14px]"
        >
          Xem tất cả
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mb-6">
        <SectionFilterBar
          filterTypes={COMPANY_FILTER_TYPES}
          activeFilterType={activeFilterType}
          onFilterTypeChange={setActiveFilterType}
          quickOptions={quickOptions}
          activeQuickValue={activeQuickValue}
          onQuickOptionSelect={handleQuickOptionSelect}
          accentColor="#4F46E5"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
              <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-4" />
              <div className="h-9 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {companies.map(company => (
            <Link
              key={company.id}
              to={`/companies/${company.slug || company.id}`}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 hover:border-[#4F46E5] group flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-lg flex items-center justify-center p-2 mb-4 group-hover:-translate-y-1 transition-transform">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-gray-300" />
                )}
              </div>
              <h3 className="font-bold text-[#212f3f] text-base mb-2 line-clamp-2 group-hover:text-[#4F46E5] transition-colors">
                {company.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {company.shortDescription}
              </p>
              <div className="w-full bg-[#f4f5f5] text-[#212f3f] font-medium py-2 rounded-md group-hover:bg-blue-50 group-hover:text-[#4F46E5] transition-colors text-sm">
                {company.totalJobs} việc làm
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
