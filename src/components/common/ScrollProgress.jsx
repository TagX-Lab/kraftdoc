import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;

          if (scrollHeight > 0) {
            const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
            setScrollPercentage(percent);
          } else {
            setScrollPercentage(0);
          }

          setShowScrollTop(scrollTop > 280);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SVG circular ring calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercentage / 100) * circumference;

  return (
    <>
      {/* Laser Top Scroll Bar with Neon Glow */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[999] bg-white/5 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#FF3E18] via-[#FF6B00] to-[#FFE600] transition-all duration-150 ease-out relative shadow-[0_0_12px_rgba(255,62,24,0.9),0_0_24px_rgba(255,107,0,0.5)]"
          style={{ width: `${scrollPercentage}%` }}
        >
          {/* Laser Tip Spark */}
          {scrollPercentage > 0 && scrollPercentage < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF] -mr-1" />
          )}
        </div>
      </div>

      {/* Floating Scroll-To-Top Button with Circular Progress Ring */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title={`Scroll to top (${Math.round(scrollPercentage)}%)`}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0C0C0C] hover:bg-[#141414] text-white shadow-2xl shadow-black/80 border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer flex items-center justify-center animate-fade-in"
        >
          {/* SVG Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-white/10"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-[#FF3E18] transition-all duration-150 ease-out"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Arrow Icon */}
          <ArrowUp className="w-5 h-5 text-white group-hover:text-[#FF3E18] group-hover:-translate-y-0.5 transition-all stroke-[2.5]" />
        </button>
      )}
    </>
  );
}
