import React, { useState, useRef, useEffect } from "react";
import UserDropdown from "@/features/user/components/UserDropdown";
import { useAppSelector } from "@/store/hooks";

interface HeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hasNotif, setHasNotif] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input khi mở search trên mobile
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="flex justify-between items-center w-full px-6 md:px-10 py-3 h-[76px] sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#F1F5F9] shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300">
      
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-colors focus:ring-2 focus:ring-primary/20"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="relative w-full max-w-[480px] hidden md:block group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#00307c] transition-colors duration-300">
            search
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-[#F8FAFC] border-2 border-transparent hover:bg-[#F1F5F9] focus:bg-white rounded-xl focus:ring-0 focus:border-[#00307c]/20 focus:shadow-[0_0_0_4px_rgba(0,48,124,0.05)] text-[14.5px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all duration-300"
            placeholder="Tìm kiếm ứng viên, công việc, chiến dịch..."
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#475569] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          {!searchValue && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 opacity-60">
              <kbd className="px-1.5 py-0.5 text-[10px] font-black bg-white border border-[#E2E8F0] rounded shadow-sm text-[#64748B]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] font-black bg-white border border-[#E2E8F0] rounded shadow-sm text-[#64748B]">K</kbd>
            </div>
          )}
        </div>

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition-colors ml-auto"
          onClick={() => setSearchOpen(true)}
        >
          <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden sm:flex items-center border-r border-[#E2E8F0] pr-5 gap-2">
          <button
            onClick={() => setHasNotif(false)}
            className="relative w-11 h-11 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-full transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {hasNotif && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
            )}
          </button>
          
          <button className="w-11 h-11 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-full transition-all duration-300">
            <span className="material-symbols-outlined text-[22px]">chat_bubble</span>
          </button>
          
          <button className="w-11 h-11 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-full transition-all duration-300">
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-0">
          <div className="hidden lg:flex flex-col items-end justify-center">
            <p className="text-[14px] font-bold text-[#0F172A] leading-tight">
              {user ? user.fullName : "Nguyễn Minh"}
            </p>
            <p className="text-[12px] font-semibold text-[#64748B] leading-tight mt-0.5">
              Chuyên viên Tuyển dụng
            </p>
          </div>
          <div className="relative group cursor-pointer ml-1">
            <div className="absolute inset-0 bg-[#00307c] rounded-full opacity-0 group-hover:opacity-20 scale-110 transition-all duration-300" />
            {user ? (
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm z-10">
                <UserDropdown user={user} />
              </div>
            ) : (
              <img
                alt="Recruiter Profile"
                className="relative w-11 h-11 rounded-full border-2 border-white shadow-sm object-cover z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0flmfLF6dGXpPZit5NUJS54piK-OMpKkYNXdrfL3IuwmsWim1R7uEra-ellyOKpXnJT-YaxqqOK4RtCZEK1CjWzDVsQxKJkyqK_MCcFF0aTy6gKiyTbH0suwx-GnoJKOQK4iyV-32q6hSU0_Ap4i8EecEKwiSv86hiiTTcYNzYi9_t_uCul1vaGGUKPoIuWSz1x8_FvgfTczRiRyW1rww2de8RnPQIQnZZjZTDu0WtuCsQxBZex3AM40HJjh6uYYL3sHKSbaZf3U"
              />
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-20" />
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 h-[76px] px-6 border-b border-[#F1F5F9] bg-white">
            <span className="material-symbols-outlined text-[#64748B]">search</span>
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm ứng viên, tin tuyển dụng..."
              className="flex-1 bg-transparent text-[16px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] outline-none border-none"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              className="w-10 h-10 flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
