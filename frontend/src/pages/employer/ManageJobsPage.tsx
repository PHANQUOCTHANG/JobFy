import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";

const ManageJobsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả (48)");

  const tabs = [
    "Tất cả (48)",
    "Đang hoạt động (12)",
    "Chờ duyệt (4)",
    "Bản nháp (8)",
    "Hết hạn (15)",
    "Đã đóng (9)",
  ];

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-8 flex-1 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight mb-2">
            Quản lý Tuyển dụng
          </h2>
          <p className="text-[#64748B] text-[15px] font-medium">
            Theo dõi và quản lý các vị trí đang tuyển dụng tại doanh nghiệp.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl text-[#475569] hover:text-[#0F172A] transition-all font-bold shadow-sm">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Lọc nâng cao
          </button>
          <button 
            onClick={() => navigate(`/employer/${EMPLOYER_PATHS.CREATE_JOB}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl hover:shadow-[0_8px_20px_-6px_rgba(0,48,124,0.4)] hover:-translate-y-0.5 transition-all duration-300 font-bold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Đăng tin mới
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-bold text-[14px] whitespace-nowrap transition-all duration-300 border-b-2 ${
              activeTab === tab
                ? "border-[#00307c] text-[#00307c]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vị trí</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Địa điểm</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Phòng ban</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Ứng viên</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {/* Row 1 */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#00307c] cursor-pointer transition-colors">
                      Thiết kế UI/UX cấp cao
                    </p>
                    <p className="text-[13px] font-medium text-[#64748B] mt-1">ID: #JOB-8821 • Đăng 2 ngày trước</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">TP. Hồ Chí Minh</td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Thiết kế Sản phẩm</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-[#0F172A]">24</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Ứng tuyển</span>
                    </div>
                    <div className="h-8 w-px bg-[#E2E8F0]"></div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-emerald-600">8</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Tiềm năng</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-bold border border-emerald-200">
                    Đang hoạt động
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-lg transition-all" title="Chỉnh sửa">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Gia hạn">
                      <span className="material-symbols-outlined text-[20px]">event_repeat</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Tạm dừng">
                      <span className="material-symbols-outlined text-[20px]">pause_circle</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#00307c] cursor-pointer transition-colors">
                      Lập trình viên Backend (Java)
                    </p>
                    <p className="text-[13px] font-medium text-[#64748B] mt-1">ID: #JOB-8815 • Đăng 5 ngày trước</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Hà Nội (Từ xa)</td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Kỹ thuật</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-[#0F172A]">12</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Ứng tuyển</span>
                    </div>
                    <div className="h-8 w-px bg-[#E2E8F0]"></div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-emerald-600">3</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Tiềm năng</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[12px] font-bold border border-amber-200">
                    Chờ duyệt
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-[#00307c] hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#00307c] cursor-pointer transition-colors">
                      Nhân sự tổng hợp
                    </p>
                    <p className="text-[13px] font-medium text-[#64748B] mt-1">ID: #JOB-8790 • Đăng 2 tuần trước</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">TP. Hồ Chí Minh</td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Nhân sự</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-[#0F172A]">56</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Ứng tuyển</span>
                    </div>
                    <div className="h-8 w-px bg-[#E2E8F0]"></div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-emerald-600">14</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Tiềm năng</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-[12px] font-bold border border-rose-200">
                    Hết hạn
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 text-[#00307c] bg-blue-50 border border-blue-200 rounded-lg text-[13px] font-bold hover:bg-blue-100 transition-colors">
                      Gia hạn
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Xóa">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-[#F8FAFC] transition-colors group bg-[#F1F5F9]/30">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#00307c] cursor-pointer transition-colors">
                      Quản lý Dự án
                    </p>
                    <p className="text-[13px] font-medium text-[#64748B] mt-1">ID: #JOB-8700 • Đã đóng 1 tháng trước</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Đà Nẵng</td>
                <td className="px-6 py-5 text-[14.5px] font-medium text-[#475569]">Quản lý</td>
                <td className="px-6 py-5 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-[#0F172A]">102</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Ứng tuyển</span>
                    </div>
                    <div className="h-8 w-px bg-[#E2E8F0]"></div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-black text-emerald-600">21</span>
                      <span className="text-[10px] uppercase text-[#64748B] font-bold tracking-wider">Tiềm năng</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 bg-[#E2E8F0] text-[#475569] rounded-lg text-[12px] font-bold border border-[#CBD5E1]">
                    Đã đóng
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 text-[#475569] bg-white border border-[#E2E8F0] rounded-lg text-[13px] font-bold hover:bg-[#F8FAFC] transition-colors shadow-sm">
                      Xem báo cáo
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#F1F5F9] bg-[#F8FAFC]">
          <p className="text-[14px] text-[#64748B] font-medium">
            Hiển thị <span className="font-bold text-[#0F172A]">1-10</span> của <span className="font-bold text-[#0F172A]">48</span> tin tuyển dụng
          </p>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 flex items-center justify-center border-2 border-[#E2E8F0] rounded-lg text-[#94A3B8] disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-[#00307c] text-white rounded-lg text-[14px] font-bold shadow-sm">1</button>
            <button className="w-9 h-9 flex items-center justify-center border-2 border-transparent hover:border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg text-[14px] font-bold transition-all">2</button>
            <button className="w-9 h-9 flex items-center justify-center border-2 border-transparent hover:border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg text-[14px] font-bold transition-all">3</button>
            <span className="px-2 text-[#94A3B8] font-bold">...</span>
            <button className="w-9 h-9 flex items-center justify-center border-2 border-transparent hover:border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg text-[14px] font-bold transition-all">5</button>
            <button className="w-9 h-9 flex items-center justify-center border-2 border-[#E2E8F0] rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Widgets for Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,48,124,0.05)]">
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-[#00307c] mb-2 uppercase tracking-wider">TỶ LỆ CHUYỂN ĐỔI</h3>
            <p className="text-4xl font-black text-[#0F172A] tracking-tight">32.4%</p>
            <p className="text-[14px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              Tăng 4.2% so với tháng trước
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] text-blue-600/5 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
            trending_up
          </span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 rounded-2xl relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(16,185,129,0.05)]">
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-emerald-700 mb-2 uppercase tracking-wider">THỜI GIAN TUYỂN TRUNG BÌNH</h3>
            <p className="text-4xl font-black text-[#0F172A] tracking-tight">18 Ngày</p>
            <p className="text-[14px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Nhanh hơn 3 ngày so với KPI
            </p>
          </div>
          <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-[120px] text-emerald-600/5 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
            timer
          </span>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 p-6 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.05)] flex flex-col justify-between group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="text-[13px] font-bold text-indigo-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              GỢI Ý TỪ AI
            </h3>
            <p className="text-[15px] font-bold text-[#0F172A] leading-relaxed mt-2">
              Vị trí <span className="text-indigo-600">UI/UX Designer</span> đang có 8 ứng viên tiềm năng cao chưa được xem.
            </p>
          </div>
          <button className="mt-4 text-[14px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all relative z-10 w-fit">
            Xem ngay <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageJobsPage;
