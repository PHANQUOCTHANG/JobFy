import React from 'react';
import { JobFilters } from './JobFilters';
import { JobFilterParams } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { mockJobs } from '../api/mockData';
import { JobCard } from './JobCard';
import { HeroBanner } from './HeroBanner';
import { AttractiveJobsSection } from './AttractiveJobsSection';
import { BigBrandsSection } from './BigBrandsSection';
import { TopCategoriesSection } from './TopCategoriesSection';
import { TopCompaniesSection } from './TopCompaniesSection';
import { SeoKeywordsSection } from './SeoKeywordsSection';

interface JobLandingSectionProps {
  onSearch: (filters: Partial<JobFilterParams>) => void;
}

export const JobLandingSection: React.FC<JobLandingSectionProps> = ({ onSearch }) => {
  return (
    <div className="min-h-screen bg-[#f0f0f0] pb-10">
      {/* ─── HERO SECTION ─── */}
      <div className="bg-[#4F46E5] pt-10 pb-6 px-4">
        <div className="max-w-[1140px] mx-auto text-center">
          <h1 className="text-[28px] md:text-[32px] font-bold text-white mb-2">
            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
          </h1>
          <p className="text-white/90 text-[15px] mb-8">
            Tiếp cận 60.000+ tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
          </p>

          <JobFilters onSearch={onSearch} />
        </div>
      </div>

      {/* ─── BANNER & CATEGORIES MENU ─── */}
      <HeroBanner />

      {/* ─── BEST JOBS SECTION ─── */}
      <div className="max-w-[1140px] mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-[24px] font-bold text-[#4F46E5] flex items-center gap-2">
                Việc làm tốt nhất
                <span className="text-[#9ea5af] mx-2">|</span>
                <span className="flex items-center gap-1.5 text-[#212f3f] text-[14px]">
                  Đề xuất bởi <span className="font-bold text-[#4F46E5]">TOPPY<span className="text-[#6f7882]">AI</span></span>
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[14px] text-[#212f3f] hover:text-[#4F46E5] font-medium underline underline-offset-2">
                Xem tất cả
              </button>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] cursor-not-allowed">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-blue-50 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5">
            <div className="flex items-center gap-2 border border-[#e8e8e8] rounded px-3 py-1.5 text-[14px] text-[#212f3f] cursor-pointer hover:border-[#4F46E5]">
              <span className="text-[#6f7882]">Lọc theo:</span>
              <span className="font-medium">Địa điểm</span>
              <ChevronRight size={14} className="rotate-90 text-[#6f7882] ml-4" />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
              <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] flex-shrink-0 hover:bg-blue-50 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="px-4 py-1.5 bg-[#4F46E5] text-white rounded-full text-[14px] font-medium whitespace-nowrap">
                Ngẫu nhiên
              </button>
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Hà Nội
              </button>
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Thành phố Hồ Chí Minh (cũ)
              </button>
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Miền Bắc
              </button>
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Miền Nam
              </button>
              <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] flex-shrink-0 hover:bg-blue-50 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Grid - Repeat mockJobs to fill the 3x3 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
            {[...mockJobs, ...mockJobs, ...mockJobs].slice(0, 9).map((job, idx) => (
              <JobCard key={`${job.id}-${idx}`} job={job} viewMode="compact" />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4">
            <button className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[14px] text-[#212f3f] font-medium">
              <span className="text-[#4F46E5]">1</span> / 154 trang
            </span>
            <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-blue-50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── NEW SECTIONS MATCHING TOPCV ─── */}
      <AttractiveJobsSection />
      
      <BigBrandsSection />

      {/* ─── REUSE THE BOTTOM SECTIONS ─── */}
      <div className="max-w-[1140px] mx-auto px-4">
        <TopCategoriesSection />
        <TopCompaniesSection />
        <SeoKeywordsSection />
      </div>

    </div>
  );
};
