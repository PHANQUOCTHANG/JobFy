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
    navigate("/");
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

      <DropdownMenuContent className="w-[280px] p-2 rounded-xl shadow-xl border-slate-200 bg-white" align="end" sideOffset={12}>
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal p-3 mb-2 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-3">
          <Avatar className="size-11 border-2 border-white shadow-sm">
            <AvatarImage
              src={user?.avatar || undefined}
              alt={user?.fullName || "User Avatar"}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-indigo-600 text-white font-bold text-sm">
              {getInitialsTextAvartar(user?.fullName || "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 overflow-hidden">
            <p className="text-[14.5px] font-bold text-slate-900 leading-none truncate">
              {user?.fullName || "Người dùng"}
            </p>
            <p className="text-[12px] text-slate-500 truncate font-medium">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile?tab=overview")} className="p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-all duration-200 group text-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
              <UserIcon className="size-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="font-semibold text-[13.5px]">Hồ sơ cá nhân</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator className="my-1 border-slate-100" />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/admin")} className="p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-all duration-200 group text-slate-700">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                  <ChartColumn className="size-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <span className="font-semibold text-[13.5px]">Trang quản trị</span>
                <span className="ml-auto text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-sm font-black tracking-widest uppercase shadow-sm">
                  PRO
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="my-1 border-slate-100" />

        {/* Logout Item */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="p-2.5 rounded-lg cursor-pointer text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 focus:bg-indigo-50 focus:text-indigo-600 transition-all duration-200 mt-1 group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-indigo-100 transition-colors">
            <LogOut className="size-4 text-slate-500 group-hover:text-indigo-600" />
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
