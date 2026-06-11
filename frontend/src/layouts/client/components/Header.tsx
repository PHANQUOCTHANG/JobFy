import { useState } from "react";
import { Briefcase, Bell, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = useLocation().pathname;

  const navLinks = [
    { label: "Việc làm", href: "/jobs" },
    { label: "Công ty", href: "/companies" },
    { label: "CV & Hồ sơ", href: "/cv" },
    { label: "Cẩm nang", href: "/guide" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-[64px]">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-[34px] h-[34px] bg-[#1A56DB] rounded-[10px] flex items-center justify-center shadow-md shadow-[#1A56DB]/20">
            <Briefcase size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Job<span className="text-[#F59E0B]">Fy</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const isActive = path === href || (href !== "/" && path.startsWith(href));
            return (
              <Link
                key={href}
                to={href}
                className={`px-4 py-2 text-[13.5px] font-medium rounded-lg transition-all ${
                  isActive
                    ? "text-[#1A56DB] bg-[#EEF2FF] font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#F59E0B] rounded-full border-2 border-white" />
          </button>
          <Link
            to="/login"
            className="text-[13.5px] font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="text-[13.5px] font-semibold bg-[#1A56DB] hover:bg-[#1447C0] text-white px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-[#1A56DB]/20"
          >
            Đăng ký miễn phí
          </Link>
          <a
            href="#"
            className="text-[13.5px] font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 px-4 py-2 rounded-xl transition-all"
          >
            Tuyển dụng
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="bg-white border-t border-slate-200 px-5 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[14px] font-medium py-2.5 px-3 rounded-lg transition-all ${
                path === href
                  ? "text-[#1A56DB] bg-[#EEF2FF]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
            <Link to="/login" className="flex-1 text-center border border-slate-300 text-slate-700 py-2.5 rounded-xl text-[13px] font-medium hover:bg-slate-50 transition-all">
              Đăng nhập
            </Link>
            <Link to="/register" className="flex-1 text-center bg-[#1A56DB] text-white py-2.5 rounded-xl text-[13px] font-semibold hover:bg-[#1447C0] transition-all">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
