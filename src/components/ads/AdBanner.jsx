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
      <aside
        role="complementary"
        aria-label="Advertisement"
        className={`w-full max-w-4xl mx-auto overflow-hidden my-4 flex flex-col items-center justify-center ${className}`}
      >
        <span className="text-[10px] font-bold tracking-widest text-[#6B627F]/60 uppercase mb-1">
          Advertisement
        </span>
        <div className="w-full flex justify-center min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minHeight: "90px", width: "100%" }}
            data-ad-client={adConfig.publisherId}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </aside>
    );
  }

  if (!adConfig.showDevPlaceholders) {
    return null;
  }

  return (
    <aside
      role="complementary"
      aria-label="Advertisement Placeholder"
      className={`w-full max-w-4xl mx-auto my-3 p-3.5 rounded-2xl border border-dashed border-[#1A1A1A]/20 bg-white/70 flex flex-col items-center justify-center text-center transition-all shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF5A00]"></span>
        <span>Google AdSense Slot #{slotId}</span>
        <span className="text-[#5A5450] font-normal">&bull; Non-Intrusive Responsive Banner</span>
      </div>
    </aside>
  );
}
