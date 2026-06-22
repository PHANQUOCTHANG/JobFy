import React, { useState } from "react";
import { Heart, Briefcase, BookmarkX, ArrowRight, Sparkles, FolderOpen, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSavedJobs } from "@/features/jobs/hooks/useJobs";
import { JobList } from "@/features/jobs/components/JobList";

const SavedJobsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  
  const { data, isLoading } = useSavedJobs({ page, limit });
  const savedJobs = data?.data || [];
  const meta = data?.meta;

  const jobsToDisplay = savedJobs.map((item: any) => ({
    ...item.job,
    publishedAt: item.savedAt,
    createdAt: item.savedAt,
  }));

  return (
    <div className="bg-[#f4f5f5] min-h-screen py-8 font-sans">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Cột trái: Nội dung việc làm đã lưu */}
          <div className="flex-1 w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h1 className="text-2xl font-bold text-slate-800">Việc làm đã lưu</h1>
              <p className="text-slate-500 mt-1 text-[15px]">
                Xem lại danh sách những công việc bạn đã quan tâm.
              </p>
            </div>

            {isLoading ? (
              <JobList jobs={[]} isLoading={true} viewMode="list" />
            ) : savedJobs.length > 0 ? (
              <div className="space-y-4">
                <JobList 
                  jobs={jobsToDisplay} 
                  viewMode="list" 
                  currentPage={meta?.page}
                  totalPages={meta?.totalPages}
                  onPageChange={setPage}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-16 pb-12 animate-in fade-in zoom-in duration-500">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-[#EEF2FF] rounded-full flex items-center justify-center">
                    <FolderOpen size={56} className="text-[#4F46E5] opacity-80" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Search size={24} className="text-slate-400" />
                  </div>
                </div>
                
                <h3 className="text-[#6f7882] text-lg font-medium mb-6">
                  Bạn chưa lưu công việc nào!
                </h3>
                
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 h-11 rounded-full font-semibold shadow-md shadow-[#4F46E5]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  Tìm việc ngay <ArrowRight size={18} />
                </Button>
              </div>
            )}
          </div>

          {/* Cột phải: Banner quảng cáo */}
          <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
            <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE] rounded-xl shadow-sm border border-[#4F46E5]/10 overflow-hidden relative group cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/cv/ai-builder')}>
              {/* Trang trí nền */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
              <div className="absolute top-4 right-4 opacity-30 text-[#4F46E5]">
                <Sparkles size={40} />
              </div>
              
              <div className="p-6 relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#4F46E5] rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <Bot size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[#312E81] mb-2 leading-tight">
                  Tạo CV bằng AI<br />Hoàn Toàn Miễn Phí
                </h3>
                
                <p className="text-[#4338CA]/80 text-sm mb-6 leading-relaxed">
                  Công nghệ AI tự động phân tích và viết CV cho bạn chỉ trong 5 giây. Đẹp, chuẩn và chuyên nghiệp.
                </p>
                
                <Button 
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white h-11 rounded-xl font-bold shadow-md"
                >
                  Trải nghiệm ngay
                </Button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage;
