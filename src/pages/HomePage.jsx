import React from "react";
import {
  UserCheck,
  Minimize2,
  FileText,
  Layers,
  RefreshCw,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Award,
  Smile,
  Cpu,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";
import ScrollReveal from "../components/common/ScrollReveal";

function DoodleRays({ className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-6 h-6 stroke-current ${className}`}
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M16 4v6" />
      <path d="M25 7l-4.5 4.5" />
      <path d="M7 7l4.5 4.5" />
    </svg>
  );
}

export default function HomePage({ onNavigate }) {
  // 6 Circular Badges Strip (matching the Happies 6-icon bar)
  const pillBadges = [
    {
      icon: ShieldCheck,
      title: "Zero Uploads",
      subtitle: "100% Client-Side",
    },
    {
      icon: UserCheck,
      title: "Govt Exam Ready",
      subtitle: "TNPSC & UPSC Presets",
    },
    {
      icon: Minimize2,
      title: "Lossless Shrink",
      subtitle: "Up to 90% Saved",
    },
    {
      icon: Award,
      title: "No Watermarks",
      subtitle: "Clean Free Output",
    },
    {
      icon: Zap,
      title: "Native RAM Speed",
      subtitle: "WebAssembly Engine",
    },
    {
      icon: Smile,
      title: "TAGX Labs™",
      subtitle: "Pure Human-Made",
    },
  ];

  // The 6 Handcrafted Tool Cards (matching the Happies favorite snacks grid)
  const toolCards = [
    {
      id: "exam-resizer",
      tag: "Bestseller",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Govt Exam Resizer",
      desc: "Exact pixel dimensions & maximum KB compressor for TNPSC, SSC, UPSC, and IBPS applications.",
      badge: "TNPSC / UPSC 200x230",
      accentColor: "#FF4E02",
      icon: UserCheck,
      pillPrice: "Free Forever",
    },
    {
      id: "compress-image",
      tag: "Popular",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EBF7ED] border-[#C2E7C9]",
      title: "Image Compressor",
      desc: "Bulk shrink JPG, PNG, and WebP files up to 90% without visible quality degradation.",
      badge: "-85% KB Savings",
      accentColor: "#1400C3",
      icon: Minimize2,
      pillPrice: "Free Forever",
    },
    {
      id: "images-to-pdf",
      tag: "Essential",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Images to PDF",
      desc: "Merge multiple camera photos into clean A4 or Letter PDFs with custom margins and layout.",
      badge: "Instant A4 Merge",
      accentColor: "#FF4E02",
      icon: FileText,
      pillPrice: "Free Forever",
    },
    {
      id: "pdf-merge-split",
      tag: "Top Utility",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EAF2FD] border-[#C2D8FA]",
      title: "PDF Merge & Split",
      desc: "Combine multiple documents or extract custom page ranges (e.g. 1-3, 5) with zero cloud upload.",
      badge: "Multi-Doc Engine",
      accentColor: "#1400C3",
      icon: Layers,
      pillPrice: "Free Forever",
    },
    {
      id: "image-converter",
      tag: "New",
      tagColor: "bg-emerald-600 text-white",
      bgClass: "bg-[#F3ECFB] border-[#D8C4F4]",
      title: "Format Converter",
      desc: "Bulk convert images across next-gen WebP, lossless PNG, and universal JPEG in 1-click.",
      badge: "WebP / PNG / JPG",
      accentColor: "#1400C3",
      icon: RefreshCw,
      pillPrice: "Free Forever",
    },
    {
      id: "pdf-organizer",
      tag: "Organize",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF0D9] border-[#F7D8A8]",
      title: "PDF Page Organizer",
      desc: "Rotate pages 90°/180° and delete unwanted pages visually with instantaneous preview.",
      badge: "Rotate & Delete",
      accentColor: "#FF4E02",
      icon: RotateCw,
      pillPrice: "Free Forever",
    },
  ];

  const faqs = [
    {
      q: "Are my uploaded photos and documents safe?",
      a: "Yes, 100%! DocuPix uses HTML5 Canvas and WebAssembly to process your images and PDFs directly inside your own web browser. Your files are NEVER uploaded to any external server or cloud.",
    },
    {
      q: "How does the Govt Exam Photo Resizer work?",
      a: "It includes pre-configured dimension and file-size specifications for TNPSC, SSC, UPSC, IBPS, and GATE. It automatically crops and compresses your photo or signature to meet official requirements in 1 click.",
    },
    {
      q: "Is DocuPix completely free to use?",
      a: "Yes! All tools are 100% free with no file limits, no registration required, and no hidden subscriptions.",
    },
    {
      q: "Can I merge multiple large PDF files?",
      a: "Yes, you can merge multiple PDF documents without restriction. All merging happens instantly inside your browser using client-side JavaScript.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 relative overflow-hidden pb-12">
      {/* Background Ambient Floating Glow Lights */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#1400C3]/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-96 right-1/4 w-[450px] h-[450px] bg-[#FF4E02]/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-reverse" />

      {/* ========================================================================= */}
      {/* HERO SECTION: Matching the Happies Yellow Hero with Hero Product Card   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ScrollReveal animation="fade-up">
          <div className="relative rounded-[36px] sm:rounded-[44px] bg-[#F7E7A0] border-2 border-[#EAD585] p-6 sm:p-12 lg:p-16 overflow-hidden shadow-xl shadow-[#1400C3]/5">
            {/* Decorative background doodles */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#FFF5C0]/60 blur-2xl pointer-events-none" />
            <div className="absolute bottom-4 left-1/3 w-72 h-72 rounded-full bg-[#FF4E02]/10 blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Big Handcrafted Headline */}
                <h1 className="font-display text-5xl sm:text-7xl lg:text-[76px] leading-[0.95] text-[#1400C3] tracking-tight uppercase">
                  PROCESS SMARTER.
                  <span className="block mt-2 text-[#FF4E02]">
                    <span className="marker-highlight-yellow text-[#1400C3]">LIVE BRIGHTER.</span>
                  </span>
                </h1>

                {/* Friendly Subtitle */}
                <p className="text-sm sm:text-base lg:text-lg text-[#3B3355] font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Plant-based privacy with big performance and clean code. Compress photos, resize for government exams (TNPSC, UPSC, SSC), and merge PDFs without uploading a single byte to cloud servers.
                </p>

                {/* CTA Buttons in Pill Form */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("exam-resizer")}
                    className="px-8 py-4 rounded-full font-black bg-[#1400C3] hover:bg-[#0E008F] text-white shadow-xl shadow-[#1400C3]/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-1 cursor-pointer active:scale-95 text-sm sm:text-base group"
                  >
                    <span>Govt Exam Resizer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate("compress-image")}
                    className="px-7 py-4 rounded-full font-black bg-white hover:bg-[#FFFDF5] text-[#1400C3] border-2 border-[#1400C3] shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-1 cursor-pointer active:scale-95 text-sm sm:text-base"
                  >
                    <span>Compress Images</span>
                  </button>
                </div>

                {/* Studio Attribution */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-[#6B627F]">
                  <span>Engineered with pure craftsmanship by</span>
                  <a
                    href={siteConfig.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-black text-[#1400C3] hover:text-[#FF4E02] underline transition-colors"
                  >
                    {siteConfig.company.name} ↗
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Showcase Visual (The "Snack Bag" Equivalent) */}
              <div className="lg:col-span-5 flex justify-center relative">
                <div className="relative w-full max-w-sm sm:max-w-md">
                  {/* Decorative Hand-drawn Rays */}
                  <DoodleRays className="absolute -top-6 -left-4 text-[#FF4E02] animate-bounce" />
                  <DoodleRays className="absolute -bottom-6 -right-4 text-[#1400C3] rotate-180" />

                  {/* Main Hero Product Bag / Package Card */}
                  <div className="relative bg-[#FFDF6D] border-3 border-[#1400C3] rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-[#1400C3]/15 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1400C3] text-white">
                        DOCUPIX SUITE
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF4E02] text-white">
                        V2.0 STABLE
                      </span>
                    </div>

                    <div className="space-y-1 text-center py-4">
                      <h3 className="font-display text-4xl sm:text-5xl text-[#1400C3] tracking-tight uppercase">
                        DOCUPIX
                      </h3>
                      <p className="text-xs font-extrabold text-[#3B3355] tracking-widest uppercase">
                        In-Browser Utility Engine
                      </p>
                    </div>

                    {/* Central Badge Emblem */}
                    <div className="my-4 p-4 rounded-2xl bg-white border-2 border-[#1400C3] text-center space-y-2 shadow-inner">
                      <div className="w-10 h-10 rounded-full bg-[#FF4E02] text-white mx-auto flex items-center justify-center font-black shadow-sm">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-xs font-black text-[#1400C3] uppercase tracking-wide">
                        100% Device Execution
                      </div>
                      <p className="text-[11px] text-[#6B627F] font-semibold">
                        TNPSC &bull; UPSC &bull; SSC &bull; WebP &bull; PDF
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-black text-[#1400C3] pt-2">
                      <span>Zero Uploads</span>
                      <span className="text-[#FF4E02]">Unlimited Free</span>
                    </div>
                  </div>

                  {/* Floating Sticker 1: Saved 88% */}
                  <div className="absolute -top-3 -right-3 sm:-right-6 bg-white border-2 border-[#1400C3] rounded-2xl p-2.5 shadow-xl transform rotate-6 animate-pulse">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#6B627F]">
                      Compression
                    </div>
                    <div className="text-sm font-black text-[#FF4E02]">
                      Saved 88% KB
                    </div>
                  </div>

                  {/* Floating Sticker 2: TNPSC Approved */}
                  <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white border-2 border-[#1400C3] rounded-2xl p-2.5 shadow-xl transform -rotate-6">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#1400C3]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>TNPSC 200x230 Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================================= */}
      {/* 6 CIRCULAR FEATURE BADGES STRIP (Matching the Happies 6-icon Row)        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {pillBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-4 rounded-3xl bg-white border-2 border-[#E5DCB8] hover:border-[#1400C3] hover:shadow-lg transition-all duration-300 group hover:-translate-y-1.5"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F8F2D8] border border-[#D6CA9E] flex items-center justify-center text-[#1400C3] group-hover:bg-[#FF4E02] group-hover:text-white group-hover:border-[#FF4E02] transition-colors mb-3 shadow-xs">
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-[#1400C3] leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#6B627F] font-semibold mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* Top Banner Ad between sections */}
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <AdBanner slotId="1000000001" />
        </ScrollReveal>
      </div>

      {/* ========================================================================= */}
      {/* "OUR FAVORITES / TOOLS YOU'LL LOVE" COLOR-BLOCK CARDS SECTION             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="rounded-[36px] sm:rounded-[44px] bg-[#F7EDBE] border-2 border-[#E6D799] p-6 sm:p-10 lg:p-12 shadow-sm">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF4E02] block mb-1">
                  OUR FAVORITES
                </span>
                <h2 className="font-display text-3xl sm:text-5xl text-[#1400C3] tracking-tight uppercase">
                  TOOLS YOU&apos;LL LOVE
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("exam-resizer")}
                className="text-xs sm:text-sm font-black text-[#1400C3] hover:text-[#FF4E02] flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span>View all tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
              </button>
            </div>

            {/* Grid of 6 Distinct Color-Blocked Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolCards.map((tool) => {
                const Icon = tool.icon;

                return (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate(tool.id)}
                    className={`human-card rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl ${tool.bgClass}`}
                  >
                    <div>
                      {/* Top Tag & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${tool.tagColor}`}
                        >
                          {tool.tag}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-[#1400C3] border border-[#1400C3]/15">
                          {tool.badge}
                        </span>
                      </div>

                      {/* Tool Graphic Showcase Box */}
                      <div className="my-5 p-6 rounded-2xl bg-white/90 border border-black/5 flex flex-col items-center justify-center text-center space-y-2 shadow-inner min-h-[140px] group">
                        <div className="w-14 h-14 rounded-2xl bg-[#1400C3] text-white flex items-center justify-center shadow-md shadow-[#1400C3]/20 group-hover:scale-110 group-hover:bg-[#FF4E02] transition-all duration-300">
                          <Icon className="w-7 h-7 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-black text-[#1400C3] tracking-tight pt-1">
                          In-Browser Processing
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-display text-2xl text-[#1400C3] tracking-tight mb-1.5">
                        {tool.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#3B3355] font-semibold leading-relaxed">
                        {tool.desc}
                      </p>
                    </div>

                    {/* Bottom Action Pill */}
                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                      <span className="text-xs font-black text-[#1400C3]">
                        {tool.pillPrice}
                      </span>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full font-black text-xs bg-[#1400C3] hover:bg-[#FF4E02] text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>open tool</span>
                        <span className="text-sm font-bold">+</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Middle Banner Ad */}
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <AdBanner slotId="1000000002" />
        </ScrollReveal>
      </div>

      {/* ========================================================================= */}
      {/* "GOOD INGREDIENTS. GREAT TASTE." (3 Exploded Feature Columns with Rays)   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="p-8 sm:p-14 rounded-[36px] sm:rounded-[44px] bg-white border-2 border-[#E5DCB8] shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Headline */}
              <div className="lg:col-span-5 space-y-4">
                <h2 className="font-display text-4xl sm:text-6xl text-[#1400C3] leading-[0.95] tracking-tight uppercase">
                  ZERO CLOUD.
                  <span className="block mt-2 text-[#FF4E02]">
                    <span className="marker-highlight text-[#1400C3]">PURE PRIVACY.</span>
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#3B3355] font-semibold leading-relaxed">
                  Every photo crop, signature resize, and PDF merger is computed in local browser memory using Canvas &amp; WebAssembly. No files ever leave your machine.
                </p>
                <div className="pt-2">
                  <a
                    href={siteConfig.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider bg-[#1400C3] text-white hover:bg-[#FF4E02] transition-all shadow-md"
                  >
                    <span>Discover TAGX Labs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right: 3 Feature Items with Doodle Rays */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {/* Feature 1 */}
                <div className="p-5 rounded-3xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-3 relative group hover:-translate-y-1 transition-all">
                  <DoodleRays className="mx-auto text-[#FF4E02]" />
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D6CA9E] text-[#1400C3] flex items-center justify-center mx-auto shadow-xs">
                    <Cpu className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-xs sm:text-sm text-[#1400C3] uppercase tracking-wide">
                    IN-BROWSER RAM
                  </h4>
                  <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                    Zero network transmission. Your files process exclusively in device RAM.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="p-5 rounded-3xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-3 relative group hover:-translate-y-1 transition-all">
                  <DoodleRays className="mx-auto text-[#1400C3]" />
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D6CA9E] text-[#FF4E02] flex items-center justify-center mx-auto shadow-xs">
                    <Zap className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-xs sm:text-sm text-[#1400C3] uppercase tracking-wide">
                    INSTANT 60 FPS
                  </h4>
                  <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                    No waiting in cloud queues or server timeouts. Zero network latency.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="p-5 rounded-3xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-3 relative group hover:-translate-y-1 transition-all">
                  <DoodleRays className="mx-auto text-[#FF4E02]" />
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D6CA9E] text-[#1400C3] flex items-center justify-center mx-auto shadow-xs">
                    <Smile className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-xs sm:text-sm text-[#1400C3] uppercase tracking-wide">
                    TAGX CRAFT
                  </h4>
                  <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                    Human-crafted software by the studio behind MousePilot™.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================================= */}
      {/* BOTTOM SHOWCASE CARD (Matching "CHEESY, CRUNCHY, IRRESISTIBLE")           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="rounded-[36px] sm:rounded-[44px] bg-[#FFF0D9] border-2 border-[#F7D8A8] p-8 sm:p-12 lg:p-16 overflow-hidden relative shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Visual Mini-Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1400C3] shadow-xl max-w-sm w-full text-center space-y-3">
                  <DoodleRays className="absolute -top-4 -right-4 text-[#FF4E02]" />
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#1400C3] text-white">
                    TNPSC &bull; UPSC &bull; SSC
                  </span>
                  <h4 className="font-display text-3xl text-[#1400C3] uppercase">
                    GOVT EXAM SUITE
                  </h4>
                  <p className="text-xs text-[#3B3355] font-semibold">
                    1-Click Auto Crop, Pixel Resize, and Strict KB Binary Compression.
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#FF4E02] text-white text-xs font-black">
                      100% Free Forever
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Action */}
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#FF4E02]">
                  OFFICIAL TAGX LABS UTILITY
                </span>
                <h3 className="font-display text-3xl sm:text-5xl text-[#1400C3] tracking-tight uppercase leading-tight">
                  FAST, SECURE, IRRESISTIBLE.
                </h3>
                <p className="text-sm sm:text-base text-[#3B3355] font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Experience image compression and PDF manipulation the way it should be: completely private, blazing fast on your own device, and completely free of frustrating paywalls.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("exam-resizer")}
                    className="px-8 py-4 rounded-full font-black text-sm sm:text-base bg-[#1400C3] hover:bg-[#FF4E02] text-white shadow-xl shadow-[#1400C3]/20 transition-all cursor-pointer transform hover:-translate-y-1 active:scale-95"
                  >
                    Start Resizing Now &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS SECTION                                       */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#FF4E02] font-black uppercase tracking-wider mb-2 bg-[#FF4E02]/10 px-3 py-1 rounded-full">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl text-[#1400C3] tracking-tight uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 80}>
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#E5DCB8] hover:border-[#1400C3] transition-all duration-300 shadow-sm">
                <h4 className="font-display text-lg sm:text-xl text-[#1400C3] tracking-tight mb-2">
                  {faq.q}
                </h4>
                <p className="text-[#3B3355] text-xs sm:text-sm leading-relaxed font-semibold">
                  {faq.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
