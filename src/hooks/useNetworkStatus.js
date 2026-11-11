import { useState, useEffect, useCallback } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [isServerBusy, setIsServerBusy] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * Ping static asset or root to verify if server / CDN is responsive
   */
  const checkServerStatus = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return { online: false, busy: false };
    }

    try {
      // Fetch small static file with cache-busting timestamp
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`/favicon.svg?_t=${Date.now()}`, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (response.status === 503 || response.status === 504 || response.status === 429) {
        setIsServerBusy(true);
        setLastChecked(new Date());
        return { online: true, busy: true, status: response.status };
      }

      setIsServerBusy(false);
      setIsOnline(true);
      setLastChecked(new Date());
      return { online: true, busy: false, status: response.status };
    } catch (err) {
      // If fetch aborted or failed while browser reports online, server might be down / busy
      if (err.name === "AbortError" || !navigator.onLine) {
        setIsServerBusy(true);
      }
      setLastChecked(new Date());
      return { online: navigator.onLine, busy: true };
    }
  }, []);

  return {
    isOnline,
    isServerBusy,
    setIsServerBusy,
    checkServerStatus,
    lastChecked,
  };
}
