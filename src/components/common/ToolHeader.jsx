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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Tools</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
      </div>

      <p className="max-w-2xl text-slate-400 text-sm">{description}</p>
    </div>
  );
}
