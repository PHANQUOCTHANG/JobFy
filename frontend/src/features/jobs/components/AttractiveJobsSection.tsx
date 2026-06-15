import React from 'react';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { mockJobs } from '../api/mockData';
import { JobCard } from './JobCard';

export const AttractiveJobsSection: React.FC = () => {
  return (
    <div className="max-w-[1140px] mx-auto px-4 mt-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Jobs Area */}
        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-[24px] font-bold text-[#4F46E5] flex items-center gap-2">
                Việc làm hấp dẫn
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
                <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-blue-50">
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
              <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] flex-shrink-0 hover:bg-blue-50">
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
              <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] flex-shrink-0 hover:bg-blue-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Grid 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
            {[...mockJobs, ...mockJobs].slice(0, 8).map((job, idx) => (
              <div key={`attractive-${idx}`} className="relative">
                {idx === 1 && (
                  <div className="absolute -top-2 left-4 z-10 bg-[#ff4b4b] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-white">
                    HOT
                  </div>
                )}
                {idx === 4 && (
                  <div className="absolute -top-2 left-4 z-10 bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-white flex items-center gap-1">
                    <Zap size={10} /> MỚI
                  </div>
                )}
                <JobCard job={job} viewMode="compact" />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4">
            <button className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[14px] text-[#212f3f] font-medium">
              <span className="text-[#4F46E5]">4</span> / 150 trang
            </span>
            <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-blue-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Vertical Ad Banner */}
        <div className="w-full lg:w-[320px] rounded-lg overflow-hidden shadow-sm hidden md:block">
          <img 
            src="/images/banners/vertical_ad.png" 
            alt="Việc làm phổ thông" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
