import { useState } from "react";
import { Briefcase, Bell, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#111018]/96 backdrop-blur-lg border-b border-white/6 sticky top-0 z-50 shadow-xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-[62px]">
        {/* Wordmark */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-[34px] h-[34px] bg-[#D44E2B] rounded-[10px] flex items-center justify-center shadow-lg shadow-[#D44E2B]/30">
            <Briefcase size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Job<span className="text-[#E8A83A]">Fy</span>
          </span>
        </a>

        {/* Nav links desktop */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            ["Tìm việc làm", true],
            ["Công ty", false],
            ["CV & Hồ sơ", false],
            ["Cẩm nang", false],
          ].map(([item, active]) => (
            <a key={item as string} href="#"
              className={`px-3.5 py-2 text-[13px] rounded-lg transition-all ${
                active ? "text-white bg-white/10 font-bold" : "text-[#9B8E7F] hover:text-white hover:bg-white/6"
              }`}>{item}</a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <button className="relative p-2 rounded-lg hover:bg-white/8 text-[#6B6059] hover:text-white transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#E8A83A] rounded-full border border-[#111018]" />
          </button>
          <Link to="/login" className="text-[13px] text-[#9B8E7F] hover:text-white px-3.5 py-2 transition-colors">Đăng nhập</Link>
          <Link to="/register" className="text-[13px] font-bold bg-[#D44E2B] hover:bg-[#BF3F1E] text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-[#D44E2B]/25">Đăng ký</Link>
          <a href="#" className="text-[13px] font-bold border border-[#E8A83A]/40 text-[#E8A83A] hover:bg-[#E8A83A] hover:text-[#111018] px-4 py-2 rounded-xl transition-all">Tuyển dụng</a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#9B8E7F] hover:text-white p-1.5">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"}`}>
        <div className="bg-[#1A1720] border-t border-white/8 px-5 py-4 flex flex-col gap-1">
          {["Tìm việc làm", "Công ty", "CV & Hồ sơ", "Cẩm nang"].map(item => (
            <a key={item} href="#"
              className="text-[13px] text-[#9B8E7F] hover:text-white py-2.5 px-2 rounded-lg hover:bg-white/5 transition-all">{item}</a>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-white/8">
            <Link to="/login" className="flex-1 text-center border border-[#3A3540] text-[#9B8E7F] py-2.5 rounded-xl text-[13px] font-medium">Đăng nhập</Link>
            <Link to="/register" className="flex-1 text-center bg-[#D44E2B] text-white py-2.5 rounded-xl text-[13px] font-bold">Đăng ký</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
