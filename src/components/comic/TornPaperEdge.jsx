import React from "react";

/**
 * Authentic Ripped / Torn Paper SVG Edges
 * Replicating the handcrafted zine / comic book cut-paper aesthetics
 */

// Torn paper edge where the bottom section's fill tears across the top
export function TornPaperTop({ fill = "#FFFFFF", className = "" }) {
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 md:h-16 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 60L0 28L45 36L92 20L150 42L210 18L270 38L340 14L410 44L480 22L550 40L620 16L700 46L780 24L850 42L920 18L990 44L1060 20L1130 38L1200 16L1270 42L1340 22L1395 38L1440 20L1440 60H0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// Torn paper edge where the top section's fill tears across into the bottom
export function TornPaperBottom({ fill = "#FFFFFF", className = "" }) {
  return (
    <div className={`w-full overflow-hidden leading-none select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 md:h-16 block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L0 34L45 18L92 42L150 20L210 44L270 16L340 42L410 18L480 40L550 22L620 44L700 18L780 40L850 22L920 44L990 18L1060 42L1130 20L1200 44L1270 18L1340 40L1395 24L1440 38L1440 0H0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

// Authentic Translucent Scotch Tape Strip
export function ScotchTape({ className = "", rotate = "-4deg", width = "w-24", height = "h-7" }) {
  return (
    <div
      style={{ transform: `rotate(${rotate})` }}
      className={`scotch-tape ${width} ${height} rounded-[2px] ${className}`}
      aria-hidden="true"
    />
  );
}
