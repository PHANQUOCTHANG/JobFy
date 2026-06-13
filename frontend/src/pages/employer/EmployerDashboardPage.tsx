import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const EmployerDashboardPage = () => {
  useEffect(() => {
    // Advanced micro-interaction for cards
    const cards = Array.from(document.querySelectorAll(".interactive-card"));
    
    const mouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const el = mouseEvent.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);
    };

    const down = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "scale(0.98)";
    };
    const up = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = "scale(1)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", mouseMove);
      card.addEventListener("mousedown", down);
      card.addEventListener("mouseup", up);
      card.addEventListener("mouseleave", up);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", mouseMove);
        card.removeEventListener("mousedown", down);
        card.removeEventListener("mouseup", up);
        card.removeEventListener("mouseleave", up);
      });
    };
  }, []);

  return (
    <>
      <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-10 flex-1">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              Tổng quan Hiệu suất
            </h2>
            <p className="text-[#64748B] text-[15px] font-medium">
              Dữ liệu thống kê từ ngày <span className="text-[#0F172A] font-bold">01/10/2023</span> đến hôm nay
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl flex items-center justify-center gap-2 text-[#475569] hover:text-[#0F172A] transition-all font-bold shadow-sm">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              30 ngày qua
            </button>
            <button className="flex-1 md:flex-none px-5 py-2.5 bg-[#00307c] text-white rounded-xl flex items-center justify-center gap-2 hover:bg-[#002568] hover:shadow-[0_8px_20px_-6px_rgba(0,48,124,0.4)] transition-all duration-300 font-bold">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              Xuất báo cáo
            </button>
          </div>
        </header>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total CVs */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,48,124,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-blue-50 text-[#00307c] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00307c] group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">description</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +12%
                </div>
              </div>
              <p className="text-[#64748B] text-[13px] font-bold uppercase tracking-wider mb-1">Tổng CV đã nhận</p>
              <p className="text-3xl font-black text-[#0F172A] tracking-tight">1,284</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-[#00307c] transition-all duration-1000 ease-out" style={{ width: "70%" }} />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">sync_alt</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +3.5%
                </div>
              </div>
              <p className="text-[#64748B] text-[13px] font-bold uppercase tracking-wider mb-1">Tỉ lệ Chuyển đổi</p>
              <p className="text-3xl font-black text-[#0F172A] tracking-tight">24.8%</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: "24.8%" }} />
            </div>
          </div>

          {/* Interview Success */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">task_alt</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">trending_down</span>
                  -1.2%
                </div>
              </div>
              <p className="text-[#64748B] text-[13px] font-bold uppercase tracking-wider mb-1">Phỏng vấn Đạt</p>
              <p className="text-3xl font-black text-[#0F172A] tracking-tight">18.2%</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: "18.2%" }} />
            </div>
          </div>

          {/* Recruitment Cost */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(99,102,241,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  -5%
                </div>
              </div>
              <p className="text-[#64748B] text-[13px] font-bold uppercase tracking-wider mb-1">Chi phí/Tuyển dụng</p>
              <p className="text-3xl font-black text-[#0F172A] tracking-tight">4.2M</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: "60%" }} />
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recruitment Funnel */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#F1F5F9] p-8 flex flex-col shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Phễu Tuyển Dụng Tổng Thể</h3>
                <p className="text-[#64748B] text-sm mt-1 font-medium">Theo dõi tỉ lệ chuyển đổi qua từng vòng</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-[#F8FAFC] rounded-full transition-colors text-[#64748B]">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {[
                { label: "Ứng tuyển", count: "1,284", width: "100%", bg: "bg-[#00307c]", ml: "0%" },
                { label: "Sơ loại hồ sơ", count: "842", width: "95%", bg: "bg-blue-700", ml: "5%", rate: "65%" },
                { label: "Phỏng vấn", count: "312", width: "90%", bg: "bg-blue-600", ml: "10%", rate: "37%" },
                { label: "Mời làm việc", count: "58", width: "85%", bg: "bg-blue-500", ml: "15%", rate: "18%" },
                { label: "Tuyển thành công", count: "46", width: "80%", bg: "bg-emerald-500", ml: "20%", rate: "79%" },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-center group/funnel" style={{ marginLeft: step.ml }}>
                  <div 
                    className={`funnel-step h-[68px] ${step.bg} flex items-center justify-between px-8 text-white shadow-md transition-all duration-300 group-hover/funnel:scale-[1.01] cursor-pointer`}
                    style={{ width: step.width }}
                  >
                    <span className="text-[15px] font-bold">{step.label}</span>
                    <span className="text-xl font-black tracking-tight">{step.count}</span>
                  </div>
                  {step.rate && (
                    <span className="absolute -left-12 text-[13px] font-black text-[#64748B]">
                      {step.rate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* CVs by Source */}
            <div className="bg-white rounded-3xl border border-[#F1F5F9] p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-black text-[#0F172A] mb-8">Nguồn CV Hàng Đầu</h3>
              <div className="space-y-7">
                {[
                  { label: "LinkedIn", percent: "45%", width: "45%", color: "bg-[#0A66C2]" },
                  { label: "Quảng cáo Facebook", percent: "25%", width: "25%", color: "bg-[#1877F2]" },
                  { label: "Giới thiệu (Referral)", percent: "18%", width: "18%", color: "bg-emerald-500" },
                  { label: "Trang Tuyển dụng", percent: "12%", width: "12%", color: "bg-amber-500" },
                ].map((source, idx) => (
                  <div key={idx} className="space-y-2 group/source">
                    <div className="flex justify-between text-[14px] font-semibold text-[#0F172A]">
                      <span>{source.label}</span>
                      <span className="text-[#64748B]">{source.percent}</span>
                    </div>
                    <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${source.color} rounded-full transition-all duration-1000 ease-out group-hover/source:brightness-110`} 
                        style={{ width: source.width }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl border border-indigo-100 p-8 shadow-[0_8px_30px_-12px_rgba(99,102,241,0.15)] group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      auto_awesome
                    </span>
                  </div>
                  <h3 className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    AI Đề xuất
                  </h3>
                </div>
                <p className="text-[15px] text-[#475569] leading-relaxed font-medium">
                  Nguồn <strong className="text-[#0F172A]">Giới thiệu (Referral)</strong> có tỷ lệ chuyển đổi cao nhất (32%). 
                  Đề xuất tăng 20% mức thưởng nội bộ để tối ưu chi phí tuyển dụng trong quý này.
                </p>
                <button className="mt-5 text-[14px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Xem phân tích chi tiết <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Job Posts Table */}
          <div className="lg:col-span-12 bg-white rounded-3xl border border-[#F1F5F9] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="px-8 py-6 border-b border-[#F1F5F9] flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-black text-[#0F172A]">Chiến dịch đang chạy</h3>
                <p className="text-[#64748B] text-sm mt-1 font-medium">Trạng thái các tin tuyển dụng nổi bật</p>
              </div>
              <button className="px-4 py-2 text-[14px] font-bold text-[#00307c] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                Xem tất cả
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vị trí công việc</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Trạng thái</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Lượt xem</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">CV Đã nhận</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Tiến độ</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {[
                    {
                      title: "Senior Frontend Developer", loc: "Hà Nội • Toàn thời gian", icon: "terminal", iconColor: "text-blue-600 bg-blue-50",
                      status: "Đang tuyển", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                      views: "1,240", cvs: "142",
                      progress: "85%", progressColor: "bg-emerald-500"
                    },
                    {
                      title: "Marketing Manager", loc: "TP. HCM • Toàn thời gian", icon: "campaign", iconColor: "text-purple-600 bg-purple-50",
                      status: "Tạm dừng", statusColor: "text-amber-700 bg-amber-50 border-amber-200",
                      views: "856", cvs: "84",
                      progress: "40%", progressColor: "bg-amber-500"
                    },
                    {
                      title: "UI/UX Designer", loc: "Từ xa • Tự do", icon: "palette", iconColor: "text-pink-600 bg-pink-50",
                      status: "Đang tuyển", statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                      views: "3,120", cvs: "210",
                      progress: "92%", progressColor: "bg-emerald-500"
                    }
                  ].map((job, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors group/row cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${job.iconColor}`}>
                            <span className="material-symbols-outlined">{job.icon}</span>
                          </div>
                          <div>
                            <p className="text-[15px] font-bold text-[#0F172A] group-hover/row:text-[#00307c] transition-colors">{job.title}</p>
                            <p className="text-[13px] text-[#64748B] font-medium mt-0.5">{job.loc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 text-[12px] font-bold rounded-lg border ${job.statusColor}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[15px] font-bold text-[#475569]">{job.views}</td>
                      <td className="px-8 py-5 text-[15px] font-bold text-[#0F172A]">{job.cvs}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full min-w-[100px]">
                            <div className={`h-full ${job.progressColor} rounded-full`} style={{ width: job.progress }} />
                          </div>
                          <span className="text-[13px] font-bold text-[#475569]">{job.progress}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-white hover:shadow-md transition-all text-[#64748B] hover:text-[#00307c]">
                          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 px-6 md:px-10 bg-transparent flex flex-col md:flex-row justify-between items-center text-[#64748B] text-[13px] font-medium gap-4">
        <p>© 2024 JobFy Enterprise. All rights reserved.</p>
        <div className="flex gap-6">
          <Link className="hover:text-[#0F172A] transition-colors" to="#">Điều khoản dịch vụ</Link>
          <Link className="hover:text-[#0F172A] transition-colors" to="#">Chính sách bảo mật</Link>
          <Link className="hover:text-[#0F172A] transition-colors" to="#">Hỗ trợ 24/7</Link>
        </div>
      </footer>

      <style>{`
        .funnel-step { 
          clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%); 
        }
        .funnel-step:first-child { 
          clip-path: polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%); 
        }
        .interactive-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: radial-gradient(
            800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
            rgba(0, 48, 124, 0.06),
            transparent 40%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default EmployerDashboardPage;
