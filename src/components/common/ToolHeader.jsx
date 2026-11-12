import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ToolHeader({
  title,
  description,
  onBack,
}) {
  return (
    <div className="mb-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black tracking-wider uppercase text-gray-400 hover:text-[#FF3E18] transition-colors mb-4 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO ALL TOOLS</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="font-comic text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
          {title}
        </h1>
      </div>

      <p className="max-w-2xl text-gray-300 text-sm sm:text-base font-medium leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
}