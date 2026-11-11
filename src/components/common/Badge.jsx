import React from "react";

const COLOR_MAP = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  slate: "bg-slate-700/40 text-slate-300 border-slate-600/40",
};

export default function Badge({ children, color = "indigo", className = "" }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP.indigo;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
}
