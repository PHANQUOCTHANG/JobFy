import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import { ChartColumn, LogOut, User as UserIcon } from "lucide-react";

// Nếu bạn không muốn dùng framer-motion có thể bỏ qua,
// nhưng để UX "sướng" hơn thì giữ lại animation nhấn nhẹ này.
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IUser } from "../types";

interface UserDropdownProps {
  user: IUser;
}

import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/features/auth/slice/authSlice";

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    if (user?.role === 'employer') {
      navigate("/employer/login");
    } else {
      navigate("/");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-9 sm:size-10 border border-border/50 shadow-sm cursor-pointer">
            <AvatarImage
              src={user?.avatar || undefined}
              alt={user?.fullName || "User Avatar"}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
              {getInitialsTextAvartar(user?.fullName || "U")}
            </AvatarFallback>
          </Avatar>

          {/* Online Indicator (Optional) */}
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-background" />
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[280px] p-2 rounded-xl shadow-floating border-border/40 bg-popover/95 backdrop-blur-md" align="end" sideOffset={12}>
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal p-3 mb-2 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 flex items-center gap-3">
          <Avatar className="size-11 border-2 border-background shadow-sm">
            <AvatarImage
              src={user?.avatar || undefined}
              alt={user?.fullName || "User Avatar"}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
              {getInitialsTextAvartar(user?.fullName || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 overflow-hidden">
            <p className="text-[14.5px] font-bold text-foreground leading-none truncate">
              {user?.fullName || "Người dùng"}
            </p>
            <p className="text-[12px] text-muted-foreground truncate font-medium">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={() => {
              if (user.role === 'employer') {
                navigate("/employer/company");
              } else {
                navigate("/profile?tab=overview");
              }
            }} 
            className="p-2.5 rounded-lg cursor-pointer hover:bg-accent focus:bg-accent transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center mr-3 group-hover:bg-background group-hover:shadow-sm transition-all duration-200">
              <UserIcon className="size-4 text-foreground/70 group-hover:text-primary transition-colors" />
            </div>
            <span className="font-semibold text-[13.5px]">
              {user.role === 'employer' ? 'Hồ sơ công ty' : 'Hồ sơ cá nhân'}
            </span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator className="my-1 border-border/40" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/admin")} className="p-2.5 rounded-lg cursor-pointer hover:bg-accent focus:bg-accent transition-all duration-200 group">
                <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center mr-3 group-hover:bg-background group-hover:shadow-sm transition-all duration-200">
                  <ChartColumn className="size-4 text-foreground/70 group-hover:text-primary transition-colors" />
                </div>
                <span className="font-semibold text-[13.5px]">Trang quản trị</span>
                <span className="ml-auto text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase shadow-sm">
                  PRO
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="my-1 border-border/40" />

        {/* Logout Item */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="p-2.5 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-all duration-200 mt-1 group"
        >
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mr-3 group-hover:bg-destructive/20 transition-colors">
            <LogOut className="size-4" />
          </div>
          <span className="font-bold text-[13.5px]">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


// Helper component nhỏ cho shortcut phím tắt
function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`ml-auto text-xs tracking-widest text-muted-foreground opacity-60 ${className}`}
      {...props}
    />
  );
}

export default UserDropdown;
