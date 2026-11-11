import React, { useState } from "react";
import { ServerOff, RefreshCw, CheckCircle2, ShieldCheck, X } from "lucide-react";
import Button from "./Button";
import { siteConfig } from "../../config/siteConfig";

export default function ServerBusyModal({
  isOpen,
  onClose,
  onRetry,
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isOpen) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#F8F2D8] border-2 border-[#1400C3]/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-up text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#6B627F] hover:text-[#1400C3] hover:bg-white/70 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Header Tag */}
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1400C3]/10 text-xs font-black text-[#1400C3] uppercase tracking-wider mb-4">
          <span>{siteConfig.company.name}</span>
          <span className="text-[#FF4E02]">&bull;</span>
          <span>Edge Network Resilience</span>
        </div>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FF4E02]/15 border-2 border-[#FF4E02]/30 flex items-center justify-center text-[#FF4E02] mb-4 shadow-sm">
          <ServerOff className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl sm:text-3xl font-black text-[#1400C3] tracking-tight mb-2">
          Servers Temporarily Busy
        </h3>
        <p className="text-sm text-[#3B3355] font-semibold max-w-md mx-auto mb-6 leading-relaxed">
          Our cloud edge network is experiencing high visitor volume or undergoing brief maintenance. Please try again in a few moments.
        </p>

        {/* Client-Side In-Browser Guarantee Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D6CA9E] text-left space-y-2 mb-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1400C3]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Good News: Your Open Tools Still Work!</span>
          </div>
          <p className="text-xs text-[#3B3355] font-medium leading-relaxed">
            DocuPix tools run <strong>100% inside your browser</strong> using WebAssembly and Canvas. Any tool currently loaded in your tab will continue to compress images, resize exam photos, and merge PDFs with zero interruption!
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={handleRetry}
            loading={isRetrying}
            variant="orange"
            size="lg"
            icon={RefreshCw}
            className="w-full sm:w-auto"
          >
            Check Server &amp; Retry
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            icon={CheckCircle2}
            className="w-full sm:w-auto"
          >
            Continue in Offline Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
