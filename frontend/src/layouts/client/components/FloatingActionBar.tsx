import React from 'react';
import { Heart, UserPlus, MessageCircle, Headset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingActionBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-10 right-6 z-[100] flex flex-col gap-3">
      {/* Nút Yêu thích */}
      <button 
        onClick={() => navigate('/candidate/saved-jobs')}
        className="relative w-12 h-12 bg-white rounded-full shadow-[0_4px_12px_rgba(79,70,229,0.15)] flex items-center justify-center text-indigo-600 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(79,70,229,0.2)] transition-all duration-300 border border-indigo-50 group"
      >
        <Heart className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -left-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
          0
        </span>
        {/* Tooltip */}
        <span className="absolute right-14 opacity-0 translate-x-[10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-10">
          Việc làm đã lưu
        </span>
      </button>

      {/* Nút Tạo hồ sơ / Connect */}
      <button 
        onClick={() => navigate('/profile')}
        className="w-12 h-12 bg-white rounded-full shadow-[0_4px_12px_rgba(79,70,229,0.15)] flex items-center justify-center text-indigo-600 hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(79,70,229,0.2)] transition-all duration-300 border border-indigo-50 group relative"
      >
        <UserPlus className="w-5 h-5" strokeWidth={2.5} />
        <span className="absolute right-14 opacity-0 translate-x-[10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-10">
          Tạo CV / Profile
        </span>
      </button>

      {/* Box Góp ý & Hỗ trợ */}
      <div className="bg-white rounded-full shadow-[0_4px_12px_rgba(79,70,229,0.15)] flex flex-col items-center overflow-visible border border-indigo-50 mt-1 pb-1">
        <button className="flex flex-col items-center justify-center w-12 h-[60px] text-indigo-600 hover:bg-indigo-50 transition-colors border-b border-indigo-50 group relative rounded-t-full">
          <MessageCircle className="w-[22px] h-[22px] fill-current mb-0.5" />
          <span className="text-[10px] font-semibold mt-1">Góp ý</span>
          <span className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 translate-x-[10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-10">
            Gửi góp ý
          </span>
        </button>
        <button className="flex flex-col items-center justify-center w-12 h-[60px] text-indigo-600 hover:bg-indigo-50 transition-colors group relative rounded-b-full">
          <Headset className="w-6 h-6 mb-0.5" strokeWidth={2} />
          <span className="text-[10px] font-semibold mt-1">Hỗ trợ</span>
          <span className="absolute right-14 top-1/2 -translate-y-1/2 opacity-0 translate-x-[10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-10">
            Liên hệ hỗ trợ
          </span>
        </button>
      </div>
    </div>
  );
};
