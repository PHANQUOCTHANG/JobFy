import { Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function EmployerCTA() {
  return (
    <section className="relative bg-white text-slate-900 overflow-hidden py-24 px-5 lg:px-10 border-t border-slate-100">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(#1A56DB 1px, transparent 1px), linear-gradient(90deg, #1A56DB 1px, transparent 1px)",
          backgroundSize: "64px 64px" 
        }} 
      />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Content */}
        <Reveal>
          <div className="inline-flex items-center gap-2 text-[#1A56DB] font-bold text-[12px] uppercase tracking-widest mb-8">
            <Building2 size={16} /> DÀNH CHO NHÀ TUYỂN DỤNG
          </div>
          
          <h2 className="text-[3rem] lg:text-[4.5rem] font-black leading-[1.05] mb-8 text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Tìm nhân tài<br />
            xứng tầm<br />
            <span className="text-[#1A56DB]">doanh nghiệp.</span>
          </h2>
          
          <p className="text-slate-600 text-[17px] leading-relaxed mb-10 max-w-lg">
            Tiếp cận 2 triệu+ ứng viên chất lượng cao với bộ lọc AI thông minh. Đăng tin tuyển dụng miễn phí 30 ngày đầu — không cần thẻ tín dụng.
          </p>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              "Không cần thẻ tín dụng", 
              "Miễn phí 30 ngày", 
              "Hỗ trợ 24/7", 
              "2M+ ứng viên"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 text-[14px] font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-[#1A56DB]" /> {text}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right Card */}
        <Reveal delay={150}>
          <div className="bg-[#0F172A] rounded-3xl p-10 lg:p-12 shadow-2xl relative border border-slate-800">
            <h3 className="text-[28px] font-black mb-2 text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Bắt đầu tuyển dụng
            </h3>
            <p className="text-slate-400 text-[14px] mb-8">
              Miễn phí 30 ngày đầu - Không cần thanh toán
            </p>

            <div className="flex flex-col gap-4 mb-12">
              <button className="bg-[#1A56DB] hover:bg-[#1447C0] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all w-full text-[15px] shadow-lg shadow-[#1A56DB]/25">
                Đăng tin tuyển dụng miễn phí <ArrowRight size={18} />
              </button>
              <button className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all w-full text-[15px]">
                Xem bảng giá dịch vụ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              {[
                { val: "2M+", label: "Ứng viên" },
                { val: "3x", label: "Hiệu quả" },
                { val: "48h", label: "Tuyển nhanh" },
                { val: "99%", label: "Hài lòng" }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-[32px] font-black mb-1 text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>{stat.val}</div>
                  <div className="text-[12px] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
