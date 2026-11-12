import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, ShieldCheck, X } from "lucide-react";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [dismissed, setDismissed] = useState(false);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    let timer = null;

    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
      setShowReconnectedToast(true);
      timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
      setShowReconnectedToast(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Reconnected Toast Notification
  if (showReconnectedToast) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md animate-fade-in transition-all">
        <Wifi className="w-4 h-4 text-white stroke-[2.5]" />
        <span>Internet connection restored! You are back online.</span>
      </div>
    );
  }

  // If user is online or dismissed offline banner, don't show
  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-[#141414] text-white border-b-2 border-[#FF3E18] px-4 py-3 shadow-2xl relative z-50 animate-slide-down"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF3E18] text-white flex items-center justify-center shrink-0 shadow-sm">
            <WifiOff className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-comic text-base tracking-wider text-white uppercase">
                YOU ARE CURRENTLY OFFLINE
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                100% In-Browser Privacy
              </span>
            </div>
            <p className="text-xs text-gray-300 font-medium">
              Don&apos;t worry! KraftDoc runs locally on your device. You can keep resizing photos, compressing images, and merging PDFs without internet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white/90">
            Offline Safe Mode Active
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss offline banner"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
