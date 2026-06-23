import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, FileSearch, Sparkles, ArrowRight, CheckCircle2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmployerLandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header riêng cho trang Landing của nhà tuyển dụng */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-[34px] h-[34px] bg-[#4F46E5] rounded-[10px] flex items-center justify-center shadow-md shadow-[#4F46E5]/20">
                <Briefcase size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[20px] font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Job<span className="text-[#F59E0B]">Fy</span>
              </span>
            </Link>
            <span className="text-slate-500 font-medium text-sm hidden md:block">
              Giải pháp tuyển dụng toàn diện
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/employer/login">
              <Button variant="ghost" className="font-semibold text-slate-700 hover:text-[#4F46E5] hover:bg-slate-100">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/employer/register">
              <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-full px-6 shadow-sm">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#EEF2FF] to-white pt-20 pb-16 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4F46E5]/10 text-[#4F46E5] rounded-full text-sm font-semibold mb-6">
                <Sparkles size={16} />
                <span className="tracking-wide">Tuyển dụng thông minh với AI</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-6">
                Tìm kiếm nhân tài <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#ec4899]">
                  đúng lúc, đúng người
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Nền tảng Jobfy giúp doanh nghiệp của bạn kết nối với hàng triệu ứng viên chất lượng thông qua công nghệ trí tuệ nhân tạo tiên tiến, tiết kiệm tối đa thời gian và chi phí tuyển dụng.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/employer/register">
                  <Button className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white h-14 px-8 rounded-full font-bold text-lg shadow-lg shadow-[#4F46E5]/25 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    Bắt đầu ngay <ArrowRight size={20} />
                  </Button>
                </Link>
                <p className="text-slate-500 text-sm mt-2 sm:mt-0 font-medium">Hoàn toàn miễn phí đăng ký</p>
              </div>
            </div>
            
            {/* Hero Graphic / Illustration */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#4F46E5]/20 to-[#ec4899]/20 rounded-full blur-3xl opacity-60"></div>
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="space-y-4">
                  {/* Mock UI Elements */}
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">10,000+ Ứng viên mới</h4>
                      <p className="text-sm text-slate-500">Cập nhật mỗi ngày</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                      <FileSearch size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Gợi ý AI thông minh</h4>
                      <p className="text-sm text-slate-500">Phù hợp 95% yêu cầu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Quản lý chuyên nghiệp</h4>
                      <p className="text-sm text-slate-500">Hệ thống ATS tích hợp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#4F46E5] mb-1">5M+</div>
              <div className="text-slate-600 font-medium">Lượt truy cập/tháng</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#4F46E5] mb-1">2M+</div>
              <div className="text-slate-600 font-medium">Hồ sơ ứng viên</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#4F46E5] mb-1">50K+</div>
              <div className="text-slate-600 font-medium">Nhà tuyển dụng</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#4F46E5] mb-1">100K+</div>
              <div className="text-slate-600 font-medium">Việc làm đang tuyển</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tại sao chọn Jobfy?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Chúng tôi cung cấp các công cụ và dịch vụ tốt nhất để giúp doanh nghiệp của bạn tối ưu hóa quy trình tuyển dụng.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Nguồn ứng viên đa dạng</h3>
              <p className="text-slate-600 leading-relaxed">Tiếp cận hàng triệu ứng viên tài năng ở mọi lĩnh vực và cấp bậc trên toàn quốc.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Công nghệ AI Matching</h3>
              <p className="text-slate-600 leading-relaxed">Tự động phân tích và đề xuất những ứng viên phù hợp nhất với yêu cầu công việc của bạn.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Quản lý hiệu quả</h3>
              <p className="text-slate-600 leading-relaxed">Hệ thống quản lý quy trình tuyển dụng ATS chuyên nghiệp, dễ sử dụng giúp tiết kiệm thời gian.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-[800px] mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Sẵn sàng xây dựng đội ngũ vững mạnh?</h2>
          <p className="text-lg text-slate-600 mb-8">Tạo tài khoản nhà tuyển dụng miễn phí ngay hôm nay và trải nghiệm dịch vụ của chúng tôi.</p>
          <Link to="/employer/register">
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA] text-white h-14 px-10 rounded-full font-bold text-lg shadow-lg">
              Đăng ký tài khoản Nhà Tuyển Dụng
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4">
          <p>© {new Date().getFullYear()} Jobfy - Nền tảng Tuyển dụng thông minh. Mọi quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};
