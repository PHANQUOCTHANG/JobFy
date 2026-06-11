import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#1A56DB] text-[11px] font-black uppercase tracking-[0.22em] mb-3 flex items-center gap-2">
      <span className="w-5 h-px bg-[#1A56DB] inline-block" />{children}
    </p>
  );
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[2.2rem] lg:text-[2.6rem] font-black leading-[1.1] text-[#0F172A]"
      style={{ fontFamily: "'Manrope', sans-serif" }}>{children}</h2>
  );
}
