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
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF3E18]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#FF3E18] hover:bg-[#E03410] text-white shadow-lg shadow-[#FF3E18]/25 active:scale-95",
    orange:
      "bg-[#FF3E18] hover:bg-[#E03410] text-white shadow-lg shadow-[#FF3E18]/25 active:scale-95",
    emerald:
      "bg-[#FF3E18] hover:bg-[#E03410] text-white shadow-lg shadow-[#FF3E18]/25 active:scale-95",
    secondary:
      "bg-[#141414] hover:bg-white hover:text-black text-white border border-white/20 shadow-sm active:scale-95",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 active:scale-95",
    outline:
      "border-2 border-[#FF3E18] hover:bg-[#FF3E18] text-[#FF3E18] hover:text-white bg-transparent active:scale-95",
    ghost:
      "text-gray-300 hover:text-white hover:bg-white/10 active:scale-95",
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
