import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, X, Command, Settings } from "lucide-react";

import UserDropdown from "@/features/user/components/UserDropdown";
import { cn } from "@/lib/utils";
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

  // Focus input khi mở search
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Đóng search khi nhấn Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchValue("");
      }
      // ⌘K / Ctrl+K để mở
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between",
        "bg-background shadow-sm dark:shadow-none border-b border-border/50",
        "px-6",
        "transition-all duration-300",
      )}
    >
      {/* ── LEFT ── */}
      <div className="flex items-center gap-4 w-full max-w-md">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={cn(
            "lg:hidden flex items-center justify-center size-9 rounded-full shrink-0",
            "text-muted-foreground hover:text-primary",
            "transition-colors",
          )}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Search bar */}
        <div className="relative w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm ứng viên, tin tuyển dụng..."
            className={cn(
              "w-full bg-card border border-border rounded-full py-2 pl-10 pr-10",
              "text-sm font-medium text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow",
            )}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors"
            >
              <X className="size-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Mobile search trigger */}
        <button
          className={cn(
            "md:hidden flex items-center justify-center size-9 rounded-full shrink-0",
            "text-muted-foreground hover:text-primary",
            "transition-colors",
          )}
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="size-5" />
        </button>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification bell */}
        <button
          onClick={() => setHasNotif(false)}
          className="text-muted-foreground hover:text-primary transition-colors hover:opacity-80 relative"
          aria-label={hasNotif ? "Thông báo mới" : "Thông báo"}
        >
          <Bell className="size-6" />
          {hasNotif && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
          )}
        </button>
        
        {/* Settings */}
        <button className="text-muted-foreground hover:text-primary transition-colors hover:opacity-80">
           <Settings className="size-6" />
        </button>

        {/* User dropdown or Mock Avatar */}
        <div className="ml-2 flex items-center">
          {user ? (
            <div className="size-8 rounded-full border-2 border-muted overflow-hidden hover:opacity-80 transition-opacity">
              <UserDropdown user={user} />
            </div>
          ) : (
            <div className="size-8 rounded-full overflow-hidden border-2 border-muted cursor-pointer hover:opacity-80 transition-opacity">
              <img 
                alt="Recruiter Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHT1yh-BbEra1moFnojNhVI7fDQJwdrJWn1yxCZrmIhFoCIzCplK-pTKKLx7bqR5MGEvqBy6jzXP9FQKmPrEDg302uIO1Ygyfdo4FKfSO5QqQc8KmHceWnRgF7Dji2r2RnQThRI1_L6zUZJHOOkH0sTl_fCLcbEjxv3RydKwcWMjmzmM9zzMVhSLghtda9M2RFVXMredfHUnSEnHW3M4FTIAX2TYsbkPEuKoujunQAeifjfVTuljZIcJJgFSEXNLRHX6fRCncrBuM" 
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile fullscreen search overlay ── */}
      {searchOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col",
            "bg-background/95 backdrop-blur-xl",
            "md:hidden animate-fade-in",
          )}
        >
          <div className="flex items-center gap-3 h-16 px-4 border-b border-border">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm ứng viên, tin tuyển dụng..."
              className={cn(
                "flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/70",
                "outline-none border-none",
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              className={cn(
                "flex items-center justify-center size-8 rounded-full shrink-0",
                "text-muted-foreground hover:text-primary",
                "transition-colors",
              )}
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search empty state */}
          {!searchValue && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                <Search className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nhập từ khoá để tìm kiếm
              </p>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
