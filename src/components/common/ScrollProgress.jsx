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
      {/* Top Gradient Scroll Bar (Bluebonnet to Blaze Orange) */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] z-50 bg-[#E5DCB8]/50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#1400C3] via-[#7B00C3] to-[#FF4E02] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(255,78,2,0.8)]"
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      {/* Floating Scroll To Top in Blaze Orange */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-[#FF4E02] hover:bg-[#E04200] text-white shadow-2xl shadow-[#FF4E02]/40 border-2 border-white transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer animate-fade-in"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
        </button>
      )}
    </>
  );
}
