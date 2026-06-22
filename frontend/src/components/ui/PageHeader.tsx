import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="space-y-1">
      <h1 className="text-[1.8rem] sm:text-[2rem] font-black tracking-tight text-[#0F172A] dark:text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
        {title}
      </h1>
      {subtitle && <p className="text-[15px] text-[#64748B] dark:text-slate-400">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
