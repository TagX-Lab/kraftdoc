import React from "react";

/**
 * Handcrafted Boutique Vector Illustrations
 * Pure Human-Made SVG Graphics with 3D Depth, Gradients & Shadows
 */

export function HeroShowcaseIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 380 340"
      className={`w-full h-auto drop-shadow-2xl select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Package Gradients */}
        <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A8" />
          <stop offset="50%" stopColor="#FED867" />
          <stop offset="100%" stopColor="#F5BF38" />
        </linearGradient>

        <linearGradient id="blueBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F00E0" />
          <stop offset="100%" stopColor="#1400C3" />
        </linearGradient>

        <linearGradient id="orangeBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B2B" />
          <stop offset="100%" stopColor="#FF4E02" />
        </linearGradient>

        <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1400C3" floodOpacity="0.18" />
        </filter>

        <filter id="floatShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Floating 3D Sparkles in Background */}
      <path d="M45 50L48 38L51 50L63 53L51 56L48 68L45 56L33 53Z" fill="#FF4E02" />
      <path d="M335 45L337 35L339 45L349 47L339 49L337 59L335 49L325 47Z" fill="#1400C3" />
      <path d="M345 270L347 262L349 270L357 272L349 274L347 282L345 274L337 272Z" fill="#FF4E02" />

      {/* Main 3D Pouch / Package Body */}
      <g filter="url(#softShadow)">
        {/* Package Outline & Depth */}
        <rect
          x="65"
          y="35"
          width="250"
          height="270"
          rx="32"
          fill="url(#pouchGrad)"
          stroke="#1400C3"
          strokeWidth="3.5"
        />

        {/* Top Crimped Seal / Header */}
        <path
          d="M65 65C65 48.4315 78.4315 35 95 35H285C301.569 35 315 48.4315 315 65V75H65V65Z"
          fill="#F5BA2A"
          stroke="#1400C3"
          strokeWidth="3.5"
        />

        {/* Top Hang Hole */}
        <rect x="165" y="47" width="50" height="12" rx="6" fill="#F8F2D8" stroke="#1400C3" strokeWidth="2.5" />

        {/* Brand Tag Top Left */}
        <rect x="85" y="90" width="82" height="24" rx="12" fill="url(#blueBadge)" />
        <text x="126" y="106" fill="#FFF" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          DOCUPIX
        </text>

        {/* Version Badge Top Right */}
        <rect x="225" y="90" width="65" height="24" rx="12" fill="url(#orangeBadge)" />
        <text x="257" y="106" fill="#FFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          SUITE V2
        </text>

        {/* Big Chunky Title on Package */}
        <text
          x="190"
          y="155"
          fill="#1400C3"
          fontSize="36"
          fontWeight="900"
          letterSpacing="-1"
          textAnchor="middle"
          fontFamily="Lilita One, Impact, sans-serif"
        >
          DOCUPIX
        </text>
        <text
          x="190"
          y="175"
          fill="#3B3355"
          fontSize="10"
          fontWeight="800"
          letterSpacing="2.5"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          IN-BROWSER UTILITY ENGINE
        </text>

        {/* Center White Plaque */}
        <rect
          x="88"
          y="190"
          width="204"
          height="82"
          rx="20"
          fill="#FFF"
          stroke="#1400C3"
          strokeWidth="2.5"
        />

        {/* Center Shield Icon in Blaze Orange */}
        <circle cx="130" cy="231" r="22" fill="#FF4E02" />
        <path d="M124 231L128 235L137 226" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Plaque Description */}
        <text x="162" y="225" fill="#1400C3" fontSize="13" fontWeight="900" fontFamily="sans-serif">
          100% Client-Side
        </text>
        <text x="162" y="242" fill="#6B627F" fontSize="11" fontWeight="700" fontFamily="sans-serif">
          No Cloud Storage
        </text>

        {/* Bottom Bar Info */}
        <text x="95" y="292" fill="#1400C3" fontSize="11" fontWeight="900" fontFamily="sans-serif">
          ★ High-Speed RAM
        </text>
        <text x="285" y="292" fill="#FF4E02" fontSize="11" fontWeight="900" textAnchor="end" fontFamily="sans-serif">
          Free Forever
        </text>
      </g>

      {/* Floating 3D Polaroid Photo Sticker (Top Right) */}
      <g filter="url(#floatShadow)" transform="rotate(8 290 85)">
        <rect x="270" y="60" width="75" height="90" rx="12" fill="#FFF" stroke="#1400C3" strokeWidth="2.5" />
        <rect x="277" y="67" width="61" height="60" rx="8" fill="#E8F4FD" />
        <circle cx="307" cy="88" r="14" fill="#FF4E02" />
        <path d="M288 120C293 108 303 106 312 114L322 104L335 120H288Z" fill="#1400C3" />
        <text x="307" y="142" fill="#1400C3" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          PHOTO
        </text>
      </g>

      {/* Floating 3D Document Stamp (Bottom Left) */}
      <g filter="url(#floatShadow)" transform="rotate(-6 55 240)">
        <rect x="25" y="210" width="75" height="90" rx="12" fill="#FFF" stroke="#1400C3" strokeWidth="2.5" />
        <rect x="32" y="218" width="61" height="60" rx="8" fill="#FFEAE3" />
        <path d="M44 235H81M44 245H75M44 255H68" stroke="#FF4E02" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="265" r="10" fill="#1400C3" />
        <text x="70" y="269" fill="#FFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">✓</text>
        <text x="62" y="292" fill="#FF4E02" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
          PDF DOC
        </text>
      </g>
    </svg>
  );
}

export function PhotoResizerIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      <defs>
        <linearGradient id="photoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8E0" />
          <stop offset="100%" stopColor="#FFE8A3" />
        </linearGradient>
      </defs>
      {/* Photo Frame */}
      <rect x="42" y="14" width="76" height="92" rx="14" fill="url(#photoBg)" stroke="#1400C3" strokeWidth="2.5" />
      {/* Avatar Silhouette */}
      <circle cx="80" cy="48" r="16" fill="#FF4E02" />
      <path d="M58 88C61 72 72 70 80 70C88 70 99 72 102 88H58Z" fill="#1400C3" />
      {/* Crop Corner Brackets */}
      <path d="M35 25V18H42" stroke="#FF4E02" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 25V18H118" stroke="#FF4E02" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 95V102H42" stroke="#FF4E02" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 95V102H118" stroke="#FF4E02" strokeWidth="3" strokeLinecap="round" />
      {/* Dimension Tag */}
      <rect x="52" y="92" width="56" height="18" rx="9" fill="#1400C3" />
      <text x="80" y="104" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        200 × 230 px
      </text>
    </svg>
  );
}

export function CompressorIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      <defs>
        <linearGradient id="compBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF8EE" />
          <stop offset="100%" stopColor="#C4EFCF" />
        </linearGradient>
      </defs>
      {/* Squeezed Photo */}
      <rect x="46" y="20" width="68" height="80" rx="12" fill="url(#compBg)" stroke="#1400C3" strokeWidth="2.5" />
      <circle cx="80" cy="50" r="14" fill="#1400C3" />
      <path d="M58 84C64 74 74 72 80 78L88 70L102 84H58Z" fill="#10B981" />
      {/* Mechanical Compression Vices / Arrows */}
      <g stroke="#FF4E02" strokeWidth="3" strokeLinecap="round">
        <path d="M22 60H38M32 54L38 60L32 66" />
        <path d="M138 60H122M128 54L122 60L128 66" />
      </g>
      {/* Savings Badge */}
      <circle cx="106" cy="28" r="16" fill="#FF4E02" stroke="#FFF" strokeWidth="2" />
      <text x="106" y="32" fill="#FFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        -85%
      </text>
    </svg>
  );
}

export function ImagesToPdfIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      {/* Back photo */}
      <rect x="32" y="22" width="60" height="72" rx="10" fill="#FFEFEA" stroke="#1400C3" strokeWidth="2" transform="rotate(-10 32 22)" />
      {/* Middle photo */}
      <rect x="52" y="16" width="60" height="72" rx="10" fill="#FFF8E0" stroke="#1400C3" strokeWidth="2" transform="rotate(6 52 16)" />
      {/* Front PDF Binder Folder */}
      <rect x="68" y="24" width="64" height="80" rx="12" fill="#FF4E02" stroke="#1400C3" strokeWidth="2.5" />
      <path d="M68 36H132" stroke="#1400C3" strokeWidth="2" />
      {/* PDF Label */}
      <rect x="82" y="52" width="36" height="24" rx="6" fill="#FFF" />
      <text x="100" y="68" fill="#FF4E02" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        PDF
      </text>
      {/* Check icon */}
      <circle cx="120" cy="92" r="10" fill="#1400C3" />
      <path d="M116 92L119 95L124 89" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MergeSplitIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      {/* Left Document */}
      <rect x="22" y="24" width="50" height="72" rx="10" fill="#EBF2FD" stroke="#1400C3" strokeWidth="2.5" />
      <path d="M32 40H62M32 50H55M32 60H50" stroke="#1400C3" strokeWidth="2.5" strokeLinecap="round" />
      <text x="47" y="82" fill="#1400C3" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        PART 1
      </text>

      {/* Right Document */}
      <rect x="88" y="24" width="50" height="72" rx="10" fill="#FFEAE3" stroke="#FF4E02" strokeWidth="2.5" />
      <path d="M98 40H128M98 50H121M98 60H116" stroke="#FF4E02" strokeWidth="2.5" strokeLinecap="round" />
      <text x="113" y="82" fill="#FF4E02" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        PART 2
      </text>

      {/* Center Golden Scissors Splitting/Merging */}
      <circle cx="75" cy="50" r="14" fill="#FFDF6D" stroke="#1400C3" strokeWidth="2" />
      <path d="M70 45L80 55M70 55L80 45" stroke="#1400C3" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="68" cy="43" r="3.5" fill="#FF4E02" />
      <circle cx="68" cy="57" r="3.5" fill="#FF4E02" />
    </svg>
  );
}

export function ConverterIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      {/* Central Rotating Rings */}
      <circle cx="80" cy="60" r="36" stroke="#E5DCB8" strokeWidth="3" strokeDasharray="4 4" />
      <circle cx="80" cy="60" r="18" fill="#FFF" stroke="#1400C3" strokeWidth="2" />
      <path d="M74 60L78 56V64L86 60" stroke="#FF4E02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Orbiting Chip 1: WEBP */}
      <g transform="translate(62, 10)">
        <rect width="36" height="20" rx="10" fill="#10B981" />
        <text x="18" y="14" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          WEBP
        </text>
      </g>

      {/* Orbiting Chip 2: PNG */}
      <g transform="translate(108, 64)">
        <rect width="36" height="20" rx="10" fill="#1400C3" />
        <text x="18" y="14" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          PNG
        </text>
      </g>

      {/* Orbiting Chip 3: JPG */}
      <g transform="translate(16, 64)">
        <rect width="36" height="20" rx="10" fill="#FF4E02" />
        <text x="18" y="14" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          JPG
        </text>
      </g>
    </svg>
  );
}

export function OrganizerIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full max-h-28 object-contain" fill="none">
      {/* Background Page */}
      <rect x="36" y="28" width="52" height="68" rx="10" fill="#FFF" stroke="#E5DCB8" strokeWidth="2" transform="rotate(-14 36 28)" />
      {/* Center Rotating Page */}
      <rect x="54" y="20" width="56" height="74" rx="12" fill="#FFF" stroke="#1400C3" strokeWidth="2.5" />
      <path d="M64 36H98M64 46H90M64 56H84" stroke="#1400C3" strokeWidth="2.5" strokeLinecap="round" />
      {/* Circular 90 Degree Rotation Arrow */}
      <path
        d="M102 32C118 42 122 64 112 80C108 86 100 90 92 92"
        stroke="#FF4E02"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M92 92L99 85M92 92L97 99" stroke="#FF4E02" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rotation Degree Tag */}
      <rect x="68" y="74" width="28" height="16" rx="8" fill="#FF4E02" />
      <text x="82" y="85" fill="#FFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
        90°
      </text>
    </svg>
  );
}
