import React, { useState } from 'react';
import { useMyApplications } from '@/features/applications';
import { JobApplication } from '@/features/applications/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { JobMatchBadge } from '@/features/ai/components/JobMatchBadge';
import { useAppSelector } from '@/store/hooks';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { MessageSquare, Megaphone, CheckCircle2, Clock, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApplicationStatusBadge } from '@/features/applications/components/ApplicationStatusBadge';

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Tiếp nhận' },
  { id: 'reviewing', label: 'Đã xem' },
  { id: 'shortlisted', label: 'Duyệt hồ sơ' },
  { id: 'interviewed', label: 'Cân nhắc' },
  { id: 'accepted', label: 'Phù hợp' },
  { id: 'rejected', label: 'Chưa phù hợp' },
];



export const MyApplicationsPage: React.FC = () => {
  const { data: applications = [], isLoading } = useMyApplications();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('all');

  const filteredApps = activeTab === 'all' 
    ? applications 
    : applications.filter(app => {
        if (activeTab === 'accepted') {
          return app.status === 'accepted' || app.status === 'offered';
        }
        return app.status === activeTab;
      });

  return (
    <div className="bg-[#f4f5f5] min-h-[calc(100vh-64px)] py-8 font-sans">
      <div className="container mx-auto px-4 max-w-[1100px] flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="flex-1 bg-transparent flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h1 className="text-[20px] font-bold text-[#212f3f] mb-5">Việc làm đã ứng tuyển</h1>
            
            {/* Alert Banner */}
            {/* <div className="border border-emerald-400 bg-[#f0fdf4] rounded-xl p-4 flex gap-4 items-center mb-6 relative overflow-hidden">
              <div className="flex-1 z-10">
                <p className="text-[#212f3f] text-[13.5px] leading-relaxed">
                  Bạn có thể nhấn nút <strong className="font-bold">"Nhắc NTD"</strong> nếu đã quá 7 ngày từ lúc ứng tuyển mà vẫn chưa được NTD phản hồi. JobFy sẽ thay bạn gửi một lời nhắn chuyên nghiệp tới NTD.
                  <br />
                  Tìm nút "Nhắc NTD" tại từng lượt ứng tuyển bên dưới.
                </p>
              </div>
              <div className="w-[100px] h-full absolute right-0 top-0 hidden sm:flex items-center justify-center pointer-events-none">
                 <div className="absolute right-[-20px] top-[-20px] bg-emerald-100 w-[120px] h-[120px] rounded-full blur-2xl opacity-60"></div>
              </div>
            </div> */}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-[13px] transition-colors border ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#00b14f] border-[#00b14f] font-semibold' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Application List */}
            {isLoading ? (
              <div className="py-10 text-center text-slate-500">Đang tải dữ liệu...</div>
            ) : filteredApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-12 pb-10">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileTextIcon className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-600 text-lg font-medium mb-2">Bạn chưa có đơn ứng tuyển nào ở trạng thái này</h3>
                <p className="text-slate-500 text-[14px] mb-6 text-center max-w-[400px]">Hãy tiếp tục tìm kiếm những cơ hội nghề nghiệp phù hợp với bạn và ứng tuyển nhé!</p>
                <Link to="/jobs">
                  <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 h-10 rounded-full font-medium shadow-sm hover:-translate-y-0.5 transition-all">
                    Tìm việc ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredApps.map((app) => (
                  <div key={app.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Logo */}
                      <div className="w-[100px] h-[100px] rounded-xl border border-slate-200 flex items-center justify-center p-2 bg-white flex-shrink-0">
                        <img 
                          src={app.job?.company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.job?.company?.name || 'C')}&background=f1f5f9`} 
                          alt={app.job?.company?.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link to={`/jobs/${app.job?.id}`} className="text-[16px] font-bold text-[#212f3f] hover:text-[#00b14f] transition-colors truncate block mb-1">
                            {app.job?.title || "Tên công việc"}
                          </Link>
                          <p className="text-slate-500 text-[14px] mb-2 truncate">{app.job?.company?.name || "Tên công ty"}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px] text-[#4b5563] mb-3">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-[14px] h-[14px]" />
                              Ứng tuyển: {format(new Date(app.appliedAt), 'dd-MM-yyyy HH:mm')}
                            </div>
                            <span className="text-slate-200">|</span>
                            <div className="flex items-center gap-1.5">
                              <FileTextIcon className="w-[14px] h-[14px]" />
                              <a href="#" className="text-[#212f3f] underline hover:text-[#00b14f]">
                                CV ứng tuyển
                              </a>
                            </div>
                          </div>

                          <div className="mb-3">
                            <JobMatchBadge 
                              resumeId={app.resumeId} 
                              jobId={app.jobId} 
                              language="vi" 
                            />
                          </div>
                        </div>

                        {/* Status Update & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-slate-100 pt-3">
                          <div className="flex flex-col gap-1 flex-1 pr-4">
                            <p className="text-[14px] text-[#0073e6] leading-relaxed">
                              JobFy đã nhắc NTD xem và phản hồi CV của bạn
                              <br />
                              <span className="text-[#6b7280]">({format(new Date(app.updatedAt), 'dd-MM-yyyy')})</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0 pb-1">
                            <Button variant="outline" size="sm" className="text-[#00b14f] border-[#00b14f] hover:bg-[#e5f7ed] hover:text-[#00b14f] h-[32px] px-3 font-semibold rounded-full bg-white text-[13px]">
                              <Megaphone className="w-[14px] h-[14px] mr-1.5" />
                              Nhắc NTD
                            </Button>
                            <Button variant="outline" size="sm" className="text-[#4b5563] h-[32px] px-3 font-semibold rounded-full border-[#e5e7eb] hover:bg-slate-50 text-[13px]">
                              <MessageSquare className="w-[14px] h-[14px] mr-1.5" />
                              Nhắn tin
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-5 flex-shrink-0">
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
      </div>
    </div>
  );
};

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export default MyApplicationsPage;
