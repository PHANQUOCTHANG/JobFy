import React from "react";
import { ManageCompanyForm } from "@/features/companies/components/ManageCompanyForm";
import { useMyCompany } from "@/features/companies/hooks/useManageCompany";
import { Loader2 } from "lucide-react";

const ManageCompanyPage = () => {
  const { data: company, isLoading, error } = useMyCompany();

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-8 flex-1 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1 text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quản lý</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00307c]">Hồ sơ công ty</span>
          </nav>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">Cấu hình doanh nghiệp</h2>
          <p className="text-[#64748B] text-[15px] font-medium mt-2">
            Cập nhật thông tin định danh và văn hóa để thu hút nhân tài hàng đầu.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-[#475569] font-bold hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm">
            Xem bản xem trước
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
          <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
          <span className="ml-3 text-slate-500 font-medium">Đang tải thông tin công ty...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <p className="font-semibold">Đã xảy ra lỗi</p>
          <p className="text-sm mt-1">Không thể tải thông tin công ty của bạn. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {error && (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
                <div>
                  <p className="font-bold text-[14px]">Chưa có thông tin công ty</p>
                  <p className="text-[13px] font-medium mt-0.5">Hãy điền thông tin bên dưới để thiết lập hồ sơ doanh nghiệp của bạn.</p>
                </div>
              </div>
            )}
            <ManageCompanyForm initialData={company} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-[#F1F5F9] rounded-3xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-[16px] font-black text-[#0F172A]">Trạng thái xác thực</h4>
                  <p className="text-[13px] font-medium text-[#64748B] mt-1">Nâng cao uy tín thương hiệu</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  ĐÃ XÁC THỰC
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]">verified</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#0F172A]">Giấy phép kinh doanh</p>
                    <p className="text-[12px] font-medium text-[#64748B]">Đã kiểm duyệt vào 15/01/2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-blue-600 text-[24px]">domain_verification</span>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#0F172A]">Địa chỉ văn phòng</p>
                    <p className="text-[12px] font-medium text-[#64748B]">Đã xác thực bởi JobFy Trust</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
                <p className="text-[13px] font-medium text-[#64748B] mb-4">
                  Hồ sơ xác thực giúp bạn nổi bật hơn trong mắt các ứng viên tiềm năng nhất.
                </p>
                <button className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  Nâng cấp huy hiệu Platinum
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00307c] to-[#0052cc] text-white rounded-3xl p-8 relative overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,48,124,0.5)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[16px] font-black">Hoàn thiện hồ sơ</h4>
                  <span className="text-3xl font-black tracking-tight">95%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[95%] rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                    <span className="font-semibold text-white/90">Định danh doanh nghiệp</span>
                  </li>
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                    <span className="font-semibold text-white/90">Thông tin liên hệ</span>
                  </li>
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                    <span className="font-semibold text-white/90">Văn hóa công ty</span>
                  </li>
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className="material-symbols-outlined text-white/30 text-[18px]">radio_button_unchecked</span>
                    <span className="font-bold underline decoration-white/50 underline-offset-4">Video giới thiệu (5%)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-[#F1F5F9] rounded-3xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
              <h4 className="text-[16px] font-black text-[#0F172A] mb-5">Hoạt động gần đây</h4>
              <div className="space-y-5">
                <div className="flex gap-4 group">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">Bạn đã cập nhật lĩnh vực hoạt động</p>
                    <p className="text-[12px] font-medium text-[#64748B] mt-1">5 phút trước</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">Hồ sơ được xác thực thành công</p>
                    <p className="text-[12px] font-medium text-[#64748B] mt-1">Hôm qua, 09:15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCompanyPage;
