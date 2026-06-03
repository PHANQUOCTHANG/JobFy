import { FileText, Search, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel, SectionHeading } from "./Typography";

export function HowItWorks() {
  return (
    <section className="py-20 px-5 lg:px-10 bg-[#F7F4EE]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>
            <span className="mx-auto flex items-center gap-2">
              <span className="w-5 h-px bg-[#D44E2B] inline-block" />
              Quy trình ứng tuyển
              <span className="w-5 h-px bg-[#D44E2B] inline-block" />
            </span>
          </SectionLabel>
          <SectionHeading>
            Đơn giản hóa <em className="not-italic text-[#D44E2B]">hành trình</em> của bạn
          </SectionHeading>
          <p className="text-[#6B6059] text-[15px] mt-4 max-w-xl mx-auto">
            Chỉ với vài thao tác cơ bản, bạn có thể tiếp cận ngay hàng nghìn cơ hội việc làm tốt nhất.
          </p>
        </Reveal>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#E8A83A]/50 to-transparent -translate-y-1/2 z-0" />
          
          {[
            { step: "01", icon: FileText, title: "Tạo hồ sơ ấn tượng", desc: "Sử dụng công cụ tạo CV AI để có ngay một bản profile hoàn chỉnh và chuyên nghiệp." },
            { step: "02", icon: Search, title: "Tìm kiếm phù hợp", desc: "Hệ thống AI sẽ tự động đề xuất những vị trí hoàn hảo với kỹ năng và kinh nghiệm của bạn." },
            { step: "03", icon: Send, title: "Ứng tuyển nhanh chóng", desc: "Ứng tuyển chỉ với 1 chạm. Theo dõi trạng thái hồ sơ trực tiếp trên nền tảng." }
          ].map(({ step, icon: I, title, desc }, i) => (
            <Reveal key={step} delay={i * 100} className="relative z-10">
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-[#E8E2D8] hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-[#D44E2B]/10 rounded-full flex items-center justify-center mb-6 relative">
                  <I size={28} className="text-[#D44E2B]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E8A83A] text-[#111018] rounded-full font-black flex items-center justify-center text-[13px] border-[3px] border-white">
                    {step}
                  </div>
                </div>
                <h3 className="font-bold text-[18px] text-[#111018] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p className="text-[#6B6059] text-[14px] leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
