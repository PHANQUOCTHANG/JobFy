import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    { id: 1, name: 'Kinh doanh/Bán hàng' },
    { id: 2, name: 'Marketing/PR/Quảng cáo' },
    { id: 3, name: 'Chăm sóc khách hàng (Custome...' },
    { id: 4, name: 'Nhân sự/Hành chính/Pháp chế' },
    { id: 5, name: 'Công nghệ Thông tin' },
    { id: 6, name: 'Lao động phổ thông' },
  ];

  return (
    <div className="max-w-[1140px] mx-auto px-4 mt-6 mb-8 hidden lg:block font-sans">
      <div className="flex gap-4 h-[320px]">
        
        {/* --- LEFT MENU (CATEGORIES) --- */}
        <div className="w-[300px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col pt-3 pb-4 flex-shrink-0 relative overflow-hidden">
          <div className="flex-1 flex flex-col">
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/jobs?categoryId=${cat.id}`}
                className={`flex items-center justify-between px-5 py-2.5 text-[14px] font-bold transition-colors group ${
                  activeCategory === cat.id ? 'text-[#00b14f] bg-green-50/50' : 'text-[#333333] hover:bg-gray-50'
                }`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <span className="truncate pr-4">{cat.name}</span>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-[#00b14f] transition-colors" strokeWidth={2.5} />
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-5 pt-2 mt-1 border-t border-gray-100">
            <span className="text-[#333333] text-[15px] font-medium">1/5</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#00b14f] hover:border-[#00b14f] transition-all">
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button className="w-8 h-8 rounded-full border border-[#00b14f] flex items-center justify-center text-[#00b14f] hover:bg-green-50 transition-all">
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT BANNER (QUANTA QMH COMPUTER) --- */}
        <div className="flex-1 rounded-2xl overflow-hidden relative bg-white border border-gray-100 flex shadow-sm group">
          
          {/* Banner Left Content Area */}
          <div className="w-[60%] p-8 flex flex-col relative z-20">
            {/* Header Titles */}
            <div className="mb-5 tracking-tight mt-2">
              <h2 className="text-[38px] font-black text-[#1966d2] leading-none drop-shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>QUANTA</h2>
              <h2 className="text-[38px] font-black text-[#1966d2] leading-tight drop-shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>QMH COMPUTER</h2>
            </div>

            {/* Red/Blue Ribbon */}
            <div className="relative mb-5 flex">
              <div className="bg-[#1966d2] text-white font-bold text-[18px] px-8 py-2 relative -ml-8 z-10 flex items-center shadow-md">
                TUYỂN DỤNG CÁC VỊ TRÍ
                {/* Diagonal cut at the right end of the ribbon */}
                <div className="absolute -right-6 top-0 bottom-0 w-8 bg-[#1966d2] skew-x-[-25deg] origin-bottom rounded-r-sm"></div>
                {/* Red decorative shape sticking out */}
                <div className="absolute -right-8 top-0 bottom-0 w-4 bg-[#c8102e] skew-x-[-25deg] origin-bottom -z-10 shadow-sm rounded-r-sm"></div>
              </div>
            </div>

            {/* Job List */}
            <div className="space-y-2.5 pl-3 mb-6 relative z-10">
              {['Kỹ Sư', 'Tổ Trưởng Sản Xuất', 'Nhân Viên Tiếng Trung'].map((job, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex text-[#8ab4f8]">
                    <ChevronRight size={18} strokeWidth={4} />
                    <ChevronRight size={18} strokeWidth={4} className="-ml-3" />
                    <ChevronRight size={18} strokeWidth={4} className="-ml-3" />
                  </div>
                  <span className="text-[#c8102e] font-extrabold text-[17px] tracking-wide">{job}</span>
                </div>
              ))}
              
              {/* Decorative spark/stars */}
              <div className="absolute right-12 bottom-0 flex flex-col items-center">
                <Sparkles className="w-8 h-8 text-[#003b73] fill-[#003b73]" />
                <Sparkles className="w-4 h-4 text-[#003b73] fill-[#003b73] ml-6 -mt-2" />
              </div>
            </div>

            {/* Location Address */}
            <div className="flex items-start gap-2.5 mt-auto bg-white/80 p-2 rounded-xl backdrop-blur-sm inline-flex w-max -ml-2">
              <div className="mt-0.5">
                <MapPin className="text-[#1966d2] w-5 h-5" fill="currentColor" stroke="white" />
              </div>
              <span className="text-[#1966d2] text-[13.5px] font-bold max-w-[280px] leading-snug">
                Lô CN14 KCN Mỹ Thuận, phường Mỹ Lộc,<br/>tỉnh Nam Định
              </span>
            </div>
          </div>

          {/* Banner Right Image Area */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* The bold diagonal separator */}
            <div className="absolute right-[35%] -top-10 -bottom-10 w-[200px] bg-white skew-x-[-25deg] z-10 shadow-2xl"></div>
            <div className="absolute right-[34.8%] -top-10 -bottom-10 w-[20px] bg-[#c8102e] skew-x-[-25deg] z-10 shadow-xl"></div>
            <div className="absolute right-[33.5%] -top-10 -bottom-10 w-[20px] bg-[#1966d2] skew-x-[-25deg] z-10"></div>
            
            {/* Background Factory Image */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] z-0">
               <img 
                 src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1200&auto=format&fit=crop" 
                 alt="Factory Building"
                 className="w-full h-full object-cover filter brightness-105 contrast-110" 
               />
               
               {/* Quanta Logo Overlay */}
               <div className="absolute top-4 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm flex flex-col items-center">
                 <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-[#1966d2] text-[28px] font-black block relative">
                      C<span className="absolute top-[40%] right-0 w-4 h-1 bg-[#c8102e] rounded-sm"></span>
                      <span className="absolute top-[60%] right-0 w-4 h-1 bg-[#c8102e] rounded-sm"></span>
                      <span className="absolute top-[80%] right-0 w-4 h-1 bg-[#c8102e] rounded-sm"></span>
                    </span>
                 </div>
                 <span className="text-[#333333] text-[11px] font-black uppercase tracking-wider mt-1">Quanta Computer</span>
               </div>
               
               {/* Large 3D Quanta text on the ground */}
               <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 px-4">
                 <h1 
                    className="text-[72px] font-black text-[#1966d2] tracking-tighter w-full text-center" 
                    style={{ 
                      WebkitTextStroke: '1px rgba(255,255,255,0.5)',
                      textShadow: '3px 4px 0px #0b3d82, 0px 10px 15px rgba(0,0,0,0.5)',
                      transform: 'scaleY(0.9) perspective(500px) rotateX(15deg)'
                    }}
                  >
                    Quanta
                 </h1>
               </div>
            </div>
          </div>
          
          {/* Slider Controls */}
          {/* Left Arrow (semi-circle on edge) */}
          <button className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#8ab4f8]/80 backdrop-blur-sm rounded-full flex items-center justify-end pr-1 text-[#1966d2] shadow-sm z-30 transition-transform hover:scale-110">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          
          {/* Right Arrow */}
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white shadow-sm z-30 border border-white/40 transition-transform hover:scale-110">
            <ChevronRight size={24} />
          </button>

          {/* Bottom Dots */}
          <div className="absolute bottom-4 left-[35%] flex gap-2 z-30">
            <div className="w-6 h-1.5 bg-[#00ff00] rounded-full shadow-sm"></div>
            <div className="w-6 h-1.5 bg-[#1966d2] rounded-full shadow-sm"></div>
            <div className="w-6 h-1.5 bg-[#1966d2] rounded-full shadow-sm"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
