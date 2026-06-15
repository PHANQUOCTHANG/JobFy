import { useState } from "react";
import { ChevronRight, ChevronLeft, Heart } from "lucide-react";
import { Job } from "../types";

export function FeaturedJobs({ jobs }: { jobs: Job[] }) {
  const [saved, setSaved] = useState<number[]>([]);

  const toggleSave = (id: number) =>
    setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const LOGO_COL: Record<string, string> = {
    FPT: "#FF6B2C", VNG: "#0066FF", TK: "#1A94FF", GR: "#00B14F", VP: "#E31837", SP: "#F05A28", MM: "#A50064", LZ: "#0F146D",
  };

  // Duplicate jobs to fill the 3x3 grid (9 items max) if needed
  const displayJobs = [...jobs, ...jobs, ...jobs].slice(0, 9);

  return (
    <section className="py-10 px-5 lg:px-10 bg-[#f0f0f0]">
      <div className="max-w-[1140px] mx-auto">
        <div className="bg-white rounded-lg p-5 shadow-sm">
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
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Miền Bắc
              </button>
              <button className="px-4 py-1.5 bg-[#f5f5f5] text-[#212f3f] rounded-full text-[14px] hover:bg-[#e8e8e8] whitespace-nowrap">
                Miền Nam
              </button>
              <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] flex-shrink-0 hover:bg-blue-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Grid of Compact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
            {displayJobs.map((job, idx) => {
              const isSaved = saved.includes(job.id);
              return (
                <div key={`${job.id}-${idx}`} className="group bg-white border border-[#e8e8e8] rounded-lg p-3 transition-all hover:border-[#4F46E5] hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[120px]">
                  {/* Top section: Logo + Title + Company */}
                  <div className="flex items-start gap-3 mb-3">
                    {/* Small Logo */}
                    <div className="w-[48px] h-[48px] border border-[#e8e8e8] rounded flex-shrink-0 bg-white p-1 flex items-center justify-center">
                      <div className="w-full h-full rounded flex items-center justify-center text-white font-bold text-[12px]" style={{ background: LOGO_COL[job.logo] ?? "#4F46E5" }}>
                        {job.logo}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[14px] text-[#212f3f] leading-snug line-clamp-2 group-hover:text-[#4F46E5] transition-colors mb-1">
                        {job.hot && <span className="inline-block bg-[#F05A28] text-white text-[10px] px-1 rounded mr-1">HOT</span>}
                        {job.title}
                      </h3>
                      <p className="text-[#6f7882] text-[12px] uppercase truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section: Pills + Heart */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px] font-medium">
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#f5f5f5] text-[#212f3f] text-[12px]">
                        {job.location}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSave(job.id);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                        isSaved ? "bg-[#4F46E5] text-white" : "border border-[#4F46E5] text-[#4F46E5] hover:bg-blue-50"
                      }`}
                    >
                      <Heart size={14} className={isSaved ? "fill-white" : ""} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4">
            <button className="w-8 h-8 rounded-full border border-[#e8e8e8] flex items-center justify-center text-[#9ea5af] cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[14px] text-[#212f3f] font-medium">
              <span className="text-[#4F46E5]">1</span> / 154 trang
            </span>
            <button className="w-8 h-8 rounded-full border border-[#4F46E5] flex items-center justify-center text-[#4F46E5] hover:bg-blue-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
