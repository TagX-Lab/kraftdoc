import React from "react";

/**
 * KraftDoc 3D Isometric Cube Monogram Icon
 * High-precision vector SVG inspired by the Miscreant Studio brutalist isometric cube monogram.
 * Left face = 'K' (Kraft)
 * Right face = 'D' (Doc)
 * Top face = Diamond craft facet
 * Center = #FF3E18 red-orange perspective cuts
 */
export function KraftDocCubeIcon({ className = "w-10 h-10", size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="KraftDoc 3D Isometric Cube Logo"
    >
      {/* Background container polygon / hexagon base */}
      <polygon
        points="50,6 92,30 92,72 50,96 8,72 8,30"
        fill="#0C0C0C"
      />

      {/* TOP DIAMOND / CRAFT FACET */}
      <polygon
        points="50,9 88,31 50,52 12,31"
        fill="#FFFFFF"
      />
      {/* Top inner cutout */}
      <polygon
        points="50,19 74,33 50,46 26,33"
        fill="#0C0C0C"
      />
      {/* Top red-orange accent center */}
      <polygon
        points="50,24 64,32 50,40 36,32"
        fill="#FF3E18"
      />

      {/* LEFT ISOMETRIC FACE -> THE 'K' */}
      {/* Left face backing */}
      <polygon
        points="10,34 47,55 47,94 10,72"
        fill="#0C0C0C"
      />
      {/* K vertical stem */}
      <polygon
        points="14,37 23,42 23,83 14,77"
        fill="#FFFFFF"
      />
      {/* K upper diagonal arm */}
      <polygon
        points="24,62 39,49 46,53 28,68"
        fill="#FFFFFF"
      />
      {/* K lower diagonal leg */}
      <polygon
        points="28,67 46,87 38,91 24,73"
        fill="#FFFFFF"
      />
      {/* K inner red-orange accent groove */}
      <polygon
        points="24,63 28,67 24,71"
        fill="#FF3E18"
      />

      {/* RIGHT ISOMETRIC FACE -> THE 'D' */}
      {/* Right face backing */}
      <polygon
        points="53,55 90,34 90,72 53,94"
        fill="#0C0C0C"
      />
      {/* D Outer Solid Shape */}
      <path
        d="M55,56 L73,45 C82,40 88,44 88,52 L88,62 C88,71 82,78 73,83 L55,93 Z"
        fill="#FFFFFF"
      />
      {/* D Inner Negative Cutout */}
      <path
        d="M62,63 L71,58 C75,55 79,57 79,62 L79,67 C79,72 75,76 71,78 L62,83 Z"
        fill="#0C0C0C"
      />
      {/* D Red-Orange Inner Highlight */}
      <path
        d="M63,65 L70,61 C72,59 74,61 74,63 L74,66 C74,69 72,71 70,72 L63,76 Z"
        fill="#FF3E18"
      />

      {/* Center perspective junction crease in #FF3E18 */}
      <line x1="50" y1="52" x2="50" y2="95" stroke="#FF3E18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Full KraftDoc Brand Lockup: 3D Isometric Cube Icon + Bebas Neue Wordmark
 */
export function KraftDocLogo({ onNavigate, className = "" }) {
  return (
    <div
      onClick={() => onNavigate && onNavigate("home")}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      <div className="relative transform group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
        <KraftDocCubeIcon className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-[0_4px_12px_rgba(255,62,24,0.35)]" />
      </div>

      <div className="flex items-center gap-2">
        <span className="font-comic text-3xl sm:text-4xl text-white tracking-wider uppercase leading-none group-hover:text-[#FF3E18] transition-colors">
          KRAFTDOC
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF3E18] text-white shadow-sm">
          FREE
        </span>
      </div>
    </div>
  );
}

export default KraftDocLogo;
