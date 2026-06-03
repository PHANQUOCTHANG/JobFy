import { Sparkles, BarChart3, Shield, Eye, ArrowRight, MapPin, Globe } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Typography";

export function CvBuilderFeature() {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#111018] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(212,78,43,.1) 0%, transparent 50%)" }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px",
      }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left copy */}
          <Reveal>
            <SectionLabel>Tính năng</SectionLabel>
            <h2 className="text-[2.2rem] lg:text-[2.8rem] font-black text-white leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Tạo CV chuyên nghiệp<br />trong <em className="not-italic text-[#E8A83A]">5 phút</em>
            </h2>
            <p className="text-[#6B6059] text-[16px] leading-relaxed mb-8 max-w-md">
              Hơn 50 mẫu CV được thiết kế bởi chuyên gia. Tối ưu ATS, tỷ lệ được mời phỏng vấn tăng 3× so với CV thông thường.
            </p>
            <div className="space-y-3.5 mb-10">
              {[
                { icon: Sparkles, title: "AI gợi ý nội dung",       desc: "Tự động điền mô tả công việc và kỹ năng phù hợp" },
                { icon: BarChart3, title: "Phân tích điểm mạnh",     desc: "Chấm điểm CV và đưa ra gợi ý cải thiện cụ thể" },
                { icon: Shield,    title: "Tối ưu hóa ATS",          desc: "Đảm bảo CV vượt qua phần mềm lọc của nhà tuyển dụng" },
                { icon: Eye,       title: "Theo dõi lượt xem",       desc: "Biết ai đã xem CV của bạn và khi nào" },
              ].map(({ icon: I, title, desc }) => (
                <div key={title} className="flex items-start gap-4 group">
                  <div className="w-9 h-9 bg-[#D44E2B]/15 border border-[#D44E2B]/25 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D44E2B]/25 transition-colors">
                    <I size={16} className="text-[#D44E2B]" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold text-white">{title}</p>
                    <p className="text-[12px] text-[#6B6059] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="bg-[#D44E2B] hover:bg-[#BF3F1E] text-white font-bold px-7 py-3.5 rounded-xl text-[13px] transition-all shadow-lg shadow-[#D44E2B]/25 flex items-center gap-2 group">
                Tạo CV ngay – Miễn phí <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="text-[13px] text-[#9B8E7F] hover:text-white transition-colors flex items-center gap-1 font-semibold">
                Xem mẫu CV →
              </a>
            </div>
          </Reveal>

          {/* Right: CV mockup */}
          <Reveal delay={150}>
            <div className="relative" style={{ animation: "floatA 8s ease-in-out infinite" }}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E2D8]">
                <div className="bg-[#111018] p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#D44E2B]/20 border-2 border-[#D44E2B]/50 flex items-center justify-center text-white font-black text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>NT</div>
                  <div>
                    <h3 className="text-white font-black text-[16px]" style={{ fontFamily: "'Playfair Display', serif" }}>Nguyễn Văn Thành</h3>
                    <p className="text-[#D44E2B] text-[12px] font-semibold mt-0.5">Senior Frontend Developer</p>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[11px] text-[#6B6059] flex items-center gap-0.5"><MapPin size={10} />TP. Hồ Chí Minh</span>
                      <span className="text-[11px] text-[#6B6059] flex items-center gap-0.5"><Globe size={10} />5 năm kinh nghiệm</span>
                    </div>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] text-[#5A5048]">Điểm CV</p>
                      <p className="text-[#E8A83A] font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>94</p>
                      <p className="text-[10px] text-[#5A5048]">/ 100</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-black text-[#D44E2B] uppercase tracking-widest mb-2.5">Kỹ năng nổi bật</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "Next.js", "Node.js", "AWS", "Figma"].map(s => (
                        <span key={s} className="text-[11px] bg-[#F7F4EE] text-[#4A4040] border border-[#E8E2D8] px-2.5 py-1 rounded-md font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-[#D44E2B] uppercase tracking-widest mb-2.5">Sức mạnh hồ sơ</p>
                    {[
                      { label: "Kinh nghiệm", pct: 90 },
                      { label: "Kỹ năng",     pct: 85 },
                      { label: "Trình bày",   pct: 95 },
                    ].map(({ label, pct }) => (
                      <div key={label} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-[#6B6059] font-semibold">{label}</span>
                          <span className="text-[11px] text-[#D44E2B] font-bold">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#EDE9E1] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D44E2B] to-[#E8A83A]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
