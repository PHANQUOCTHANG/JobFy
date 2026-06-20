import React from "react";
import { useNavigate } from "react-router-dom";
import { EMPLOYER_PATHS } from "@/config/paths";

const ManageApplicationsPage = () => {
  const navigate = useNavigate();

  const goToCandidate = (id: string) => {
    navigate(`/employer/${EMPLOYER_PATHS.CANDIDATE_DETAIL(id)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row p-6 md:p-8 gap-6">
      <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6 hidden lg:flex">
        <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-black text-[#0F172A]">Bộ lọc nâng cao</h3>
            <button className="text-[#00307c] text-[12px] font-bold hover:underline">Xoá tất cả</button>
          </div>
          
          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Lĩnh vực</p>
            <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] p-2.5 focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all">
              <option>Công nghệ thông tin</option>
              <option>Tài chính - Ngân hàng</option>
              <option>Marketing - Quảng cáo</option>
              <option>Sản xuất & Vận tải</option>
            </select>
          </div>
          
          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Kinh nghiệm</p>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]" />
                <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">Dưới 1 năm</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]" />
                <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">1 - 3 năm</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]" />
                <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">3 - 5 năm</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#00307c] focus:ring-[#00307c]" />
                <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#00307c] transition-colors">Trên 5 năm</span>
              </label>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Học vấn</p>
            <select className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] p-2.5 focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all">
              <option>Tất cả trình độ</option>
              <option>Cử nhân</option>
              <option>Thạc sĩ</option>
              <option>Tiến sĩ</option>
            </select>
          </div>

          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Kỹ năng phổ biến</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] cursor-pointer transition-colors">ReactJS</span>
              <span className="bg-blue-50 text-[#00307c] px-2.5 py-1 rounded-md text-[12px] font-bold border border-blue-200 cursor-pointer transition-colors">TypeScript</span>
              <span className="bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] cursor-pointer transition-colors">Node.js</span>
              <span className="bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] cursor-pointer transition-colors">UI/UX</span>
              <span className="bg-[#F1F5F9] text-[#475569] px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#E2E8F0] hover:bg-[#E2E8F0] cursor-pointer transition-colors">Cloud</span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Khu vực</p>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#94A3B8]">location_on</span>
              <input type="text" defaultValue="TP. Hồ Chí Minh" className="w-full pl-9 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] p-2.5 focus:ring-2 focus:ring-[#00307c]/20 outline-none transition-all" />
            </div>
          </div>

          <div>
            <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Mức lương mong đợi</p>
            <input type="range" className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#00307c]" />
            <div className="flex justify-between mt-2 text-[11px] font-bold text-[#94A3B8]">
              <span>10 Triệu</span>
              <span>50 Triệu+</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Danh sách ứng viên</h2>
            <span className="bg-blue-50 text-[#00307c] px-3 py-1.5 rounded-full text-[12px] font-black border border-blue-100 shadow-sm">1,284 Ứng viên</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 border-2 border-[#E2E8F0] bg-white px-3 py-1.5 rounded-xl text-[13px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">sort</span>
              Mới nhất
            </button>
            <button className="flex items-center gap-1.5 border-2 border-[#E2E8F0] bg-white px-3 py-1.5 rounded-xl text-[13px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Xuất báo cáo
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 pb-8">
          
          <div className="bg-white border border-[#F1F5F9] rounded-3xl p-5 flex items-start gap-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#00307c] to-[#0052cc] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>

            <div className="relative flex-shrink-0 ml-1">
              <img alt="Ứng viên" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG62JALkRRMqyuLQlrYoA7gRB8fnoSjI8EssdJBuVBdHopHenZ5Kmv7W6kB_kTiVZabG2RV0mOEe4FQm3pZe3pM0ucUIYOk0zUM46R4NEaFzbkSuRA_jvpWVTC7tsB-jFoO_OZgsWsfRGlFoY2_ZmqzBzgUjpFeYV4PT6y7Cidov2eM6DUBMtGpFudnZS1wQnDeaPBK8aLCktdDEU54vJxojGdaY7PzqX18QxZurTDRBG0p0LV33D6vibcOPCmTK0WiG2rpH4-RWE" />
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-[16px] font-black text-[#0F172A] group-hover:text-[#00307c] transition-colors cursor-pointer">Nguyễn Thị Thu Thảo</h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 flex-shrink-0">Rút gọn</span>
                <span className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-[13px]">history</span> 2 ngày trước
                </span>
              </div>
              <p className="text-[13px] font-bold text-[#475569] mb-3">Lập trình viên Frontend cấp cao</p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[14px]">work</span> 4.5 năm
                </span>
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[14px]">payments</span> 30–40Tr
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 opacity-20 blur-sm rounded-full"></div>
                    <div className="relative w-10 h-10 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center shadow-sm">
                      <span className="text-emerald-600 font-black text-[12px]">96%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider leading-none mb-0.5">Điểm AI</p>
                    <p className="text-[11px] font-black text-emerald-600">Rất cao</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-[#00307c] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">ReactJS</span>
                  <span className="text-[11px] font-bold text-[#00307c] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Next.js</span>
                  <span className="text-[11px] font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">AWS +2</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#00307c] rounded-lg transition-all border border-[#E2E8F0]" title="Xem CV">
                    <span className="material-symbols-outlined text-[18px]">contact_page</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#00307c] rounded-lg transition-all border border-[#E2E8F0]" title="Ghi chú">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold text-[#475569] bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl transition-all">Từ chối</button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold bg-gradient-to-r from-[#00307c] to-[#0047b3] text-white rounded-xl shadow-[0_4px_12px_-4px_rgba(0,48,124,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(0,48,124,0.5)] hover:-translate-y-0.5 transition-all">Hẹn phỏng vấn</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#F1F5F9] rounded-3xl p-5 flex items-start gap-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-slate-400 to-slate-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>

            <div className="relative flex-shrink-0 ml-1">
              <img alt="Ứng viên" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsEIFi8UYqNRO0Apk1mdyZQ9OcSyuzMFPGOj9cVyVdi2SWmdpnr_2tL_rN-J2AHfS3-35xErfUhqblhdLBrleed8Cgon-6HHuTOPn_gZGElIFANWT0kHvfYOIl6hf2d4-4TWbppUjM44AJVV1wxpAG7X7qkyi2y-fcSGlE59lTMyAZYF6bAq9FugDJJt4OxydiyJlxKU5YecPRLmmu00cuY_ySfmU4IVbRd1mbaQswohfAC1bZqnpPsC5qHEGLymgu47I6emCVOzI" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-[16px] font-black text-[#0F172A] group-hover:text-[#00307c] transition-colors cursor-pointer">Trần Minh Hoàng</h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">Đã xem</span>
                <span className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-[13px]">history</span> 5 giờ trước
                </span>
              </div>
              <p className="text-[13px] font-bold text-[#475569] mb-3">Kỹ sư Fullstack</p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[14px]">work</span> 2 năm
                </span>
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[14px]">payments</span> 15–25Tr
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-10 h-10 rounded-full border-4 border-blue-400 bg-white flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 font-black text-[12px]">82%</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider leading-none mb-0.5">Điểm AI</p>
                    <p className="text-[11px] font-black text-blue-600">Khá tốt</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-[#00307c] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Python</span>
                  <span className="text-[11px] font-bold text-[#00307c] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Vue.js</span>
                  <span className="text-[11px] font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">Go +1</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#00307c] rounded-lg transition-all border border-[#E2E8F0]" title="Xem CV">
                    <span className="material-symbols-outlined text-[18px]">contact_page</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#00307c] rounded-lg transition-all border border-[#E2E8F0]" title="Ghi chú">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#E2E8F0] rounded-xl transition-all">Lưu hồ sơ</button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold bg-[#00307c] text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">Xem chi tiết</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50/60 to-white border-2 border-emerald-100 rounded-3xl p-5 flex items-start gap-5 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_40px_-12px_rgba(16,185,129,0.2)] transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>

            <div className="relative flex-shrink-0 ml-1">
              <img alt="Ứng viên" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv7KJdrdC0SskDYmr5NW0ovLqvIBQb1pQeB2XGvh7G0YxlvTR965qSolvZsC5Qes5G6AwHWSwIdwRDySt6dmxGvnXha8JPS8-c5XJT3sNtoTllrJBLxVW9ALcZ6urGRvDUaFIhLfumEUBLsRgMRS5zdJVVNAPRIAqLWo99XxKsISqEC_6veL5GlxuSTO5U85ehjm1QIFpfF7v8m4WCRlAkEQVppaYxc9Spw1J9gXSEo7u1qA_dU3WGupfMwisKdfKMrZVcbzOzWY0" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-[16px] font-black text-[#0F172A] group-hover:text-emerald-700 transition-colors cursor-pointer">Lê Phương Anh</h4>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] flex-shrink-0"></span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">Mới nhận</span>
                <span className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-[13px]">history</span> 10 phút trước
                </span>
              </div>
              <p className="text-[13px] font-bold text-[#475569] mb-3">Giám đốc Marketing</p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">work</span> 12 năm
                </span>
                <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">payments</span> 40–60Tr
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 opacity-30 blur-sm rounded-full"></div>
                    <div className="relative w-10 h-10 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                      <span className="text-emerald-700 font-black text-[12px]">91%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-wider leading-none mb-0.5">Điểm AI</p>
                    <p className="text-[11px] font-black text-emerald-700">Tuyệt vời</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-sm">Branding</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-sm">Strategy</span>
                  <span className="text-[11px] font-bold text-[#64748B] bg-white px-2 py-1 rounded-md border border-emerald-100 shadow-sm">+5</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => goToCandidate("CAN-9923")} className="w-8 h-8 flex items-center justify-center text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-all shadow-sm" title="Xem CV">
                    <span className="material-symbols-outlined text-[18px]">contact_page</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-all shadow-sm" title="Ghi chú">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold text-rose-600 bg-white border-2 border-rose-100 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition-all">Từ chối</button>
                  <button className="px-3.5 py-1.5 text-[12px] font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-[0_4px_12px_-4px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all">Xem hồ sơ</button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-12 flex flex-col items-center justify-center text-[#94A3B8]">
            <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[24px] animate-spin">sync</span>
            </div>
            <p className="text-[14px] font-bold">Đang tải thêm ứng viên...</p>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-72 flex-shrink-0 flex-col gap-6 hidden xl:flex">
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 p-5 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.05)] flex flex-col group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
              <h3 className="text-[14px] font-black uppercase tracking-wider">Gợi ý từ AI</h3>
            </div>
            <p className="text-[13px] font-medium text-[#64748B] leading-relaxed mb-4">
              Dựa trên phân tích 3,400+ hồ sơ, đây là các tiêu chí quan trọng nhất cho vị trí <strong className="text-[#0F172A] font-bold">Frontend Cấp cao</strong> tháng này.
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                  <span className="text-[#0F172A]">Kỹ năng Next.js</span>
                  <span className="text-emerald-600">+25% Phù hợp</span>
                </div>
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                  <div className="bg-emerald-500 w-[85%] h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
                  <span className="text-[#0F172A]">Kinh nghiệm Fintech</span>
                  <span className="text-emerald-600">+18% Phù hợp</span>
                </div>
                <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
                  <div className="bg-emerald-500 w-[60%] h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2.5 bg-white border-2 border-indigo-100 text-indigo-700 text-[13px] font-bold rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm">
              Điều chỉnh thuật toán
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#F1F5F9] rounded-2xl p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
          <h3 className="text-[16px] font-black text-[#0F172A] mb-4">Hành động nhanh</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">mail</span>
              Gửi thư mời hàng loạt
            </button>
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">history</span>
              Lịch sử tuyển dụng
            </button>
            <button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-bold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#00307c] transition-colors border border-transparent hover:border-[#E2E8F0]">
              <span className="material-symbols-outlined text-[#00307c] text-[20px]">analytics</span>
              Báo cáo tỉ lệ chuyển đổi
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ManageApplicationsPage;
