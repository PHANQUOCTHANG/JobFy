import { Briefcase, Facebook, Linkedin, Youtube, Instagram, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111018] text-white pt-20 pb-16 px-5 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
        
        {/* Brand Col */}
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center gap-2 mb-6">
            <div className="w-[36px] h-[36px] bg-[#D44E2B] rounded-xl flex items-center justify-center">
              <Briefcase size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[24px] font-black text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Job<span className="text-[#E8A83A]">Fy</span>
            </span>
          </a>
          <p className="text-[#6B6059] text-[14px] leading-relaxed mb-8 max-w-[280px]">
            Nền tảng kết nối việc làm — nơi mọi sự nghiệp bắt đầu đúng hướng.
          </p>
          <div className="flex items-center gap-3 mb-8">
            {[Facebook, Linkedin, Youtube, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-11 h-11 rounded-full border border-white/20 hover:border-[#D44E2B] hover:text-[#D44E2B] flex items-center justify-center text-[#9B8E7F] transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#D44E2B] font-semibold text-[15px]">
            <Phone size={16} />
            <span>1900 12 3456</span>
          </div>
        </div>

        {/* Links Cols */}
        <div>
          <h4 className="font-bold text-[15px] mb-6">Ứng viên</h4>
          <ul className="space-y-4">
            {["Tìm việc làm", "Tạo CV online", "Cẩm nang nghề nghiệp", "Trắc nghiệm MBTI", "Tính lương NET"].map(link => (
              <li key={link}>
                <a href="#" className="text-[13.5px] text-[#6B6059] hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[15px] mb-6">Nhà tuyển dụng</h4>
          <ul className="space-y-4">
            {["Đăng tin tuyển dụng", "Tìm kiếm ứng viên", "Bảng giá dịch vụ", "Giải pháp HR", "Hỗ trợ doanh nghiệp"].map(link => (
              <li key={link}>
                <a href="#" className="text-[13.5px] text-[#6B6059] hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-[15px] mb-6">Về JobFy</h4>
          <ul className="space-y-4">
            {["Giới thiệu", "Blog & Tin tức", "Tuyển dụng nội bộ", "Liên hệ hợp tác", "Chính sách bảo mật"].map(link => (
              <li key={link}>
                <a href="#" className="text-[13.5px] text-[#6B6059] hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
