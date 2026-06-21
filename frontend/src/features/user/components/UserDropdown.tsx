import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import { Briefcase, FileText, Settings, User as UserIcon, Award, LogOut, ChevronDown } from "lucide-react";
import React, { useState, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IUser } from "../types";

import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/features/auth/slice/authSlice";

interface UserDropdownProps {
  user: IUser;
}

// Helper component nhỏ cho việc tạo ID số ngắn từ chuỗi ID dài
const generateShortId = (id: string | number | undefined) => {
  if (!id) return "10494824";
  const strId = String(id);
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    hash = (hash << 5) - hash + strId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString().substring(0, 8).padStart(8, "0");
};

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    if (user?.role === 'employer') {
      navigate("/employer/login");
    } else {
      navigate("/");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <motion.button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-9 sm:size-10 border border-border/50 shadow-sm cursor-pointer bg-white">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              alt={user?.fullName || "User Avatar"}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-[#e2e6eb] overflow-hidden flex items-end justify-center">
              <svg className="w-[80%] h-[80%] text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </AvatarFallback>
          </Avatar>

          <div className="absolute -bottom-0.5 -right-0.5 size-[18px] bg-[#f1f3f4] rounded-full flex items-center justify-center border-2 border-white shadow-sm pointer-events-none">
            <ChevronDown className="size-3 text-slate-700" strokeWidth={3} />
          </div>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="z-[2000] w-[340px] p-0 rounded-2xl shadow-xl border-slate-200 bg-white overflow-hidden" 
        align="end" 
        sideOffset={12}
      >
        {/* Header User Info */}
        <div className="flex items-center gap-4 p-5 border-b border-slate-100">
          <Avatar className="size-14 border border-slate-100 shadow-sm bg-slate-100">
            <AvatarImage
              src={user?.avatarUrl || undefined}
              alt={user?.fullName || "User Avatar"}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="bg-[#e2e6eb] overflow-hidden flex items-end justify-center">
              <svg className="w-[80%] h-[80%] text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-[16px] font-bold text-[#212f3f] leading-tight truncate">
              {user?.fullName || "Người dùng"}
            </p>
            <p className="text-[13px] text-slate-500 mt-1 flex items-center">
              Tài khoản đã xác thực
            </p>
            <p className="text-[12px] text-slate-400 mt-0.5 truncate">
              ID {generateShortId(user?.id)} | {user?.email}
            </p>
          </div>
        </div>

        {/* Accordion Menu */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          <Accordion type="multiple" defaultValue={["job-management", "cv-management"]} className="w-full space-y-1">
            
            {/* Quản lý tìm việc */}
            <AccordionItem value="job-management" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50/50">
                <div className="flex items-center gap-3 text-[#212f3f]">
                  <div className="relative text-slate-600">
                    <Briefcase className="size-[20px]" strokeWidth={2} />
                    <span className="absolute -bottom-0.5 -right-0.5 size-[9px] bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="font-bold text-[14.5px]">Quản lý tìm việc</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="flex flex-col pl-11 pr-2 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate("/saved-jobs")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Việc làm đã lưu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/applications")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Việc làm đã ứng tuyển
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate("/matching-jobs")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Việc làm phù hợp với bạn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/job-suggestions")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Cài đặt gợi ý việc làm
                  </DropdownMenuItem> */}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Quản lý CV & Cover letter */}
            <AccordionItem value="cv-management" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50/50">
                <div className="flex items-center gap-3 text-[#212f3f]">
                  <div className="relative text-slate-600">
                    <FileText className="size-[20px]" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-[14.5px]">Quản lý CV & Cover letter</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="flex flex-col pl-11 pr-2 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate("/cv/my-cvs")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    CV của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-cover-letters")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Cover Letter của tôi
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem onClick={() => navigate("/employers-connect")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Nhà tuyển dụng muốn kết nối với bạn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/employers-viewed")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Nhà tuyển dụng xem hồ sơ
                  </DropdownMenuItem> */}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Cài đặt email & thông báo */}
            <AccordionItem value="email-settings" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50/50">
                <div className="flex items-center gap-3 text-[#212f3f]">
                  <div className="relative text-slate-600">
                    <Settings className="size-[20px]" strokeWidth={2} />
                    <span className="absolute -bottom-0.5 -right-0.5 size-[9px] bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="font-bold text-[14.5px]">Cài đặt email & thông báo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="flex flex-col pl-11 pr-2 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate("/notifications-settings")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Tuỳ chỉnh thông báo
                  </DropdownMenuItem>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Cá nhân & Bảo mật */}
            <AccordionItem value="security" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50/50">
                <div className="flex items-center gap-3 text-[#212f3f]">
                  <div className="relative text-slate-600">
                    <UserIcon className="size-[20px]" strokeWidth={2} />
                    <span className="absolute -bottom-0.5 -right-0.5 size-[9px] bg-emerald-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="font-bold text-[14.5px]">Cá nhân & Bảo mật</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="flex flex-col pl-11 pr-2 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate("/profile?tab=overview")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/security-settings")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Đổi mật khẩu
                  </DropdownMenuItem>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Nâng cấp tài khoản */}
            <AccordionItem value="upgrade" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors [&[data-state=open]]:bg-slate-50/50">
                <div className="flex items-center gap-3 text-[#212f3f]">
                  <div className="relative text-slate-600">
                    <Award className="size-[20px]" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-[14.5px]">Nâng cấp tài khoản</span>
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
              </AccordionTrigger>
              <AccordionContent className="pb-1 pt-1">
                <div className="flex flex-col pl-11 pr-2 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate("/upgrade")} className="text-[13.5px] text-slate-600 hover:text-indigo-600 focus:text-indigo-600 hover:bg-transparent focus:bg-transparent cursor-pointer py-2 px-2 rounded-lg">
                    Gói tài khoản
                  </DropdownMenuItem>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

        {/* Footer Logout */}
        <div className="p-4 pt-2">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="w-full bg-[#f4f5f5] hover:bg-slate-200 focus:bg-slate-200 text-[#212f3f] cursor-pointer rounded-xl flex items-center justify-center py-2.5 transition-colors group"
          >
            <div className="flex items-center justify-center gap-2 font-bold text-[14.5px]">
              <LogOut className="size-[18px] text-slate-600 group-hover:text-[#212f3f] transition-colors" />
              Đăng xuất
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
