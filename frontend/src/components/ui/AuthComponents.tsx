import React from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

/* ─── Background Pattern ─── */
export const BackgroundPattern = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    />
    {/* Glows */}
    <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-white/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px]" />
  </div>
);

/* ─── Reusable InputField ─── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  labelRight?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon: Icon, label, labelRight, error, rightElement, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-[13px] font-bold text-[#0F172A]">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
            error
              ? 'text-red-500'
              : 'text-[#94A3B8] group-focus-within:text-[#00307c]'
          }`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
        <input
          ref={ref}
          id={id}
          className={`w-full bg-white hover:bg-slate-50 focus:bg-white rounded-xl border pl-11 outline-none placeholder:text-[#94A3B8] text-[14.5px] text-[#0F172A] font-medium transition-all duration-200 ${
            rightElement ? 'pr-11' : 'pr-4'
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
              : 'border-[#E2E8F0] focus:border-[#00307c] focus:shadow-[0_0_0_3px_rgba(0,48,124,0.10)]'
          }`}
          style={{ height: '50px' }}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-[12px] font-medium mt-0.5">{error}</p>
      )}
    </div>
  )
);
InputField.displayName = 'InputField';

/* ─── Reusable SelectField (from EmployerRegisterPage) ─── */
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ icon: Icon, label, error, options, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-[13px] font-bold text-[#0F172A]">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
            error
              ? 'text-red-500'
              : 'text-[#94A3B8] group-focus-within:text-[#00307c]'
          }`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
        <select
          ref={ref}
          id={id}
          className={`w-full bg-white hover:bg-slate-50 focus:bg-white rounded-xl border pl-11 pr-10 outline-none appearance-none text-[14.5px] text-[#0F172A] font-medium transition-all duration-200 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
              : 'border-[#E2E8F0] focus:border-[#00307c] focus:shadow-[0_0_0_3px_rgba(0,48,124,0.10)]'
          }`}
          style={{ height: '50px' }}
          {...props}
        >
          <option value="">Chọn...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
          <ChevronRight size={16} className="rotate-90" />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-[12px] font-medium mt-0.5">{error}</p>
      )}
    </div>
  )
);
SelectField.displayName = 'SelectField';

/* ─── Feature Badge ─── */
export const FeatureBadge = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
      <Icon size={18} className="text-white" strokeWidth={2} />
    </div>
    <div>
      <p className="text-white font-bold text-[14px]">{title}</p>
      <p className="text-white/60 text-[12px]">{desc}</p>
    </div>
  </div>
);