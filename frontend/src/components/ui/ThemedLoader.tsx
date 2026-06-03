import { Briefcase } from "lucide-react";

export function ThemedLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111018]">
      {/* Glow effect behind */}
      <div className="absolute w-64 h-64 bg-[#D44E2B]/20 rounded-full blur-[80px] animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Logo box */}
        <div className="w-[60px] h-[60px] bg-[#D44E2B] rounded-[16px] flex items-center justify-center shadow-xl shadow-[#D44E2B]/40 mb-6 relative">
          <Briefcase size={28} className="text-white relative z-10" strokeWidth={2.5} />
          
          {/* Animated rings */}
          <div className="absolute inset-0 border-2 border-[#D44E2B] rounded-[16px] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-0 border-2 border-[#E8A83A] rounded-[16px] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 delay-300" />
        </div>

        {/* Brand Text */}
        <div className="text-[28px] font-black tracking-tight flex items-center mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="text-white">Job</span>
          <span className="text-[#E8A83A]">Fy</span>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#D44E2B] to-[#E8A83A] w-full origin-left animate-[scaleX_1.5s_ease-in-out_infinite_alternate]" 
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
