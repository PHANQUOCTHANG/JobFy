import { Company } from "../types";

export function MarqueeStrip({ companies }: { companies: Company[] }) {
  if (!companies || companies.length === 0) return null;

  return (
    <div className="bg-white border-y border-slate-200 py-3.5 overflow-hidden flex gap-12">
      {[0, 1, 2].map((set) => (
        <div key={set} className="flex gap-12 shrink-0" style={{ animation: "marquee 22s linear infinite" }}>
          {companies.map((c, i) => (
            <span key={`${set}-${i}`} className="text-slate-500 text-[13px] font-semibold whitespace-nowrap flex items-center gap-2 flex-shrink-0">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-[10px]" style={{ background: c.bg }}>
                {c.logo.slice(0, 2)}
              </span>
              {c.name}
              <span className="text-slate-300 mx-2">·</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
