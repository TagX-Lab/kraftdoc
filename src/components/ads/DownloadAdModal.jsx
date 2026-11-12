import React, { useEffect, useState } from "react";
import { Sparkles, X, CheckCircle2 } from "lucide-react";
import { adConfig } from "../../config/adConfig";

export default function DownloadAdModal({
  isOpen,
  onClose,
  onConfirmDownload,
  fileName = "document.pdf",
  fileSizeText = "",
}) {
  const [countdown, setCountdown] = useState(adConfig.modalDelaySeconds || 2);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    onConfirmDownload();
    setCountdown(adConfig.modalDelaySeconds || 2);
    onClose();
  };

  const handleClose = () => {
    setCountdown(adConfig.modalDelaySeconds || 2);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#141414] border-2 border-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 text-center animate-scale-up text-white">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FF3E18]/15 border border-[#FF3E18]/30 flex items-center justify-center text-[#FF3E18] mb-4 shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>

        <h3 className="font-comic text-3xl text-white uppercase tracking-wider mb-1">
          YOUR FILE IS READY!
        </h3>
        <p className="text-sm text-gray-300 font-medium mb-4 truncate px-4">
          {fileName} {fileSizeText ? `(${fileSizeText})` : ""}
        </p>

        {/* Interstitial Ad Space */}
        <div className="my-4 p-5 rounded-xl border border-dashed border-white/20 bg-black min-h-[140px] flex flex-col items-center justify-center shadow-inner">
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
              <span className="text-[10px] font-black tracking-widest text-[#FF3E18] uppercase bg-[#FF3E18]/15 px-3 py-1 rounded-full mb-2 border border-[#FF3E18]/30">
                HIGH-CONVERTING AD PLACEMENT
              </span>
              <p className="text-xs font-bold text-white">
                Sponsor / Google AdSense Medium Rectangle (300x250)
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">
                Highest CTR location on utility websites
              </p>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={handleDownload}
            className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-comic text-lg sm:text-xl uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
              countdown > 0
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-[#FF3E18] hover:bg-[#E03410] text-white active:scale-95 shadow-[#FF3E18]/30"
            }`}
          >
            {countdown > 0 ? (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-xs font-black text-white">
                  {countdown}
                </span>
                <span>DOWNLOAD READY SOON &bull; CLICK TO SKIP</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>DOWNLOAD NOW</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            Skip waiting &amp; save file immediately &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}