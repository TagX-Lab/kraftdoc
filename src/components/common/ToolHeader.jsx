import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Badge from "./Badge";

export default function ToolHeader({
  title,
  description,
  badgeText,
  badgeColor = "indigo",
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
        {badgeText && <Badge color={badgeColor}>{badgeText}</Badge>}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-400 text-sm">
        <p className="max-w-2xl">{description}</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Client-Side &bull; Files stay on your device</span>
        </div>
      </div>
    </div>
  );
}
