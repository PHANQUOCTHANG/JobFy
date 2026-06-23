import { useState } from "react";
import { Bell, Mail, Send } from "lucide-react";
import { Reveal } from "./Reveal";

export function JobAlert() {
  const [email, setEmail] = useState("");

  return (
    <section className="pb-24 px-5 lg:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="bg-[#0F172A] rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bell size={28} className="text-[#4F46E5]" />
              </div>
              <div>
                <h3 className="text-[2rem] font-black text-white mb-2 tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Đừng bỏ lỡ cơ hội nào
                </h3>
                <p className="text-[#64748B] text-[15px]">
                  Nhận thông báo việc làm mới mỗi ngày qua email — miễn phí
                </p>
              </div>
            </div>

            <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-[320px]">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/20 focus:border-[#4F46E5] rounded-xl pl-11 pr-4 py-4 text-[14px] text-white outline-none transition-all placeholder:text-[#64748B]"
                />
              </div>
              <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold px-7 py-4 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap">
                <Send size={16} /> Đăng ký
              </button>
            </form>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
