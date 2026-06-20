import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Zap, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompanies } from '@/features/companies/hooks/useCompanies';

export const BigBrandsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('it');
  const { data: apiCompanies, isLoading } = useCompanies({ limit: 8, isActive: true });

  return (
    <div className="max-w-[1140px] mx-auto px-4 mt-8">
      {/* 3 Small Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="rounded-lg overflow-hidden shadow-sm aspect-[21/9]">
          <img src="/images/banners/hero.png" className="w-full h-full object-cover" alt="Banner 1" />
        </div>
        <div className="rounded-lg overflow-hidden shadow-sm aspect-[21/9]">
          <img src="/images/banners/vertical_ad.png" className="w-full h-full object-cover" alt="Banner 2" />
        </div>
        <div className="rounded-lg overflow-hidden shadow-sm aspect-[21/9]">
          <img src="/images/banners/hero.png" className="w-full h-full object-cover" alt="Banner 3" />
        </div>
      </div>

      {/* Thương hiệu lớn tuyển dụng */}
      <div className="bg-white rounded-lg p-5 shadow-sm mb-10">
        <h2 className="text-[24px] font-bold text-[#4F46E5] text-center mb-6">
          Thương hiệu lớn tuyển dụng
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-full p-1 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('it')}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap ${activeTab === 'it' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:text-[#4F46E5]'}`}
            >
              IT - Phần mềm
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap ${activeTab === 'finance' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:text-[#4F46E5]'}`}
            >
              Tài chính - Ngân hàng
            </button>
            <button 
              onClick={() => setActiveTab('fmcg')}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap ${activeTab === 'fmcg' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:text-[#4F46E5]'}`}
            >
              Tiêu dùng nhanh (FMCG)
            </button>
            <button 
              onClick={() => setActiveTab('manufacturing')}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap ${activeTab === 'manufacturing' ? 'bg-[#4F46E5] text-white shadow-sm' : 'text-gray-600 hover:text-[#4F46E5]'}`}
            >
              Sản xuất - Bán lẻ
            </button>
          </div>
        </div>

        {/* Grid 4 columns of Brands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 animate-pulse flex flex-col items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))
            : (apiCompanies && apiCompanies.length > 0 ? apiCompanies : []).slice(0, 8).map(company => (
                <Link
                  key={company.id}
                  to={`/companies/${company.slug || company.id}`}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-md transition-all group hover:border-[#4F46E5]"
                >
                  <div className="h-16 flex items-center justify-center mb-3">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                        <Building2 size={20} />
                      </div>
                    )}
                  </div>
                  <p className="text-[14px] text-[#212f3f] font-medium group-hover:text-[#4F46E5] transition-colors text-center line-clamp-1">
                    {company.name}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1">{company.totalJobs} Việc làm</p>
                </Link>
              ))
          }
        </div>
      </div>

      {/* Huy Hiệu Tia Sét Banner */}
      <div className="w-full bg-gradient-to-r from-[#0a2d73] to-[#4F46E5] rounded-lg overflow-hidden shadow-lg p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        <div className="text-white z-10 flex-1">
          <h2 className="text-[28px] font-bold mb-2 flex items-center gap-2">
            Huy Hiệu Tia Sét <Zap className="text-yellow-400 fill-yellow-400" size={28} />
          </h2>
          <p className="text-white/90 text-[15px] mb-4">
            Đánh dấu các nhà tuyển dụng có tốc độ phản hồi hồ sơ cực nhanh trong 24h.
          </p>
          <button className="bg-white text-[#4F46E5] font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-md">
            Tìm hiểu ngay
          </button>
        </div>
        
        {/* Some decorative elements mimicking TopCV banner */}
        <div className="hidden md:flex gap-4 z-10">
           <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg w-48 shadow-xl">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-white rounded-md"></div>
               <div>
                 <div className="h-2 w-16 bg-white/50 rounded mb-1"></div>
                 <div className="h-2 w-12 bg-white/30 rounded"></div>
               </div>
             </div>
             <div className="h-2 w-full bg-[#4F46E5] rounded mt-4"></div>
           </div>
        </div>
      </div>
    </div>
  );
};
