import React from "react";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Check } from "lucide-react";

export const ProfileSidebar: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="w-full flex flex-col gap-5 flex-shrink-0">
      {/* User Profile Box */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="w-[64px] h-[64px] border border-slate-100 shadow-sm">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="bg-[#e2e6eb] text-white">
                <svg className="w-[80%] h-[80%]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1.5 -right-3 bg-[#a6a6a6] text-white text-[8px] font-bold px-1 rounded-sm tracking-wider shadow-sm z-10">
              VERIFIED
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00b14f]" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-slate-500 mb-0.5">Chào bạn trở lại,</p>
            <p className="text-[16px] font-bold text-[#212f3f] leading-tight truncate">{user?.fullName || "Người dùng"}</p>
            <div className="mt-1.5">
              <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">Tài khoản đã xác thực</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button className="w-full bg-[#f4f5f5] hover:bg-slate-200 text-[#212f3f] text-[13px] font-bold py-2.5 rounded-full transition-colors flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            Nâng cấp tài khoản
          </button>
        </div>
      </div>

      {/* Toggle Finding Job */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-bold text-[#212f3f]">Đang Tắt tìm việc</span>
          <Switch checked={false} />
        </div>
        <p className="text-[13px] text-slate-500 mb-3">Khi bật tìm việc:</p>
        <ul className="text-[13px] text-slate-500 space-y-2.5">
          <li className="flex gap-2">
            <div className="w-[14px] h-[14px] bg-[#d2d6da] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />
            </div>
            <span className="leading-relaxed text-[12.5px]">Nhà tuyển dụng (NTD) có thể <strong className="font-semibold text-slate-700">tìm thấy</strong> và mang đến cho bạn những cơ hội hấp dẫn. (Xem thêm tại phần Cho phép NTD tìm kiếm bên dưới).</span>
          </li>
          <li className="flex gap-2">
            <div className="w-[14px] h-[14px] bg-[#d2d6da] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />
            </div>
            <span className="leading-relaxed text-[12.5px]">Hồ sơ của bạn sẽ hiển thị <strong className="font-semibold text-slate-700">nổi bật</strong> trên kết quả tìm kiếm của Nhà tuyển dụng.</span>
          </li>
        </ul>
      </div>

      {/* Allow Search Resume */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
        <h3 className="text-[15px] font-bold text-[#212f3f] mb-2">Cho phép NTD tìm kiếm hồ sơ</h3>
        <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
          Bạn chưa có CV nào trên hệ thống. Tạo CV ngay để bắt đầu nhận lời mời kết nối từ các Nhà tuyển dụng uy tín.
        </p>
        <Button className="w-full bg-white hover:bg-[#e5f7ed] text-[#00b14f] border border-[#00b14f] font-bold rounded-full h-[38px] text-[13px]">
          Tạo CV ngay
        </Button>
        <div className="mt-4 bg-[#f4f5f5] p-3 rounded-lg">
          <p className="text-[12.5px] text-slate-500 leading-relaxed">
            Khi bạn cho phép Nhà tuyển dụng (NTD) tìm kiếm hồ sơ, các NTD uy tín có thể tiếp cận thông tin kinh nghiệm làm việc, học vấn, kỹ năng... trên CV của bạn.
          </p>
          <a href="#" className="text-[13px] font-bold text-[#212f3f] hover:text-emerald-600 hover:underline mt-2 inline-block transition-colors">Tìm hiểu thêm v</a>
        </div>
      </div>

      {/* App Download Banner */}
      <div className="bg-[#00b14f] rounded-xl overflow-hidden shadow-sm text-white p-5 flex items-center justify-between relative cursor-pointer hover:opacity-95 transition-opacity mt-2">
        <div className="relative z-10 w-[70%]">
          <div className="font-extrabold text-[20px] tracking-tight mb-1">jobfy</div>
          <p className="text-[13px] font-medium leading-relaxed">Tải App JobFy ngay!<br/>Để không bỏ lỡ bất cứ cơ hội nào từ Nhà tuyển dụng</p>
        </div>
        <div className="bg-white p-1 rounded-lg z-10">
          {/* Fake QR Icon */}
          <div className="w-[50px] h-[50px] bg-slate-100 flex items-center justify-center p-1">
            <div className="w-full h-full border-4 border-slate-800 border-dashed rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-800"></div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white opacity-10 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
      </div>

      {/* CV Priority Banner */}
      <div className="bg-gradient-to-r from-[#00b14f] to-[#009b45] rounded-xl overflow-hidden shadow-sm text-white p-5 flex items-center relative mt-2">
        <div className="flex gap-4 relative z-10">
          <div className="w-[45px] h-[45px] bg-[#ff8c00] rounded-full flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0 text-[20px]">
            🔥
          </div>
          <div>
            <h3 className="font-bold text-[14px] leading-snug mb-1">Bạn có muốn CV của mình được ưu tiên xem trước ?</h3>
            <p className="text-[12px] opacity-90 leading-tight">Mở khóa tính năng VIP để tăng 300% cơ hội tiếp cận Nhà tuyển dụng.</p>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute -bottom-6 -right-6 w-[100px] h-[100px] bg-white opacity-[0.08] rounded-full pointer-events-none"></div>
        <div className="absolute top-2 right-12 w-[20px] h-[20px] bg-white opacity-[0.15] rotate-45 pointer-events-none"></div>
      </div>
    </div>
  );
};
