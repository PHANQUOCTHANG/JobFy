import { Smartphone, Play, CheckCircle, Briefcase } from "lucide-react";
import { Reveal } from "./Reveal";

export function AppDownload() {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#F4F6FA]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F172A] rounded-[2.5rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between p-10 lg:p-20 shadow-2xl">
          
          {/* Left Content */}
          <div className="lg:w-1/2 relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 border border-[#F59E0B]/30 text-[#F59E0B] text-[12px] font-bold px-3.5 py-1.5 rounded-lg mb-8">
                <Smartphone size={14} /> Ứng dụng di động
              </div>
              <h2 className="text-[3rem] lg:text-[4rem] font-black text-white leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Tìm việc mọi lúc,<br />
                <span className="text-[#F59E0B]">mọi nơi.</span>
              </h2>
              <p className="text-[#64748B] text-[17px] leading-relaxed mb-10 max-w-[400px]">
                Nhận thông báo việc làm realtime, ứng tuyển một chạm và theo dõi tiến trình phỏng vấn ngay trên điện thoại.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 bg-transparent text-white px-6 py-3.5 rounded-2xl transition-all w-full sm:w-auto">
                  <Play size={20} className="fill-white text-white" />
                  <div className="text-left">
                    <p className="text-[10px] text-[#94A3B8]">Tải trên</p>
                    <p className="text-[15px] font-bold">Google Play</p>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 bg-transparent text-white px-6 py-3.5 rounded-2xl transition-all w-full sm:w-auto">
                  <div className="text-left">
                    <p className="text-[10px] text-[#94A3B8]">Tải trên</p>
                    <p className="text-[15px] font-bold">App Store</p>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {["#4F46E5", "#F59E0B", "#10B981", "#7C3AED", "#3B82F6"].map((color, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0F172A] -ml-3 first:ml-0" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div>
                  <div className="flex gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-[#F59E0B] text-xs">★</span>)}
                  </div>
                  <p className="text-[12px] text-[#64748B] font-medium">500K+ lượt tải - 4.9⭐</p>
                </div>
              </div>
            </Reveal>
          </div>
          
          {/* Right Phone Mockup */}
          <div className="lg:w-1/2 mt-16 lg:mt-0 flex justify-center lg:justify-end relative z-10">
            <Reveal delay={150}>
              <div className="relative w-[320px] h-[640px] bg-[#1C1926] rounded-[3rem] border-[8px] border-[#221A2C] shadow-2xl p-6 flex flex-col">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#221A2C] rounded-b-3xl" />
                
                {/* Phone Header */}
                <div className="flex justify-between items-center text-white/40 text-[10px] font-semibold mb-6 mt-2">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span className="w-4 h-2.5 border border-white/40 rounded-sm" />
                  </div>
                </div>

                {/* App UI */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center">
                    <Briefcase size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[16px] font-black text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Job<span className="text-[#F59E0B]">Fy</span>
                  </span>
                </div>

                {/* Search */}
                <div className="bg-transparent border border-white/20 rounded-2xl p-3.5 mb-6 flex items-center gap-2">
                  <span className="text-[#64748B]">🔍</span>
                  <span className="text-[#64748B] text-[13px]">Tìm công việc...</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  <div className="border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0F172A] font-bold text-xs">FPT</div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-[13px]">Senior React Dev</p>
                      <p className="text-[#64748B] text-[11px]">FPT Software</p>
                    </div>
                    <p className="text-[#F59E0B] font-bold text-[12px]">25-40M</p>
                  </div>
                  <div className="border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A94FF] rounded-xl flex items-center justify-center text-white font-bold text-xs">Ti</div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-[13px]">UX Designer</p>
                      <p className="text-[#64748B] text-[11px]">Tiki</p>
                    </div>
                    <p className="text-[#F59E0B] font-bold text-[12px]">18-28M</p>
                  </div>
                  <div className="border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00B14F] rounded-xl flex items-center justify-center text-white font-bold text-xs">Gr</div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-[13px]">Data Analyst</p>
                      <p className="text-[#64748B] text-[11px]">Grab</p>
                    </div>
                    <p className="text-[#F59E0B] font-bold text-[12px]">18-32M</p>
                  </div>
                </div>

                {/* AI Match Card */}
                <div className="mt-auto bg-gradient-to-r from-[#3A2218] to-[#0F172A] border border-[#4F46E5]/30 rounded-2xl p-5">
                  <p className="text-[#F59E0B] font-bold text-[13px] flex items-center gap-1.5 mb-4">
                    ✨ AI Match mới!
                  </p>
                  <div className="h-1.5 bg-black/50 rounded-full mb-3">
                    <div className="h-1.5 bg-[#F59E0B] rounded-full w-[80%]" />
                  </div>
                  <p className="text-[#94A3B8] text-[11px]">80% phù hợp • 12 việc mới</p>
                </div>

                {/* Floating Notification Tooltip */}
                <div className="absolute top-[35%] -left-16 bg-white rounded-2xl p-3 shadow-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} className="text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-[#0F172A] font-bold text-[12px]">Lời mời phỏng vấn!</p>
                    <p className="text-[#64748B] text-[10px]">Grab • vừa xong</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
