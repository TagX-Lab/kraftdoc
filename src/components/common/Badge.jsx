import React from "react";

const COLOR_MAP = {
  emerald: "bg-[#FF4E02]/10 text-[#D93E00] border-[#FF4E02]/30",
  blue: "bg-[#1400C3]/10 text-[#1400C3] border-[#1400C3]/30",
  indigo: "bg-[#1400C3]/10 text-[#1400C3] border-[#1400C3]/30",
  violet: "bg-[#1400C3]/10 text-[#1400C3] border-[#1400C3]/30",
  amber: "bg-[#FF4E02]/10 text-[#D93E00] border-[#FF4E02]/30",
  orange: "bg-[#FF4E02]/10 text-[#D93E00] border-[#FF4E02]/30",
  rose: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  slate: "bg-white text-[#3B3355] border-[#E5DCB8]",
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
