import React, { useState } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompanies, useIndustries } from '@/features/companies/hooks/useCompanies';
import { useProvinces } from '../hooks/useJobs';
import { SectionFilterBar } from './SectionFilterBar';
import { LOCATION_QUICK_OPTIONS } from '../constants/filterOptions';
import { FilterType } from './SectionFilterBar';



const COMPANY_FILTER_TYPES: FilterType[] = [
  { id: 'location', label: 'Địa điểm' },
  { id: 'size', label: 'Quy mô' },
  { id: 'industry', label: 'Ngành nghề' },
];

const SIZE_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: '1 - 10 người', value: 'value_1_10' },
  { label: '11 - 50 người', value: 'value_11_50' },
  { label: '51 - 200 người', value: 'value_51_200' },
  { label: '201 - 500 người', value: 'value_201_500' },
  { label: '501 - 1000 người', value: 'value_501_1000' },
  { label: '1001 - 5000 người', value: 'value_1001_5000' },
  { label: 'Trên 5000 người', value: 'value_5000_plus' },
];

export const TopCompaniesSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilterType, setActiveFilterType] = useState('location');
  const [locationValue, setLocationValue] = useState<string | number>('all');
  const [sizeValue, setSizeValue] = useState<string | number>('all');
  const [industryValue, setIndustryValue] = useState<string | number>('all');

  const { data: provinces } = useProvinces();
  const { data: industriesData } = useIndustries();

  const resolveLocation = (val: string | number) => {
    if (val === 'all') return {};
    if (val === 'north') return { region: 'Miền Bắc' };
    if (val === 'south') return { region: 'Miền Nam' };
    if (val === 'central') return { region: 'Miền Trung' };
    
    const nameMap: Record<string, string> = {
      hanoi: 'Hà Nội', hcm: 'Hồ Chí Minh', danang: 'Đà Nẵng',
    };
    const n = nameMap[String(val)];
    if (n) {
      const pId = provinces?.find(p => p.name === n)?.id;
      return pId ? { provinceId: pId } : {};
    }
    return {};
  };

  const industryOptions = React.useMemo(() => {
    const base = [{ label: 'Tất cả', value: 'all' }];
    if (!industriesData?.data) return base;
    return [
      ...base,
      ...industriesData.data.slice(0, 8).map(i => ({ label: i.name, value: i.id }))
    ];
  }, [industriesData]);

  const locationParams = resolveLocation(locationValue);
  const selectedIndustryId = industryValue !== 'all' ? Number(industryValue) : undefined;
  const selectedSize = sizeValue !== 'all' ? sizeValue : undefined;

  const { data: apiCompanies, isLoading } = useCompanies({
    limit: 4,
    isActive: true,
    ...locationParams,
    ...(selectedIndustryId ? { industryId: selectedIndustryId } : {}),
    ...(selectedSize ? { size: selectedSize } : {}),
  } as any);

  const companies = React.useMemo(() => {
    const companiesList = apiCompanies?.data || [];
    return companiesList.slice(0, 4).map(c => ({
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
    industryOptions;

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
      ) : companies.length > 0 ? (
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
      ) : (
        <div className="py-10 text-center text-[#6f7882] bg-white rounded-lg border border-gray-200">
          Không có công ty nào phù hợp với bộ lọc hiện tại.
        </div>
      )}
    </div>
  );
};
