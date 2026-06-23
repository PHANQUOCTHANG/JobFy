import React, { memo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/features/auth/slice/authSlice";
import { toast } from "sonner";

const sidebarItems = [
  {
    label: "Bảng điều khiển",
    path: `${EMPLOYER_PATHS.DASHBOARD}`,
    icon: "dashboard",
  },
  {
    label: "Tin tuyển dụng",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.JOBS}`,
    icon: "work",
  },
  {
    label: "Ứng viên",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.APPLICATIONS}`,
    icon: "group",
  },
  {
    label: "Công ty",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.COMPANY_PROFILE}`,
    icon: "business",
  },
  {
    label: "Cài đặt",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.SETTINGS}`,
    icon: "settings",
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed,
  toggleSidebar,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    toast.promise(dispatch(logoutUser()).unwrap(), {
      loading: 'Đang đăng xuất...',
      success: () => {
        navigate('/employer/login', { replace: true });
        return 'Đã đăng xuất thành công';
      },
      error: 'Có lỗi xảy ra khi đăng xuất',
    });
  };

  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = isCollapsed && !isHovered;

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F172A]/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop spacer to keep layout from jumping when sidebar overlays */}
      <div className={cn("hidden lg:block shrink-0 transition-all duration-300", isCollapsed ? "w-[88px]" : "w-[280px]")} />

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col py-6 bg-white border-r border-[#F1F5F9] shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          effectiveCollapsed ? "w-[88px]" : "w-[280px]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isHovered && isCollapsed ? "shadow-[20px_0_40px_-10px_rgba(0,0,0,0.1)]" : ""
        )}
      >
        {/* Logo */}
        <div className={cn("px-6 mb-8 flex items-center", effectiveCollapsed ? "justify-center" : "justify-between")}>
          <Link to="/employer" className={cn("flex items-center gap-3 outline-none group", effectiveCollapsed ? "hidden" : "flex")}>
            <div className="w-11 h-11 bg-gradient-to-br from-[#00307c] to-[#0052cc] shadow-[0_4px_12px_rgba(0,48,124,0.3)] flex items-center justify-center rounded-xl text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                business_center
              </span>
            </div>
            {!effectiveCollapsed && (
              <div className="truncate flex flex-col">
                <h1 className="text-[22px] font-black text-[#0F172A] tracking-tight leading-none mb-1">
                  JobFy<span className="text-[#00307c]">.</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
                  Hạng Doanh Nghiệp
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn("hidden lg:flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#00307c] p-2 rounded-xl transition-all", effectiveCollapsed && "w-full")}
            title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isCollapsed ? "menu_open" : "menu"}
            </span>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#64748B] hover:bg-[#F1F5F9] p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 custom-scrollbar">
          {sidebarItems.map((item) => {
            const isActive =
              item.path === EMPLOYER_PATHS.DASHBOARD
                ? location.pathname === item.path || location.pathname === `${item.path}/`
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                title={effectiveCollapsed ? item.label : undefined}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "relative flex items-center transition-all duration-300 group overflow-hidden",
                  effectiveCollapsed ? "justify-center px-0 py-3 mx-auto w-12 rounded-xl" : "px-4 py-3.5 rounded-xl",
                  isActive
                    ? "bg-[#00307c] text-white shadow-[0_4px_14px_0_rgba(0,48,124,0.25)]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                )}
              >
                {!isActive && (
                  <span className="absolute inset-0 bg-[#F1F5F9] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 z-0 rounded-xl" />
                )}
                
                <div className="relative z-10 flex items-center w-full">
                  <span
                    className={cn(
                      "material-symbols-outlined text-[22px] transition-all duration-300",
                      !effectiveCollapsed && "mr-3.5",
                      isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-[#00307c]"
                    )}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {!effectiveCollapsed && (
                    <span className={cn(
                      "text-[15px] truncate transition-all duration-300",
                      isActive ? "font-bold" : "font-semibold group-hover:translate-x-0.5"
                    )}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 space-y-2 shrink-0 pt-6 border-t border-[#F1F5F9]/60">
          <Link
            to={`${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.CREATE_JOB}`}
            className={cn(
              "w-full mb-4 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white py-3.5 rounded-xl flex items-center justify-center hover:shadow-[0_8px_20px_-6px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-bold overflow-hidden",
              effectiveCollapsed ? "px-0" : "px-4"
            )}
            title={effectiveCollapsed ? "Đăng tin mới" : undefined}
          >
            <span className="material-symbols-outlined text-[20px] mr-0 shrink-0">add_circle</span>
            {!effectiveCollapsed && <span className="ml-2 whitespace-nowrap">Đăng tin mới</span>}
          </Link>
          
          <Link
            to="/help"
            className={cn(
              "flex items-center py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] rounded-xl transition-all duration-200 group overflow-hidden",
              effectiveCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={effectiveCollapsed ? "Trung tâm trợ giúp" : undefined}
          >
            <span className={cn("material-symbols-outlined text-[20px] group-hover:text-[#00307c] transition-colors shrink-0")}>help</span>
            {!effectiveCollapsed && <span className="text-[14px] font-semibold whitespace-nowrap ml-3">Trung tâm trợ giúp</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center py-3 text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-xl transition-all duration-200 group overflow-hidden",
              effectiveCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={effectiveCollapsed ? "Đăng xuất" : undefined}
          >
            <span className={cn("material-symbols-outlined text-[20px] transition-colors shrink-0")}>logout</span>
            {!effectiveCollapsed && <span className="text-[14px] font-semibold whitespace-nowrap ml-3">Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
