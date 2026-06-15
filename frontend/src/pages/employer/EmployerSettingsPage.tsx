import React from "react";

const EmployerSettingsPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8 animate-fade-in">
      {/* Warning Banner */}
      <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl flex gap-4 items-center border border-rose-200">
        <span className="material-symbols-outlined text-rose-600">warning</span>
        <p className="text-[14px] font-medium">
          Tài khoản của bạn chưa được xác thực. Vui lòng hoàn tất các bước dưới đây để bắt đầu đăng tin tuyển dụng.
        </p>
      </div>

      {/* Verification Sections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#0F172A]">Tiến trình xác thực doanh nghiệp</h2>
          <span className="text-[12px] font-black text-[#64748B] uppercase tracking-wider">HOÀN THÀNH 1/3 BƯỚC</span>
        </div>

        {/* Step 1: Email */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-[#E2E8F0] flex flex-col md:flex-row gap-6 items-start md:items-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-black text-[#0F172A]">Bước 1: Xác thực Email</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-md uppercase tracking-wider border border-emerald-200">ĐÃ XÁC THỰC</span>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">Email <strong className="text-[#0F172A]">contact@enterprise-inc.com</strong> đã được xác nhận quyền sở hữu.</p>
          </div>
          <button className="px-4 py-2 border-2 border-[#E2E8F0] rounded-xl text-[12px] font-black text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-all shrink-0">
            GỬI LẠI MÃ
          </button>
        </div>

        {/* Step 2: Company Info */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-[#E2E8F0] flex flex-col md:flex-row gap-6 items-start md:items-center shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#00307c] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">info</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-black text-[#0F172A]">Bước 2: Cập nhật thông tin công ty</h3>
              <span className="px-2 py-0.5 bg-[#F1F5F9] text-[#00307c] text-[10px] font-black rounded-md uppercase tracking-wider border border-[#E2E8F0]">CẦN CẬP NHẬT</span>
            </div>
            <p className="text-[13px] font-medium text-[#64748B]">Cung cấp thông tin cơ bản về doanh nghiệp, địa chỉ và lĩnh vực hoạt động.</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl text-[12px] font-black hover:shadow-[0_4px_12px_-4px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-2">
            CẬP NHẬT NGAY
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>

        {/* Step 3: Legal Documents */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-[#E2E8F0] space-y-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#94A3B8] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-[#0F172A]">Bước 3: Xác thực giấy đăng ký doanh nghiệp</h3>
                <span className="px-2 py-0.5 bg-[#F8FAFC] text-[#64748B] text-[10px] font-black rounded-md uppercase tracking-wider border border-[#E2E8F0]">CHƯA TẢI LÊN</span>
              </div>
              <p className="text-[13px] font-medium text-[#64748B]">Tải lên bản quét giấy phép kinh doanh hợp lệ (PDF hoặc JPG) để kích hoạt tài khoản tuyển dụng.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">TÊN DOANH NGHIỆP TRÊN GIẤY PHÉP</span>
                <input 
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] placeholder:text-[#94A3B8]" 
                  placeholder="CÔNG TY TNHH JOBFY VIỆT NAM" 
                  type="text" 
                />
              </label>
              <label className="block space-y-2">
                <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">MÃ SỐ THUẾ / SỐ GIẤY PHÉP</span>
                <input 
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl bg-white focus:border-[#00307c] focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all text-[14px] font-medium text-[#0F172A] placeholder:text-[#94A3B8]" 
                  placeholder="0123456789" 
                  type="text" 
                />
              </label>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">HỒ SƠ PHÁP LÝ (PDF, JPG)</span>
              <div className="flex-1 min-h-[140px] border-2 border-dashed border-[#CBD5E1] rounded-xl flex flex-col items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] hover:border-[#00307c]/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#00307c] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-black text-[#0F172A]">Click để tải tệp lên</p>
                  <p className="text-[12px] font-medium text-[#64748B] mt-0.5">Kích thước tối đa: 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
            <span className="material-symbols-outlined text-[#00307c] text-[20px] mt-0.5">info</span>
            <p className="text-[13px] font-medium text-[#475569] leading-relaxed">
              Quy trình xác thực thường mất từ <strong className="text-[#00307c]">12-24 giờ làm việc</strong>. Sau khi gửi, hồ sơ sẽ chuyển sang trạng thái <strong className="text-[#0F172A]">Đang chờ kiểm duyệt</strong>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4 mt-2">
            <button className="px-6 py-3 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white text-[14px] font-black rounded-xl hover:shadow-[0_6px_16px_-4px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Gửi hồ sơ xác thực
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center pb-6">
        <p className="text-[13px] font-medium text-[#94A3B8]">© 2026 JobFy Enterprise. Môi trường tuyển dụng chuyên nghiệp.</p>
      </footer>
    </div>
  );
};

export default EmployerSettingsPage;
