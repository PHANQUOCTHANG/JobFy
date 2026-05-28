import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, Search, X, Command } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
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

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchValue("");
      }
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
        "border-b border-border",
        "bg-background/80 backdrop-blur-xl",
        "px-4 lg:px-6",
        "transition-all duration-300",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={cn(
            "lg:hidden flex items-center justify-center size-9 rounded-xl shrink-0",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted/70 transition-all duration-150 active:scale-95",
          )}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden md:flex relative w-full max-w-xs lg:max-w-sm">
          <div
            className={cn(
              "flex items-center w-full gap-2 px-3 rounded-xl cursor-text",
              "bg-muted/50 border border-transparent",
              "hover:bg-muted/70 hover:border-border/50",
              "focus-within:bg-background focus-within:border-border focus-within:shadow-[0_0_0_3px_hsl(var(--ring)/0.12)]",
              "transition-all duration-200 h-9",
            )}
            onClick={() => inputRef.current?.focus()}
          >
            <Search className="size-3.5 text-muted-foreground/60 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm việc làm..."
              className={cn(
                "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50",
                "outline-none border-none",
              )}
            />
            {searchValue ? (
              <button
                onClick={() => setSearchValue("")}
                className="size-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 flex items-center justify-center transition-colors"
              >
                <X className="size-2.5 text-muted-foreground" />
              </button>
            ) : (
              <div className="flex items-center gap-0.5 shrink-0">
                <kbd
                  className={cn(
                    "inline-flex items-center justify-center",
                    "size-5 rounded text-[10px] font-medium",
                    "bg-muted text-muted-foreground/60 border border-border/60",
                  )}
                >
                  <Command className="size-2.5" />
                </kbd>
                <kbd
                  className={cn(
                    "inline-flex items-center justify-center",
                    "px-1.5 h-5 rounded text-[10px] font-medium",
                    "bg-muted text-muted-foreground/60 border border-border/60",
                  )}
                >
                  K
                </kbd>
              </div>
            )}
          </div>
        </div>

        <button
          className={cn(
            "md:hidden flex items-center justify-center size-9 rounded-xl shrink-0",
            "text-muted-foreground hover:text-foreground hover:bg-muted/70",
            "transition-all duration-150 active:scale-95",
          )}
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={() => setHasNotif(false)}
          className={cn(
            "relative flex items-center justify-center size-9 rounded-xl",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted/70 transition-all duration-150 active:scale-95",
          )}
          aria-label={hasNotif ? "Thông báo mới" : "Thông báo"}
        >
          <Bell className="size-4.5" />
          {hasNotif && (
            <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive">
              <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
            </span>
          )}
        </button>

        <div className="h-5 w-px bg-border/60 mx-1" />

        <ModeToggle />

        {user && (
          <div className="ml-1">
            <UserDropdown user={user} />
          </div>
        )}
      </div>

      {searchOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col",
            "bg-background/95 backdrop-blur-xl",
            "md:hidden animate-fade-in",
          )}
        >
          <div className="flex items-center gap-3 h-16 px-4 border-b border-border">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm việc làm..."
              className={cn(
                "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50",
                "outline-none border-none",
              )}
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              className={cn(
                "flex items-center justify-center size-8 rounded-lg shrink-0",
                "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                "transition-all duration-150",
              )}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
