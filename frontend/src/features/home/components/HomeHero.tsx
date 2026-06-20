import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Sparkles, Shield, Award, CheckCircle, ArrowRight, TrendingUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Counter } from "./Counter";
import { useProvinces } from "@/features/jobs/hooks/useJobs";
import { CLIENT_PATHS } from "@/config/paths";

export function HomeHero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [provinceId, setProvinceId] = useState<string>("all");
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const provinceRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
        setShowProvinceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("keyword", search.trim());
    if (provinceId !== "all") params.set("provinceId", provinceId);
    
    navigate(`/${CLIENT_PATHS.JOBS}?${params.toString()}`);
  };

  const selectedProvince = provinces?.find((p) => String(p.id) === provinceId);

  return (
    <section className="relative bg-white overflow-hidden border-b border-slate-100" style={{ minHeight: "88vh" }}>
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.35,
        }}
      />
      {/* Soft blue glow top-right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 10%, rgba(26,86,219,.06) 0%, transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-20 lg:pt-24 relative z-10">
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 lg:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-7 bg-[#EEF2FF] border border-[#C7D2FE] rounded-full px-4 py-1.5">
              <TrendingUp size={13} className="text-[#4F46E5]" />
              <span className="text-[12px] font-bold text-[#4F46E5] tracking-wide">
                Nền tảng tuyển dụng hàng đầu Việt Nam
              </span>
            </div>

            <h1
              className="font-black text-slate-900 mb-6 tracking-tight"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.4rem, 5vw, 4.2rem)", lineHeight: 1.1 }}
            >
              Sự nghiệp{" "}
              <em className="not-italic relative">
                <span className="text-[#4F46E5]">không chỉ</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 240 9"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 7Q60 3 120 6Q180 9 236 5"
                    stroke="#4F46E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity=".4"
                  />
                </svg>
              </em>
              {" "}là công việc.
            </h1>

            <p className="text-slate-500 text-[17px] leading-relaxed mb-10 max-w-[480px]">
              Kết nối với hàng nghìn nhà tuyển dụng uy tín. Tìm đúng vị trí, đúng công ty,
              đúng thời điểm.
            </p>

            {/* Search box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-lg shadow-slate-200/50 max-w-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-3 flex-1 bg-slate-50 border border-transparent focus-within:bg-white focus-within:border-[#4F46E5]/40 focus-within:ring-4 focus-within:ring-[#4F46E5]/8 rounded-xl px-4 py-3.5 transition-all">
                  <Search size={17} className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Vị trí, kỹ năng, công ty…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-slate-800 placeholder:text-slate-400 outline-none w-full text-[14px]"
                  />
                </div>
                <div ref={provinceRef} className="relative flex items-center gap-3 sm:w-56 bg-slate-50 border border-transparent focus-within:bg-white focus-within:border-[#4F46E5]/40 focus-within:ring-4 focus-within:ring-[#4F46E5]/8 rounded-xl px-4 py-3.5 transition-all cursor-pointer" onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}>
                  <MapPin size={16} className="text-slate-400 flex-shrink-0" />
                  <div className="flex-1 text-left truncate text-[14px] text-slate-800">
                    {isLoadingProvinces ? "Đang tải..." : selectedProvince ? selectedProvince.name : "Tất cả địa điểm"}
                  </div>
                  <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                  
                  {showProvinceDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto scrollbar-hide py-2">
                      <div
                        className="px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer flex justify-start text-left w-full"
                        onClick={() => setProvinceId("all")}
                      >
                        Tất cả địa điểm
                      </div>
                      {(provinces || []).map((prov) => (
                        <div
                          key={prov.id}
                          className={`px-4 py-2.5 text-[13px] cursor-pointer hover:bg-slate-50 transition-colors flex justify-start text-left w-full ${
                            provinceId === String(prov.id) ? "text-[#4F46E5] font-bold bg-indigo-50/50" : "text-slate-800"
                          }`}
                          onClick={() => setProvinceId(String(prov.id))}
                        >
                          {prov.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleSearch} className="mt-2 w-full bg-[#4F46E5] hover:bg-[#4338CA] active:scale-[.98] text-white font-bold py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all shadow-md shadow-[#4F46E5]/20">
                <Search size={15} /> Tìm kiếm việc làm
              </button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-slate-400 text-[12px] font-semibold">Tìm nhiều:</span>
              {["React Developer", "Data Analyst", "UX Designer", "Marketing", "Kế toán"].map(t => (
                <button
                  key={t}
                  onClick={() => setSearch(t)}
                  className="text-[12px] text-slate-600 bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4F46E5] border border-slate-200 hover:border-[#C7D2FE] rounded-full px-3 py-1 transition-all font-medium"
                >
                  {}
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-slate-100">
              {[
                { icon: Shield, label: "Nhà tuyển dụng xác thực" },
                { icon: Award, label: "Top 1 Việt Nam" },
                { icon: CheckCircle, label: "Miễn phí cho ứng viên" },
              ].map(({ icon: I, label }) => (
                <div key={label} className="flex items-center gap-2 text-[12.5px] text-slate-500 font-medium">
                  <I size={14} className="text-[#4F46E5]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column: floating cards ── */}
          <div className="hidden lg:flex flex-col gap-4 select-none">

            {/* Card 1 — Featured job */}
            <div
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xl shadow-slate-200/60"
              style={{ animation: "floatA 7s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-[11px] text-emerald-600 font-black tracking-widest uppercase">Vị trí nổi bật</span>
              </div>
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0" style={{ background: "#FF6B2C" }}>FPT</div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[15px] leading-snug">Senior React Developer</h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">FPT Software · Hà Nội</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap mb-4">
                {["React", "TypeScript", "Node.js"].map(t => (
                  <span key={t} className="text-[11px] bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-md font-medium">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                <span className="text-emerald-600 font-bold text-[14px]">25 – 40 triệu</span>
                <button className="text-[12px] text-[#4F46E5] font-bold flex items-center gap-1 hover:gap-1.5 transition-all">
                  Ứng tuyển <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Card 2 — AI suggestions */}
            <div
              className="ml-8 bg-white border border-[#C7D2FE] rounded-2xl p-4 shadow-xl shadow-blue-100/50"
              style={{ animation: "floatB 9s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#4F46E5]" />
                <span className="text-[13px] font-bold text-slate-900">Gợi ý cho bạn</span>
                <span className="ml-auto text-[10px] bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full font-bold border border-[#C7D2FE]">AI</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { l: "React Dev @ Grab", p: 92 },
                  { l: "Frontend @ Shopee", p: 85 },
                  { l: "UI Lead @ Tiki", p: 79 },
                ].map(({ l, p }) => (
                  <div key={l}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-slate-500">{l}</span>
                      <span className="text-[11px] text-[#4F46E5] font-bold">{p}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div className="h-1.5 bg-[#4F46E5] rounded-full" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 — Notification */}
            <div
              className="-ml-4 bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-slate-200/50"
              style={{ animation: "floatA 11s ease-in-out infinite reverse" }}
            >
              <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle size={15} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-800">Hồ sơ vừa được xem!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">VNG Corporation · 3 phút trước</p>
              </div>
            </div>
          </div>

        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-100">
          {[
            { to: 50, suffix: "K+", label: "Việc làm đang tuyển" },
            { to: 15, suffix: "K+", label: "Công ty uy tín" },
            { to: 2000, suffix: "K+", label: "Ứng viên tin dùng" },
            { to: 98, suffix: "%", label: "Tỷ lệ hài lòng" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div
                className="text-[2.4rem] font-black text-[#4F46E5] leading-none mb-1.5"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="text-[13px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
