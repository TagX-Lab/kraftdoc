import React from "react";

const COLOR_MAP = {
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  ciel: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  indigo: "bg-[#FF3E18]/15 text-[#FF3E18] border-[#FF3E18]/30",
  violet: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  amber: "bg-[#FF3E18]/15 text-[#FF3E18] border-[#FF3E18]/30",
  orange: "bg-[#FF3E18]/15 text-[#FF3E18] border-[#FF3E18]/30",
  rose: "bg-[#FF3E18]/15 text-[#FF3E18] border-[#FF3E18]/30",
  slate: "bg-white/10 text-white border-white/20",
};

export default function Badge({ children, color = "indigo", className = "" }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP.indigo;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
}
