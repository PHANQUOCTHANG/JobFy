import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, Inbox, Star, CheckCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./Typography";
import { Testimonial } from "../types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, [testimonials]);

  const prevT = () => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length);
  const nextT = () => setTIdx(i => (i + 1) % testimonials.length);

  return (
    <section className="py-24 px-5 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {(!testimonials || testimonials.length === 0) ? (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center py-16 bg-[#F7F4EE] rounded-2xl border border-[#E8E2D8] border-dashed max-w-4xl mx-auto">
              <Inbox size={48} className="text-[#C5B8A8] mb-4" />
              <p className="text-[#6B6059] font-medium text-[14px]">Chưa có đánh giá nào</p>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            {/* Left Column */}
            <div className="flex-1 w-full max-w-[420px]">
              <Reveal>
                <p className="text-[#D44E2B] text-[11px] font-black uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
                  <span className="w-5 h-px bg-[#D44E2B] inline-block" />CÂU CHUYỆN
                </p>
                <h2 className="text-[3.5rem] lg:text-[4rem] font-black leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Tại sao chọn<br />
                  <span className="text-[#D44E2B]">JobFy?</span>
                </h2>

                {/* Overlapping avatars & reviews */}
                <div className="flex items-center gap-5 mb-14">
                  <div className="flex items-center">
                    {testimonials.slice(0, 4).map((t, i) => (
                      <div key={t.id} className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[13px] shadow-sm -ml-4 first:ml-0 relative" style={{ backgroundColor: t.avatarBg, zIndex: 10 - i }}>
                        {t.avatar}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-[#E8A83A] text-[#E8A83A]" />)}
                    </div>
                    <p className="text-[12px] text-[#9B8E7F] font-semibold flex items-center gap-1">
                      50,000+ đánh giá 5 <Star size={11} className="fill-[#E8A83A] text-[#E8A83A]" />
                    </p>
                  </div>
                </div>

                {/* Navigation & Progress */}
                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <button onClick={prevT} className="w-11 h-11 rounded-[0.85rem] border border-[#E8E2D8] flex items-center justify-center text-[#6B6059] hover:border-[#D44E2B] hover:text-[#D44E2B] transition-all bg-white shadow-sm hover:shadow-md">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2.5">
                      {testimonials.map((_, i) => (
                        <button key={i} onClick={() => setTIdx(i)} className={`h-2.5 rounded-full transition-all duration-300 ${i === tIdx ? "w-7 bg-[#D44E2B]" : "w-2.5 bg-[#E8E2D8]"}`} />
                      ))}
                    </div>
                    <button onClick={nextT} className="w-11 h-11 rounded-[0.85rem] border border-[#E8E2D8] flex items-center justify-center text-[#6B6059] hover:border-[#D44E2B] hover:text-[#D44E2B] transition-all bg-white shadow-sm hover:shadow-md">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  {/* Progress Line */}
                  <div className="w-32 h-[2px] bg-[#E8E2D8] relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-[#D44E2B] transition-all duration-500" style={{ width: `${((tIdx + 1) / testimonials.length) * 100}%` }} />
                  </div>
                </div>
              </Reveal>
            </div>
            
            {/* Right Column */}
            <div className="flex-[1.2] w-full">
              <Reveal delay={150}>
                <div className="bg-[#F8F6F1] border border-[#E8E2D8] rounded-[2rem] p-8 md:p-12 relative shadow-sm">
                  {/* Huge faded quote icon in top right */}
                  <div className="absolute top-10 right-10 pointer-events-none opacity-[0.03] select-none text-[#111018]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "160px", lineHeight: "1" }}>
                    ”
                  </div>
                  
                  {/* Reviewer Info */}
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[1rem] flex items-center justify-center text-white font-bold text-[16px] shadow-sm" style={{ backgroundColor: testimonials[tIdx].avatarBg }}>
                        {testimonials[tIdx].avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-[16px] text-[#111018]">{testimonials[tIdx].name}</h3>
                        <p className="text-[13px] text-[#9B8E7F] mt-0.5">{testimonials[tIdx].role}</p>
                        <p className="text-[12px] font-semibold text-[#D44E2B] mt-0.5">@ {testimonials[tIdx].company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#9B8E7F] font-medium">Tìm được việc trong</p>
                      <p className="font-black text-[22px] text-[#111018] mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{testimonials[tIdx].days} ngày</p>
                    </div>
                  </div>

                  {/* Quote text */}
                  <p className="text-[20px] md:text-[22px] leading-[1.65] text-[#111018] font-semibold italic mb-10 relative z-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "{testimonials[tIdx].quote}"
                  </p>

                  {/* Bottom Verification */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D8] relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={15} className="fill-[#E8A83A] text-[#E8A83A]" />)}
                      </div>
                      <span className="text-[12.5px] text-[#9B8E7F] font-medium">Đánh giá đã xác minh</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#10B981] flex items-center justify-center">
                      <CheckCircle size={12} className="text-[#10B981]" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
