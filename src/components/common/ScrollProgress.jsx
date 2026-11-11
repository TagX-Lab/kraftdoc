import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollHeight > 0) {
        const percent = (scrollTop / scrollHeight) * 100;
        setScrollPercentage(percent);
      }

      setShowScrollTop(scrollTop > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Gradient Scroll Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-slate-900/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      {/* Floating Scroll To Top Pill */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 backdrop-blur-md border border-indigo-400/30 transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer animate-fade-in"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </>
  );
}
