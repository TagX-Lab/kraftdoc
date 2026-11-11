import React, { useState, useEffect } from "react";
import { Download, Sparkles, X, CheckCircle2 } from "lucide-react";
import { adConfig } from "../../config/adConfig";

export default function DownloadAdModal({
  isOpen,
  onClose,
  onConfirmDownload,
  fileName = "file",
  fileSizeText = "",
}) {
  const [countdown, setCountdown] = useState(adConfig.downloadCountdownSeconds || 3);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(adConfig.downloadCountdownSeconds || 3);
      return;
    }

    setCountdown(adConfig.downloadCountdownSeconds || 3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    onConfirmDownload();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-center animate-scale-up">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Your File is Ready!
        </h3>
        <p className="text-sm text-slate-400 mb-4 truncate px-4">
          {fileName} {fileSizeText ? `(${fileSizeText})` : ""}
        </p>

        {/* High-value Interstitial Ad Space */}
        <div className="my-4 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 min-h-[140px] flex flex-col items-center justify-center">
          {adConfig.enabled ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block", minHeight: "120px", width: "100%" }}
              data-ad-client={adConfig.publisherId}
              data-ad-slot={adConfig.slots.downloadModal}
              data-ad-format="rectangle"
            />
          ) : (
            <>
              <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-2">
                High-Converting Ad Placement
              </span>
              <p className="text-xs text-slate-300">
                Sponsor / Google AdSense Medium Rectangle (300x250)
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Highest CTR location on utility websites
              </p>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDownload}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              countdown > 0
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
            }`}
          >
            {countdown > 0 ? (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-indigo-400">
                  {countdown}
                </span>
                <span>Download Ready Soon... (or Click to Skip)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Download Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
