import { useState } from "react";
import { Search, MapPin, Sparkles, Shield, Award, CheckCircle, ArrowRight } from "lucide-react";
import { Counter } from "./Counter"; // We'll create this utility component

export function HomeHero() {
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("");

  return (
    <section className="relative bg-[#111018] text-white overflow-hidden" style={{ minHeight: "94vh" }}>
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px",
      }} />
      {/* Glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none" style={{ background: "radial-gradient(circle at 70% 30%, rgba(212,78,43,.12) 0%, transparent 60%)" }} />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,168,58,.06) 0%, transparent 60%)" }} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-20 pb-24 lg:pt-28 relative z-10">
        <div className="grid lg:grid-cols-[1fr_460px] gap-16 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 mb-8 bg-[#D44E2B]/12 border border-[#D44E2B]/25 rounded-full px-4 py-1.5">
              <Sparkles size={13} className="text-[#E8A83A]" />
              <span className="text-[12px] font-bold text-[#E8A83A] tracking-wide">Nền tảng tuyển dụng hàng đầu Việt Nam</span>
            </div>

            <h1 className="font-black text-white mb-7 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.6rem, 5vw, 4.6rem)", lineHeight: 1.07 }}>
              Sự nghiệp{" "}
              <em className="not-italic relative">
                <span className="text-[#D44E2B]">không chỉ</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 240 9" fill="none" preserveAspectRatio="none">
                  <path d="M4 7Q60 3 120 6Q180 9 236 5" stroke="#D44E2B" strokeWidth="2.5" strokeLinecap="round" opacity=".5" />
                </svg>
              </em>
              {" "}là công việc.
            </h1>

            <p className="text-[#9B8E7F] text-[17px] leading-relaxed mb-10 max-w-[460px]">
              Kết nối với hàng nghìn nhà tuyển dụng uy tín. Tìm đúng vị trí, đúng công ty,
              đúng thời điểm — để sự nghiệp của bạn thực sự có ý nghĩa.
            </p>

            <div className="bg-[#1C1926] border border-white/8 rounded-2xl p-2 shadow-2xl shadow-black/50">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-3 flex-1 bg-white/5 border border-white/6 focus-within:border-[#D44E2B]/50 rounded-xl px-4 py-3.5 transition-all">
                  <Search size={17} className="text-[#5A5048] flex-shrink-0" />
                  <input type="text" placeholder="Vị trí, kỹ năng, công ty…"
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-white placeholder:text-[#4A4040] outline-none w-full text-sm" />
                </div>
                <div className="flex items-center gap-3 sm:w-44 bg-white/5 border border-white/6 focus-within:border-[#D44E2B]/50 rounded-xl px-4 py-3.5 transition-all">
                  <MapPin size={16} className="text-[#5A5048] flex-shrink-0" />
                  <input type="text" placeholder="Địa điểm"
                    value={loc} onChange={e => setLoc(e.target.value)}
                    className="bg-transparent text-white placeholder:text-[#4A4040] outline-none w-full text-sm" />
                </div>
              </div>
              <button className="mt-2 w-full bg-[#D44E2B] hover:bg-[#BF3F1E] active:scale-[.98] text-white font-bold py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D44E2B]/25">
                <Search size={15} /> Tìm kiếm việc làm
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-[#4A4040] text-[12px] font-semibold">Tìm nhiều:</span>
              {["React Developer", "Data Analyst", "UX Designer", "Marketing", "Kế toán"].map(t => (
                <button key={t} onClick={() => setSearch(t)}
                  className="text-[12px] text-[#6B6059] border border-white/10 hover:border-[#D44E2B]/50 hover:text-[#D44E2B] rounded-full px-3 py-1 transition-all">
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/8">
              {[
                { icon: Shield,       label: "Nhà tuyển dụng xác thực" },
                { icon: Award,        label: "Top 1 Việt Nam" },
                { icon: CheckCircle,  label: "Miễn phí cho ứng viên" },
              ].map(({ icon: I, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12px] text-[#6B6059]">
                  <I size={13} className="text-[#E8A83A]" />{label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating job cards */}
          <div className="hidden lg:flex flex-col gap-4 select-none">
            <div className="bg-[#1C1926] border border-white/8 rounded-2xl p-5 shadow-2xl"
              style={{ animation: "floatA 7s ease-in-out infinite" }}>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 bg-[#D44E2B] rounded-full animate-pulse" />
                <span className="text-[11px] text-[#D44E2B] font-black tracking-widest uppercase">Vị trí nổi bật</span>
              </div>
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg flex-shrink-0" style={{ background: "#FF6B2C" }}>FPT</div>
                <div>
                  <h3 className="font-bold text-white text-[15px] leading-snug">Senior React Developer</h3>
                  <p className="text-[13px] text-[#6B6059] mt-0.5">FPT Software · Hà Nội</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {["React", "TypeScript", "Node.js"].map(t => (
                  <span key={t} className="text-[11px] bg-white/6 text-[#9B8E7F] border border-white/8 px-2.5 py-0.5 rounded-md">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3.5 border-t border-white/8">
                <span className="text-[#E8A83A] font-bold">25 – 40 triệu</span>
                <button className="text-[12px] text-[#D44E2B] font-bold flex items-center gap-1 hover:gap-1.5 transition-all">Ứng tuyển <ArrowRight size={12} /></button>
              </div>
            </div>

            <div className="ml-8 bg-gradient-to-br from-[#1C1926] to-[#221A2C] border border-[#D44E2B]/20 rounded-2xl p-4 shadow-xl"
              style={{ animation: "floatB 9s ease-in-out infinite" }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#E8A83A]" />
                <span className="text-[13px] font-bold text-white">Gợi ý cho bạn</span>
                <span className="ml-auto text-[10px] bg-[#D44E2B]/20 text-[#D44E2B] px-2 py-0.5 rounded-full font-bold">AI</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { l: "React Dev @ Grab",    p: 92 },
                  { l: "Frontend @ Shopee",   p: 85 },
                  { l: "UI Lead @ Tiki",      p: 79 },
                ].map(({ l, p }) => (
                  <div key={l}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-[#9B8E7F]">{l}</span>
                      <span className="text-[11px] text-[#E8A83A] font-bold">{p}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full">
                      <div className="h-1.5 bg-gradient-to-r from-[#D44E2B] to-[#E8A83A] rounded-full" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="-ml-4 bg-[#1C1926] border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg"
              style={{ animation: "floatA 11s ease-in-out infinite reverse" }}>
              <div className="w-8 h-8 bg-[#10B981]/12 border border-[#10B981]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={15} className="text-[#10B981]" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">Hồ sơ vừa được xem!</p>
                <p className="text-[11px] text-[#6B6059] mt-0.5">VNG Corporation · 3 phút trước</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/8">
          {[
            { to: 50,      suffix: "K+",  label: "Việc làm đang tuyển" },
            { to: 15,      suffix: "K+",  label: "Công ty uy tín" },
            { to: 2000,    suffix: "K+",  label: "Ứng viên tin dùng" },
            { to: 98,      suffix: "%",   label: "Tỷ lệ hài lòng" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[2.4rem] font-black text-[#E8A83A] leading-none mb-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="text-[13px] text-[#6B6059]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
