import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // 'primary' | 'orange' | 'secondary' | 'danger' | 'outline' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon: Icon = null,
  className = "",
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1400C3]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#1400C3] hover:bg-[#0D0094] text-white shadow-lg shadow-[#1400C3]/25 active:scale-95",
    orange:
      "bg-[#FF4E02] hover:bg-[#E04200] text-white shadow-lg shadow-[#FF4E02]/30 active:scale-95",
    emerald:
      "bg-[#FF4E02] hover:bg-[#E04200] text-white shadow-lg shadow-[#FF4E02]/30 active:scale-95", // Keep CTA orange
    secondary:
      "bg-white hover:bg-[#EFE6C4] text-[#1400C3] border border-[#E5DCB8] shadow-sm active:scale-95",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 active:scale-95",
    outline:
      "border-2 border-[#1400C3] hover:bg-[#1400C3] text-[#1400C3] hover:text-white bg-transparent active:scale-95",
    ghost:
      "text-[#1400C3] hover:text-[#0D0094] hover:bg-white/60 active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
