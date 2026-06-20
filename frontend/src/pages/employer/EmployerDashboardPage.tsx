import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/features/employer/hooks/useDashboardStats";
import api from "@/lib/axios";
import { toast } from "sonner";

const EmployerDashboardPage = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const { data, isLoading } = useDashboardStats(timeRange);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await api.get("/employer/dashboard/export", {
        params: { range: timeRange },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from header if possible, else fallback
      const contentDisposition = response.headers['content-disposition'];
      let filename = `bao-cao-tuyen-dung-${Date.now()}.csv`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Đã xuất báo cáo thành công");
    } catch (error) {
      toast.error("Không thể tải báo cáo, vui lòng thử lại");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    
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
  }, [isLoading]);

  // Derived calculations from data
  const overview = data?.overview || { totalApplications: 0, totalJobs: 0, activeJobs: 0, totalViews: 0 };
  const pipeline = data?.pipeline || [];
  
  const getCount = (statuses: string[]) => 
    pipeline.filter(p => statuses.includes(p.status)).reduce((sum, p) => sum + p.count, 0);

  const totalApps = overview.totalApplications;
  
  const funnelSteps = [
    { label: "Ứng tuyển", count: getCount(['pending', 'reviewing']) },
    { label: "Sơ loại hồ sơ", count: getCount(['shortlisted']) },
    { label: "Phỏng vấn", count: getCount(['interviewed']) },
    { label: "Mời làm việc", count: getCount(['offered']) },
    { label: "Tuyển thành công", count: getCount(['accepted']) },
  ];

  const maxCount = Math.max(funnelSteps[0].count, 1); // Avoid division by zero
  
  const mappedFunnel = funnelSteps.map((step, idx) => {
    let width = Math.max((step.count / maxCount) * 100, 30); // Minimum width for visibility
    let rate = idx === 0 ? null : (funnelSteps[idx-1].count > 0 ? Math.round((step.count / funnelSteps[idx-1].count) * 100) + "%" : "0%");
    
    // Fallback backgrounds
    const bgs = ["bg-[#00307c]", "bg-blue-700", "bg-blue-600", "bg-blue-500", "bg-emerald-500"];
    
    return {
      label: step.label,
      count: step.count.toString(),
      width: `${width}%`,
      bg: bgs[idx],
      ml: `${idx * 5}%`,
      rate: rate
    };
  });

  const conversionRate = totalApps > 0 ? ((getCount(['accepted']) / totalApps) * 100).toFixed(1) : "0.0";
  const interviewSuccessRate = getCount(['interviewed']) > 0 ? ((getCount(['accepted']) / getCount(['interviewed'])) * 100).toFixed(1) : "0.0";

  const recentJobs = data?.recentJobs || [];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-10 flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00307c]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 lg:p-10 max-w-container_max_width mx-auto w-full space-y-10 flex-1">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
              Tổng quan Hiệu suất
            </h2>
            <p className="text-[#64748B] text-[15px] font-medium">
              Dữ liệu thống kê mới nhất
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full appearance-none px-3 py-2 pl-9 pr-8 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-lg text-[#475569] text-[14px] hover:text-[#0F172A] transition-all font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00307c] cursor-pointer"
              >
                <option value="all">Toàn thời gian</option>
                <option value="30d">30 ngày qua</option>
                <option value="7d">7 ngày qua</option>
              </select>
              <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">calendar_today</span>
              <span className="material-symbols-outlined text-[18px] absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none">expand_more</span>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 md:flex-none px-4 py-2 bg-[#00307c] text-white rounded-lg flex items-center justify-center gap-1.5 text-[14px] hover:bg-[#002568] hover:shadow-[0_4px_12px_rgba(0,48,124,0.3)] transition-all duration-300 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">file_download</span>
              )}
              {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
            </button>
          </div>
        </header>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total CVs */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,48,124,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-50 text-[#00307c] rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00307c] group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </div>
              </div>
              <p className="text-[#64748B] text-[12px] font-semibold uppercase tracking-wider mb-1">Tổng CV đã nhận</p>
              <p className="text-2xl font-bold text-[#0F172A] tracking-tight">{overview.totalApplications}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-[#00307c] transition-all duration-1000 ease-out" style={{ width: "100%" }} />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </div>
              </div>
              <p className="text-[#64748B] text-[12px] font-semibold uppercase tracking-wider mb-1">Tỉ lệ Chuyển đổi</p>
              <p className="text-2xl font-bold text-[#0F172A] tracking-tight">{conversionRate}%</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${conversionRate}%` }} />
            </div>
          </div>

          {/* Interview Success */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(245,158,11,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px]">task_alt</span>
                </div>
              </div>
              <p className="text-[#64748B] text-[12px] font-semibold uppercase tracking-wider mb-1">Phỏng vấn Đạt</p>
              <p className="text-2xl font-bold text-[#0F172A] tracking-tight">{interviewSuccessRate}%</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${interviewSuccessRate}%` }} />
            </div>
          </div>

          {/* Active Jobs */}
          <div className="interactive-card bg-white p-6 rounded-2xl border border-[#F1F5F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(99,102,241,0.12)] transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8FAFC] opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[18px]">work</span>
                </div>
              </div>
              <p className="text-[#64748B] text-[12px] font-semibold uppercase tracking-wider mb-1">Tin Đang Tuyển / Tổng</p>
              <p className="text-2xl font-bold text-[#0F172A] tracking-tight">{overview.activeJobs} <span className="text-base text-gray-400">/ {overview.totalJobs}</span></p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#F1F5F9]">
              <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${overview.totalJobs > 0 ? (overview.activeJobs / overview.totalJobs) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recruitment Pipeline */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#F1F5F9] p-8 flex flex-col shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Tiến trình Tuyển dụng Tổng thể</h3>
                <p className="text-[#64748B] text-sm mt-1 font-medium">Theo dõi tỉ lệ chuyển đổi qua từng vòng</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-[#F8FAFC] rounded-full transition-colors text-[#64748B]">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {totalApps === 0 ? (
                <div className="py-10 text-center text-gray-500 font-medium bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                  Chưa có dữ liệu ứng tuyển để hiển thị tiến trình.
                </div>
              ) : (
                mappedFunnel.map((step, idx) => (
                  <div key={idx} className="relative flex items-center group/funnel" style={{ marginLeft: step.ml }}>
                    <div 
                      className={`funnel-step h-[68px] ${step.bg} flex items-center justify-between px-8 text-white shadow-md transition-all duration-300 group-hover/funnel:scale-[1.01] cursor-pointer`}
                      style={{ width: step.width }}
                    >
                      <span className="text-[15px] font-bold whitespace-nowrap overflow-hidden">{step.label}</span>
                      <span className="text-xl font-bold tracking-tight ml-2">{step.count}</span>
                    </div>
                    {step.rate && (
                      <span className="absolute -left-12 text-[13px] font-bold text-[#64748B]">
                        {step.rate}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Source Mock - Vẫn giữ tĩnh vì chưa có backend phần này */}
            <div className="bg-white rounded-3xl border border-[#F1F5F9] p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-bold text-[#0F172A] mb-8">Nguồn CV Hàng Đầu</h3>
              {totalApps > 0 ? (
                <div className="space-y-7">
                  {[
                    { label: "Tìm kiếm tự nhiên", percent: "45%", width: "45%", color: "bg-[#0A66C2]" },
                    { label: "Trang Tuyển dụng", percent: "25%", width: "25%", color: "bg-[#1877F2]" },
                    { label: "Giới thiệu (Referral)", percent: "18%", width: "18%", color: "bg-emerald-500" },
                    { label: "Khác", percent: "12%", width: "12%", color: "bg-amber-500" },
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
              ) : (
                 <div className="text-center text-gray-500 text-sm py-4">Chưa có dữ liệu</div>
              )}
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
                  <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    AI Đề xuất
                  </h3>
                </div>
                <div className="text-[15px] text-[#475569] leading-relaxed font-medium">
                  {isLoading || !data?.aiSuggestion ? (
                    <div className="space-y-2 mt-2">
                      <div className="h-4 bg-indigo-100 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-indigo-100 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-indigo-100 rounded animate-pulse w-4/6"></div>
                    </div>
                  ) : (
                    <p>{data.aiSuggestion}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Job Posts Table */}
          <div className="lg:col-span-12 bg-white rounded-3xl border border-[#F1F5F9] overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]">
            <div className="px-8 py-6 border-b border-[#F1F5F9] flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Chiến dịch tuyển dụng gần đây</h3>
                <p className="text-[#64748B] text-sm mt-1 font-medium">Trạng thái các tin tuyển dụng nổi bật</p>
              </div>
              <Link to="/employer/jobs" className="px-4 py-2 text-[14px] font-bold text-[#00307c] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                Xem tất cả
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Vị trí công việc</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Trạng thái</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Lượt xem</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">CV Đã nhận</th>
                    <th className="px-8 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-8 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {recentJobs.length === 0 ? (
                     <tr>
                       <td colSpan={6} className="px-8 py-10 text-center text-gray-500 font-medium">
                         Chưa có tin tuyển dụng nào. Hãy tạo tin đăng đầu tiên của bạn!
                       </td>
                     </tr>
                  ) : (
                    recentJobs.map((job) => {
                      let statusColor = "text-gray-700 bg-gray-50 border-gray-200";
                      let statusText = job.status;
                      if (job.status === "published") { statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200"; statusText = "Đang tuyển"; }
                      else if (job.status === "draft") { statusColor = "text-amber-700 bg-amber-50 border-amber-200"; statusText = "Bản nháp"; }
                      else if (job.status === "closed") { statusColor = "text-red-700 bg-red-50 border-red-200"; statusText = "Đã đóng"; }

                      return (
                        <tr key={job.id} className="hover:bg-[#F8FAFC] transition-colors group/row cursor-pointer">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-blue-600 bg-blue-50">
                                <span className="material-symbols-outlined">work</span>
                              </div>
                              <div>
                                <p className="text-[15px] font-bold text-[#0F172A] group-hover/row:text-[#00307c] transition-colors">{job.title}</p>
                                <p className="text-[13px] text-[#64748B] font-medium mt-0.5 capitalize">{job.jobType.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1.5 text-[12px] font-bold rounded-lg border ${statusColor}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-[15px] font-bold text-[#475569]">{job.viewCount}</td>
                          <td className="px-8 py-5 text-[15px] font-bold text-[#0F172A]">{job._count?.applications || 0}</td>
                          <td className="px-8 py-5 text-[13px] font-bold text-[#475569]">
                            {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-white hover:shadow-md transition-all text-[#64748B] hover:text-[#00307c]">
                              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
