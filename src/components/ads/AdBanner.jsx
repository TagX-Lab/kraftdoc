import React, { useEffect } from "react";
import { adConfig } from "../../config/adConfig";

export default function AdBanner({ slotId = adConfig.slots.topBanner, format = "auto", className = "" }) {
  useEffect(() => {
    if (adConfig.enabled) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch {
        // Suppress
      }
    }
  }, []);

  if (adConfig.enabled) {
    return (
      <div className={`w-full overflow-hidden my-4 flex justify-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "90px" }}
          data-ad-client={adConfig.publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (!adConfig.showDevPlaceholders) {
    return null;
  }

  return (
    <div
      className={`w-full my-4 p-4 rounded-2xl border border-dashed border-[#D6CA9E] bg-white/60 flex flex-col items-center justify-center text-center transition-all shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1400C3]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF4E02]"></span>
        Google AdSense Ready
      </div>
      <p className="text-xs text-[#6B627F] font-medium mt-1">
        Banner Slot #{slotId} &bull; Responsive 728x90 / 320x50
      </p>
    </div>
  );
}
