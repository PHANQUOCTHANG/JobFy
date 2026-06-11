import React from "react";
import { Home, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline" | "ghost";
    size?: string;
  }
>(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation";

  const variants = {
    primary:
      "bg-[#1A56DB] text-white hover:bg-[#1447C0] shadow-[0_0_20px_rgba(212,78,43,0.1)] hover:shadow-[0_0_25px_rgba(212,78,43,0.25)] hover:-translate-y-0.5 border-0",
    outline:
      "border border-zinc-700 bg-transparent text-zinc-400 hover:bg-white hover:text-black hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-0.5",
    ghost: "hover:bg-white/10 text-zinc-400 hover:text-white bg-transparent",
  };

  const sizes = {
    default: "h-12 px-8",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      ref={ref}
      className={cn(
        base,
        variants[variant],
        sizes[size as keyof typeof sizes],
        className,
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F6FA] font-sans text-[#0F172A] overflow-hidden relative p-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="relative group">
          <div className="absolute inset-0 bg-[#1A56DB]/10 rounded-full blur-2xl group-hover:bg-[#1A56DB]/20 transition-all duration-500" />

          <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center rounded-full bg-white border-2 border-[#1A56DB]/20 shadow-2xl">
            <div className="absolute inset-0 rounded-full border border-[#1A56DB]/10 animate-[spin_10s_linear_infinite_paused] group-hover:animate-play-state-running"></div>
            
            <div className="w-16 h-16 md:w-24 md:h-24 bg-[#1A56DB] rounded-full flex items-center justify-center border border-[#1A56DB]/20 relative overflow-hidden shadow-inner">
              <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" strokeWidth={2} />
            </div>

            <div className="absolute -top-4 -right-8 bg-[#0F172A] text-white text-xs font-bold px-3 py-1.5 rounded-md rotate-12 shadow-lg">
              ERR_404
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h1 className="text-6xl md:text-8xl font-black text-[#1A56DB] tracking-tighter drop-shadow-sm" style={{ fontFamily: "'Manrope', sans-serif" }}>
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] uppercase tracking-widest">
            Không tìm thấy
          </h2>
          <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
            Rất tiếc, công việc hoặc trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống JobFy.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
          <Button
            variant="primary"
            className="w-full sm:w-auto gap-3"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest flex items-center gap-2">
        <Briefcase className="w-3 h-3" />
        JobFy Platform • Không tìm thấy tài nguyên
      </div>
    </div>
  );
}
