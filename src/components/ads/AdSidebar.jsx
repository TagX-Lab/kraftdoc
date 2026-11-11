import React, { useEffect } from "react";
import { adConfig } from "../../config/adConfig";

export default function AdSidebar({ slotId = adConfig.slots.sidebarSticky, className = "" }) {
  useEffect(() => {
    if (adConfig.enabled) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        // Suppress
      }
    }
  }, []);

  if (adConfig.enabled) {
    return (
      <div className={`hidden lg:block w-72 shrink-0 ${className}`}>
        <div className="sticky top-24 rounded-3xl bg-white border border-[#D6CA9E] p-2 overflow-hidden shadow-sm">
          <ins
            className="adsbygoogle"
            style={{ display: "block", minWidth: "250px", minHeight: "600px" }}
            data-ad-client={adConfig.publisherId}
            data-ad-slot={slotId}
            data-ad-format="vertical"
          />
        </div>
      </div>
    );
  }

  if (!adConfig.showDevPlaceholders) {
    return null;
  }

  return (
    <div className={`hidden lg:block w-72 shrink-0 ${className}`}>
      <div className="sticky top-24 rounded-3xl border border-dashed border-[#D6CA9E] bg-white/70 p-6 flex flex-col items-center justify-center text-center min-h-[500px] shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1400C3]/10 text-[11px] font-black tracking-wider text-[#1400C3] uppercase mb-3">
          Sidebar Ad Slot
        </div>
        <p className="text-sm text-[#1400C3] font-bold">
          High CTR Skyscraper Ad
        </p>
        <p className="text-xs text-[#6B627F] font-medium mt-2">
          300x600 &bull; 160x600 &bull; Sticky Placement
        </p>
      </div>
    </div>
  );
}
