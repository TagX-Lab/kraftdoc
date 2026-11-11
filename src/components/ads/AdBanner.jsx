import React, { useEffect } from "react";
import { adConfig } from "../../config/adConfig";

/**
 * Responsive Google AdSense Banner Component
 * Automatically switches between live Google AdSense and development placeholder.
 */
export default function AdBanner({ slotId = adConfig.slots.topBanner, format = "auto", className = "" }) {
  useEffect(() => {
    if (adConfig.enabled) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        // Suppress adsbygoogle duplicate push errors
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
      className={`w-full my-4 p-4 rounded-xl border border-dashed border-slate-700/60 bg-slate-800/30 flex flex-col items-center justify-center text-center transition-all ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Google AdSense Ready
      </div>
      <p className="text-xs text-slate-400 mt-1">
        Banner Slot #{slotId} &bull; Responsive 728x90 / 320x50
      </p>
    </div>
  );
}
