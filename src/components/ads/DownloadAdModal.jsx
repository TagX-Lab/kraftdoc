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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#F8F2D8] border-2 border-[#1400C3]/20 rounded-3xl shadow-2xl overflow-hidden p-6 text-center animate-scale-up">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3B3355] hover:text-[#1400C3] transition-colors p-1 rounded-lg hover:bg-white/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FF4E02]/15 border border-[#FF4E02]/30 flex items-center justify-center text-[#FF4E02] mb-4">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-black text-[#1400C3] mb-1">
          Your File is Ready!
        </h3>
        <p className="text-sm text-[#3B3355] font-medium mb-4 truncate px-4">
          {fileName} {fileSizeText ? `(${fileSizeText})` : ""}
        </p>

        {/* High-value Interstitial Ad Space */}
        <div className="my-4 p-5 rounded-2xl border border-dashed border-[#D6CA9E] bg-white min-h-[140px] flex flex-col items-center justify-center shadow-inner">
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
              <span className="text-[11px] font-black tracking-wider text-[#FF4E02] uppercase bg-[#FF4E02]/10 px-3 py-1 rounded-full mb-2">
                High-Converting Ad Placement
              </span>
              <p className="text-xs font-bold text-[#1400C3]">
                Sponsor / Google AdSense Medium Rectangle (300x250)
              </p>
              <p className="text-[11px] text-[#6B627F] mt-1 font-medium">
                Highest CTR location on utility websites
              </p>
            </>
          )}
        </div>

        {/* Action Button in Blaze Orange */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDownload}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              countdown > 0
                ? "bg-white hover:bg-[#F3ECCE] text-[#1400C3] border border-[#D6CA9E]"
                : "bg-[#FF4E02] hover:bg-[#E04200] text-white shadow-[#FF4E02]/30 active:scale-95"
            }`}
          >
            {countdown > 0 ? (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1400C3] text-xs font-black text-white">
                  {countdown}
                </span>
                <span>Download Ready Soon... (or Click to Skip)</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Download Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
