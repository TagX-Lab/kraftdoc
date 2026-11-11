import React, { useEffect } from "react";
import { adConfig } from "../../config/adConfig";

export default function AdSidebar({ slotId = adConfig.slots.sidebarSticky, className = "" }) {
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
        aria-label="Sidebar Advertisement"
        className={`hidden lg:block w-72 shrink-0 ${className}`}
      >
        <div className="sticky top-28 rounded-3xl bg-white border border-[#D6CA9E] p-2.5 overflow-hidden shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-widest text-[#6B627F]/60 uppercase mb-2">
            Advertisement
          </span>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minWidth: "250px", minHeight: "600px" }}
            data-ad-client={adConfig.publisherId}
            data-ad-slot={slotId}
            data-ad-format="vertical"
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
      aria-label="Sidebar Advertisement Placeholder"
      className={`hidden lg:block w-72 shrink-0 ${className}`}
    >
      <div className="sticky top-28 rounded-3xl border border-dashed border-[#D6CA9E] bg-white/70 p-6 flex flex-col items-center justify-center text-center min-h-[500px] shadow-sm">
        <span className="text-[10px] font-bold tracking-widest text-[#6B627F]/60 uppercase mb-2">
          Advertisement
        </span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1400C3]/10 text-[11px] font-black tracking-wider text-[#1400C3] uppercase mb-3">
          Sidebar Ad Slot
        </div>
        <p className="text-sm text-[#1400C3] font-bold">
          High CTR Skyscraper (Sticky)
        </p>
        <p className="text-xs text-[#6B627F] font-medium mt-2">
          Tucked non-intrusively in right gutter for desktop screens
        </p>
      </div>
    </aside>
  );
}
