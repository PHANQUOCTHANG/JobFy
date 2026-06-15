import React, { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/features/auth/types/authSlice";
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

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F172A]/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col py-6 bg-white border-r border-[#F1F5F9] shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:static lg:translate-x-0",
          isCollapsed ? "w-[88px]" : "w-[280px]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <Link to="/employer" className="flex items-center gap-3 outline-none group">
            <div className="w-11 h-11 bg-gradient-to-br from-[#00307c] to-[#0052cc] shadow-[0_4px_12px_rgba(0,48,124,0.3)] flex items-center justify-center rounded-xl text-white shrink-0 group-hover:scale-105 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                business_center
              </span>
            </div>
            {!isCollapsed && (
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
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-[#64748B] hover:bg-[#F1F5F9] p-2 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation */}
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
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center transition-all duration-300 group overflow-hidden",
                  isCollapsed ? "justify-center px-0 py-3 mx-auto w-12 rounded-xl" : "px-4 py-3.5 rounded-xl",
                  isActive
                    ? "bg-[#00307c] text-white shadow-[0_4px_14px_0_rgba(0,48,124,0.25)]"
                    : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                )}
              >
                {/* Background hover effect for non-active items */}
                {!isActive && (
                  <span className="absolute inset-0 bg-[#F1F5F9] opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 z-0 rounded-xl" />
                )}
                
                <div className="relative z-10 flex items-center w-full">
                  <span
                    className={cn(
                      "material-symbols-outlined text-[22px] transition-all duration-300",
                      !isCollapsed && "mr-3.5",
                      isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-[#00307c]"
                    )}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
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

        {/* Bottom Actions */}
        <div className="mt-auto px-4 space-y-2 shrink-0 pt-6 border-t border-[#F1F5F9]/60">
          <Link
            to={`${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.CREATE_JOB}`}
            className={cn(
              "w-full mb-4 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white py-3.5 rounded-xl flex items-center justify-center hover:shadow-[0_8px_20px_-6px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-bold",
              isCollapsed ? "px-0" : "px-4"
            )}
            title={isCollapsed ? "Đăng tin mới" : undefined}
          >
            <span className="material-symbols-outlined text-[20px] mr-2">add_circle</span>
            {!isCollapsed && "Đăng tin mới"}
          </Link>
          
          <Link
            to="/help"
            className={cn(
              "flex items-center py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] rounded-xl transition-all duration-200 group",
              isCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isCollapsed ? "Trung tâm trợ giúp" : undefined}
          >
            <span className={cn("material-symbols-outlined text-[20px] group-hover:text-[#00307c] transition-colors", !isCollapsed && "mr-3")}>help</span>
            {!isCollapsed && <span className="text-[14px] font-semibold truncate">Trung tâm trợ giúp</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center py-3 text-[#64748B] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-xl transition-all duration-200 group",
              isCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isCollapsed ? "Đăng xuất" : undefined}
          >
            <span className={cn("material-symbols-outlined text-[20px] transition-colors", !isCollapsed && "mr-3")}>logout</span>
            {!isCollapsed && <span className="text-[14px] font-semibold truncate">Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default memo(Sidebar);
