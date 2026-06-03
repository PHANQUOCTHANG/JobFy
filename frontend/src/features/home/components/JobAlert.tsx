import { useState } from "react";
import { Bell, Mail, Send } from "lucide-react";
import { Reveal } from "./Reveal";

export function JobAlert() {
  const [email, setEmail] = useState("");

  return (
    <section className="pb-24 px-5 lg:px-10 bg-[#F7F4EE]">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="bg-[#111018] rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
            
            {/* Left Content */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#2B1B15] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bell size={28} className="text-[#D44E2B]" />
              </div>
              <div>
                <h3 className="text-[2rem] font-black text-white mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Đừng bỏ lỡ cơ hội nào
                </h3>
                <p className="text-[#6B6059] text-[15px]">
                  Nhận thông báo việc làm mới mỗi ngày qua email — miễn phí
                </p>
              </div>
            </div>

            {/* Right Form */}
            <form onSubmit={e => e.preventDefault()} className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-[320px]">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6059]" />
                <input 
                  type="email" 
                  placeholder="Email của bạn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/20 focus:border-[#D44E2B] rounded-xl pl-11 pr-4 py-4 text-[14px] text-white outline-none transition-all placeholder:text-[#6B6059]"
                />
              </div>
              <button type="submit" className="bg-[#D44E2B] hover:bg-[#BF3F1E] text-white font-bold px-7 py-4 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap">
                <Send size={16} /> Đăng ký
              </button>
            </form>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
