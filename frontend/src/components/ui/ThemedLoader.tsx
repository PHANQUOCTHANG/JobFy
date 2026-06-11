import { Briefcase } from "lucide-react";

export function ThemedLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Subtle glow effect behind */}
      <div className="absolute w-64 h-64 bg-[#1A56DB]/5 rounded-full blur-[80px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Logo box */}
        <div className="w-[60px] h-[60px] bg-white rounded-[16px] flex items-center justify-center shadow-lg shadow-slate-200/50 mb-6 relative border border-slate-100">
          <Briefcase size={28} className="text-[#1A56DB] relative z-10" strokeWidth={2.5} />
          
          {/* Animated rings */}
          <div className="absolute inset-0 border-2 border-[#1A56DB] rounded-[16px] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" />
          <div className="absolute inset-0 border-2 border-[#1A56DB] rounded-[16px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-10 delay-300" />
        </div>

        {/* Brand Text */}
        <div className="text-[28px] font-black tracking-tight flex items-center mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
          <span className="text-slate-900">Job</span>
          <span className="text-[#F59E0B]">Fy</span>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 bg-[#1A56DB] w-full origin-left animate-[scaleX_1.5s_ease-in-out_infinite_alternate]" 
               style={{ animationName: "pulseWidth", animationDuration: "1.5s", animationIterationCount: "infinite" }} />
        </div>
        
        <style>{`
          @keyframes pulseWidth {
            0% { transform: scaleX(0.1); transform-origin: left; }
            50% { transform: scaleX(1); transform-origin: left; }
            50.1% { transform: scaleX(1); transform-origin: right; }
            100% { transform: scaleX(0.1); transform-origin: right; }
          }
        `}</style>
      </div>
    </div>
  );
}
