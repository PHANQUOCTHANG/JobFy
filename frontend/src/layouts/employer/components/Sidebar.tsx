import React, { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { EMPLOYER_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Briefcase,
  Users,
  Building,
  Settings,
  Sun,
  Moon,
  X,
} from "lucide-react";
import Avatar, { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  CreditCard,
  Plus
} from "lucide-react";

const sidebarItems = [
  {
    label: "Bảng điều khiển",
    path: `${EMPLOYER_PATHS.DASHBOARD}`,
    icon: LayoutDashboard,
  },
  {
    label: "Hồ sơ công ty",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.COMPANY_PROFILE}`,
    icon: Building,
  },
  {
    label: "Quản lý tin tuyển dụng",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.JOBS}`,
    icon: Briefcase,
  },
  {
    label: "Thành viên nhóm",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.TEAM}`,
    icon: Users,
  },
  {
    label: "Thanh toán",
    path: `${EMPLOYER_PATHS.DASHBOARD}/${EMPLOYER_PATHS.BILLING}`,
    icon: CreditCard,
  },
];

/* ─── Logo ─────────────────────────────────────────────────────── */
const Logo = memo(({ collapsed }: { collapsed: boolean }) => (
  <Link
    to="/employer"
    className={cn(
      "group flex items-center gap-2.5 shrink-0 rounded-xl",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
      collapsed && "justify-center",
    )}
    aria-label="JobFy — Go to dashboard"
  >
    {/* Logo mark */}
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl shrink-0",
        "size-9 transition-all duration-300",
        "bg-primary/10 border border-primary/20",
        "group-hover:bg-primary/15 group-hover:scale-105 group-hover:shadow-glow-xs",
      )}
    >
      <Avatar className="size-full rounded-xl">
        <AvatarImage
          src="https://res.cloudinary.com/dc5rfjnn5/image/upload/v1770807338/LOGO_o4n02n.png"
          alt=""
          aria-hidden="true"
          className="object-cover p-0.5"
        />
        <AvatarFallback className="bg-transparent font-black text-primary text-xs">
          JF
        </AvatarFallback>
      </Avatar>
      <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-primary border-2 border-sidebar" />
    </div>

    {/* Wordmark */}
    {!collapsed && (
      <div className="flex flex-col leading-none select-none">
        <span className="text-[15px] font-black tracking-tight text-foreground">
          JobFy<span className="text-primary">.</span>
        </span>
        <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 mt-0.5">
          Nhà tuyển dụng
        </span>
      </div>
    )}
  </Link>
));
Logo.displayName = "Logo";

/* ─── Nav Item ──────────────────────────────────────────────────── */
interface NavItemProps {
  label: string;
  path: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = memo(
  ({ label, icon: Icon, isActive, isCollapsed, onClick }: NavItemProps) => (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-xl text-sm font-medium",
        "outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "transition-all duration-200 ease-out",
        isCollapsed ? "justify-center w-10 h-10 mx-auto px-0" : "px-3 py-2.5",
        isActive
          ? [
              "bg-primary/10 text-primary",
              "shadow-[inset_0_1px_0_hsl(var(--primary)/0.12),inset_0_-1px_0_hsl(var(--primary)/0.06)]",
            ]
          : [
              "text-sidebar-foreground/60",
              "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
            ],
      )}
    >
      {isActive && !isCollapsed && (
        <span
          className={cn(
            "absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full",
            "bg-gradient-to-b from-primary to-primary/50",
            "shadow-[0_0_6px_hsl(var(--brand-glow)/0.5)]",
          )}
        />
      )}

      {isActive && isCollapsed && (
        <span className="absolute inset-0 rounded-xl ring-1 ring-primary/30 bg-primary/10" />
      )}

      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-all duration-200",
          isActive
            ? "text-primary"
            : "text-sidebar-foreground/50 group-hover:text-primary group-hover:scale-110",
        )}
      />

      {!isCollapsed && <span className="truncate tracking-tight">{label}</span>}

      {isCollapsed && (
        <span
          className={cn(
            "absolute left-full ml-3 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none",
            "bg-popover border border-border text-foreground shadow-floating",
            "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
            "transition-all duration-150 z-50",
          )}
        >
          {label}
        </span>
      )}
    </button>
  ),
);
NavItem.displayName = "NavItem";

/* ─── Sidebar ───────────────────────────────────────────────────── */
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
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 h-screen lg:static lg:z-auto",
        "flex flex-col",
        "bg-sidebar border-r border-sidebar-border",
        "transition-all duration-300 ease-out",
        isSidebarOpen
          ? "w-64 translate-x-0 shadow-[4px_0_32px_hsl(var(--shadow-color)/var(--shadow-alpha-lg))] lg:shadow-none"
          : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-[70px]" : "lg:w-64",
      )}
    >
      <div
        className={cn(
          "relative flex h-16 items-center shrink-0",
          "border-b border-sidebar-border",
          isCollapsed ? "justify-center" : "justify-between px-4",
        )}
      >
        <Logo collapsed={isCollapsed} />

        {!isCollapsed && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "lg:hidden flex items-center justify-center size-8 rounded-lg",
              "text-sidebar-foreground/50 hover:text-sidebar-foreground",
              "hover:bg-sidebar-accent/60 transition-all duration-150",
            )}
          >
            <X className="size-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar"
        aria-label="Employer navigation"
      >
        <div className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive =
              item.path === EMPLOYER_PATHS.DASHBOARD
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <NavItem
                key={item.label}
                label={item.label}
                path={item.path}
                icon={item.icon}
                isActive={isActive}
                isCollapsed={isCollapsed}
                onClick={() => navigate(item.path)}
              />
            );
          })}
        </div>
      </nav>

      <div className={cn("px-4 py-4 border-t border-sidebar-border shrink-0", isCollapsed ? "hidden" : "block")}>
        <button className="w-full bg-primary text-primary-foreground text-sm font-medium py-3 rounded-full shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Plus className="size-4" />
          Đăng tin tuyển dụng
        </button>
      </div>

      <div
        className={cn(
          "border-t border-sidebar-border shrink-0",
          "bg-sidebar",
          isCollapsed
            ? "p-2 flex flex-col items-center gap-1"
            : "p-3 space-y-1",
        )}
      >
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          className={cn(
            "hidden lg:flex items-center rounded-xl text-sm font-medium",
            "text-sidebar-foreground/50 hover:text-sidebar-accent-foreground",
            "hover:bg-sidebar-accent/70 transition-all duration-200",
            isCollapsed
              ? "justify-center w-10 h-10"
              : "gap-3 w-full px-3 py-2.5",
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="size-4 shrink-0" />
              <span>Thu gọn</span>
            </>
          )}
        </button>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
          className={cn(
            "flex items-center rounded-xl text-sm font-medium",
            "text-sidebar-foreground/50 hover:text-sidebar-accent-foreground",
            "hover:bg-sidebar-accent/70 transition-all duration-200",
            isCollapsed
              ? "justify-center w-10 h-10"
              : "gap-3 w-full px-3 py-2.5",
          )}
        >
          <div className="relative size-4 shrink-0">
            <Sun className="absolute inset-0 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute inset-0 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          </div>
          {!isCollapsed && (
            <span>{theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
