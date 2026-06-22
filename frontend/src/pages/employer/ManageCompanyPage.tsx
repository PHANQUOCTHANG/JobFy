/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-unsafe-finally */
import React from "react";
import { ManageCompanyForm } from "@/features/companies/components/ManageCompanyForm";
import { useMyCompany } from "@/features/companies/hooks/useManageCompany";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ManageCompanyPage = () => {
  const { data: company, isLoading, error } = useMyCompany();

  // Tính toán tỷ lệ hoàn thiện hồ sơ thực tế
  const calculateCompletion = () => {
    if (!company) return 0;
    // Các trường quan trọng để đánh giá mức độ hoàn thiện cho BƯỚC 2 (không bao gồm taxCode)
    const fields = ['name', 'industryId', 'provinceId', 'districtId', 'address', 'size', 'website', 'description', 'logoUrl'];
    const completedFields = fields.filter(field => !!(company as any)[field]);
    // Mỗi field đóng góp một phần, cộng thêm điểm nếu đã xác thực
    const baseScore = Math.round((completedFields.length / fields.length) * 80); // 80% từ các trường dữ liệu
    const verifiedBonus = company.isVerified ? 20 : 0; // 20% nếu đã xác thực
    return Math.min(baseScore + verifiedBonus, 100); // Đảm bảo không vượt quá 100%
  };

  const completionRate = calculateCompletion();

  // Xác định nhãn trạng thái dựa trên dữ liệu thực tế từ BE
  const getVerificationStatus = () => {
    if (company?.isVerified) return { label: "ĐÃ XÁC THỰC", class: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (company?.taxCode) return { label: "ĐANG CHỜ DUYỆT", class: "bg-blue-50 text-blue-700 border-blue-200" };
    return { label: "CHƯA XÁC THỰC", class: "bg-amber-50 text-amber-700 border-amber-200" };
  };

  const status = getVerificationStatus();
  // Format ngày cập nhật cuối cùng
  const lastUpdated = company?.updatedAt ? format(new Date(company.updatedAt), "HH:mm, dd/MM/yyyy") : "Chưa có dữ liệu";

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
          <Link 
            to={company?.slug ? `/companies/${company.slug}` : "#"} 
            target="_blank"
            className="px-5 py-2.5 border-2 border-[#E2E8F0] rounded-xl text-[#475569] font-bold hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm"
          >
            Xem bản xem trước
          </Link>
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
            {!company && !isLoading && (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 mt-0.5">info</span>
                <div>
                  <p className="font-bold text-[14px]">Chưa có thông tin công ty</p>
                  <p className="text-[13px] font-medium mt-0.5">Hãy điền thông tin bên dưới để bắt đầu xây dựng thương hiệu tuyển dụng.</p>
                </div>
              </div>
            )}
            <ManageCompanyForm initialData={company} isVerified={company?.isVerified} />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-[#F1F5F9] rounded-3xl p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-[16px] font-black text-[#0F172A]">Trạng thái xác thực</h4>
                  <p className="text-[13px] font-medium text-[#64748B] mt-1">Nâng cao uy tín thương hiệu</p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${status.class}`}>
                  {status.label}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className={`material-symbols-outlined text-[24px] ${company?.taxCode ? "text-blue-600" : "text-slate-400"}`}>
                    {company?.taxCode ? "verified" : "pending"}
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#0F172A]">Giấy phép kinh doanh</p>
                    <p className="text-[12px] font-medium text-[#64748B]">
                      {company?.taxCode ? `MST: ${company.taxCode}` : "Chưa cập nhật mã số thuế"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className={`material-symbols-outlined text-[24px] ${company?.address ? "text-blue-600" : "text-slate-400"}`}>
                    domain_verification
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#0F172A]">Địa chỉ văn phòng</p>
                    <p className="text-[12px] font-medium text-[#64748B]">
                      {company?.address ? "Đã xác thực vị trí" : "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
                <p className="text-[13px] font-medium text-[#64748B] mb-4">
                  Hồ sơ xác thực giúp bạn nổi bật hơn trong mắt các ứng viên tiềm năng nhất.
                </p>
                <Link to="/employer/settings">
                  <button className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    {company?.isVerified ? "Xem chứng chỉ Platinum" : "Hoàn tất xác thực ngay"}
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00307c] to-[#0052cc] text-white rounded-3xl p-8 relative overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,48,124,0.5)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[16px] font-black">Hoàn thiện hồ sơ</h4>
                  <span className="text-3xl font-black tracking-tight">{completionRate}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all duration-1000" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className={`material-symbols-outlined text-[18px] ${company?.name && company?.address ? 'text-emerald-400' : 'text-white/30'}`}>
                      {company?.name && company?.address ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={`font-semibold ${company?.name && company?.address ? 'text-white/90' : 'text-white/50'}`}>Thông tin cơ bản & Địa chỉ</span>
                  </li>
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className={`material-symbols-outlined text-[18px] ${company?.taxCode ? 'text-emerald-400' : 'text-white/30'}`}>
                      {company?.taxCode ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={`font-semibold ${company?.taxCode ? 'text-white/90' : 'text-white/50'}`}>Xác thực pháp lý</span>
                  </li>
                  <li className="flex items-center gap-3 text-[14px]">
                    <span className={`material-symbols-outlined text-[18px] ${company?.isVerified ? 'text-emerald-400' : 'text-white/30'}`}>
                      {company?.isVerified ? 'verified' : 'pending'}
                    </span>
                    <span className={`font-semibold ${company?.isVerified ? 'text-white/90' : 'text-white/50'}`}>Huy hiệu uy tín</span>
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
                    <p className="text-[14px] font-bold text-[#0F172A]">Cập nhật hồ sơ gần nhất</p>
                    <p className="text-[12px] font-medium text-[#64748B] mt-1">{lastUpdated}</p>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform ${company?.isVerified ? 'bg-emerald-500' : 'bg-[#CBD5E1]'}`}></div>
                  <div>
                    <p className="text-[14px] font-bold text-[#0F172A]">{company?.isVerified ? 'Hồ sơ đã được xác thực Platinum' : 'Đang chờ xác minh pháp lý'}</p>
                    <p className="text-[12px] font-medium text-[#64748B] mt-1">{company?.isVerified ? 'Tài khoản Platinum hoạt động' : 'Đang trong quy trình kiểm duyệt'}</p>
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
