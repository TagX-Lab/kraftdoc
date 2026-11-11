import React, { useState } from "react";
import {
  UserCheck,
  Minimize2,
  FileText,
  Layers,
  RefreshCw,
  RotateCw,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";
import ScrollReveal from "../components/common/ScrollReveal";
import {
  HeroShowcaseIllustration,
  PhotoResizerIllustration,
  CompressorIllustration,
  ImagesToPdfIllustration,
  MergeSplitIllustration,
  ConverterIllustration,
  OrganizerIllustration,
  CompressPdfIllustration,
  SignPdfIllustration,
  WatermarkIllustration,
  PageNumbersIllustration,
  CropPdfIllustration,
  FlattenPdfIllustration,
  BlackenIllustration,
  PdfToImagesIllustration,
  ComparePdfIllustration,
  MetadataIllustration,
  ResizePdfIllustration,
  PagesPerSheetIllustration,
  ExtractTextIllustration,
  CameraScanIllustration,
  ScreenCaptureIllustration,
  RepairPdfIllustration,
  InvoiceIllustration,
} from "../components/illustrations/ToolIllustrations";

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
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    {
      id: "all",
      label: "All Modules (23)",
      badge: "Complete Suite",
    },
    {
      id: "image",
      label: "Image Studio (3)",
      title: "Image Studio",
      desc: "Crop, resize px, shrink KB, and instant format conversions",
      badge: "High-Speed Canvas",
      icon: ImageIcon,
    },
    {
      id: "organize-edit",
      label: "Organize & Edit PDF (7)",
      title: "Organize & Edit PDF",
      desc: "Merge, split, rotate, crop margins, scale page size & N-up sheets",
      badge: "Vector Modification",
      icon: Layers,
    },
    {
      id: "security-privacy",
      label: "Security & Privacy (5)",
      title: "Security & Redaction",
      desc: "Digital sign, form flatten, redact black boxes, watermark & sanitize",
      badge: "100% In-Browser Privacy",
      icon: ShieldCheck,
    },
    {
      id: "convert-create",
      label: "Convert & Create (8)",
      title: "Convert, Create & Optimize",
      desc: "Compress, images to PDF, plain text, live webcam scan & invoice maker",
      badge: "Productivity Engine",
      icon: Sparkles,
    },
  ];

  // All 23 Handcrafted Tool Cards Categorized
  const toolCards = [
    // 1. IMAGE SUITE
    {
      id: "exam-resizer",
      category: "image",
      tag: "Popular",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Photo Resizer",
      desc: "Crop, resize px & set exact KB limits freely.",
      accentColor: "#FF4E02",
      icon: UserCheck,
      illustration: PhotoResizerIllustration,
      pillPrice: "Free",
    },
    {
      id: "compress-image",
      category: "image",
      tag: "Popular",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EBF7ED] border-[#C2E7C9]",
      title: "Compressor",
      desc: "Bulk shrink JPG, PNG, WebP up to 90%.",
      accentColor: "#1400C3",
      icon: Minimize2,
      illustration: CompressorIllustration,
      pillPrice: "Free",
    },
    {
      id: "image-converter",
      category: "image",
      tag: "New",
      tagColor: "bg-emerald-600 text-white",
      bgClass: "bg-[#F3ECFB] border-[#D8C4F4]",
      title: "Format Convert",
      desc: "Bulk convert across WebP, PNG & JPG.",
      accentColor: "#1400C3",
      icon: RefreshCw,
      illustration: ConverterIllustration,
      pillPrice: "Free",
    },

    // 2. ORGANIZE & EDIT PDF
    {
      id: "pdf-merge-split",
      category: "organize-edit",
      tag: "Top Tool",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EAF2FD] border-[#C2D8FA]",
      title: "Merge & Split",
      desc: "Combine docs or extract custom page ranges.",
      accentColor: "#1400C3",
      icon: Layers,
      illustration: MergeSplitIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-organizer",
      category: "organize-edit",
      tag: "Organize",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF0D9] border-[#F7D8A8]",
      title: "PDF Organizer",
      desc: "Rotate pages 90°/180° and delete pages.",
      accentColor: "#FF4E02",
      icon: RotateCw,
      illustration: OrganizerIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-crop",
      category: "organize-edit",
      tag: "Utility",
      tagColor: "bg-emerald-600 text-white",
      bgClass: "bg-[#F3ECFB] border-[#D8C4F4]",
      title: "Crop PDF Pages",
      desc: "Trim margins, headers & footers from all pages.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: CropPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-page-size",
      category: "organize-edit",
      tag: "Utility",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Change Page Size",
      desc: "Rescale to standard A4, Letter, A3 & Legal.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: ResizePdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-pages-per-sheet",
      category: "organize-edit",
      tag: "Paper Saver",
      tagColor: "bg-emerald-600 text-white",
      bgClass: "bg-[#EBF7ED] border-[#C2E7C9]",
      title: "Pages Per Sheet",
      desc: "Combine 2 or 4 pages side-by-side on 1 sheet.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: PagesPerSheetIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-page-numbers",
      category: "organize-edit",
      tag: "Utility",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EBF7ED] border-[#C2E7C9]",
      title: "Page Numbers",
      desc: "Insert header or footer page numbers accurately.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: PageNumbersIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-compare",
      category: "organize-edit",
      tag: "Audit",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EAF2FD] border-[#C2D8FA]",
      title: "Compare PDFs",
      desc: "Side-by-side visual difference audit comparison.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: ComparePdfIllustration,
      pillPrice: "Free",
    },

    // 3. SECURITY & PRIVACY
    {
      id: "pdf-sign",
      category: "security-privacy",
      tag: "Security",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Sign PDF",
      desc: "Draw or upload signature & stamp onto any page.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: SignPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-flatten",
      category: "security-privacy",
      tag: "Lock",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Flatten PDF",
      desc: "Lock interactive forms & prevent future tampering.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: FlattenPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-blacken",
      category: "security-privacy",
      tag: "Privacy",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Blacken & Redact",
      desc: "Censor sensitive data with solid black boxes.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: BlackenIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-watermark",
      category: "security-privacy",
      tag: "Security",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF0D9] border-[#F7D8A8]",
      title: "Watermark PDF",
      desc: "Stamp text watermarks across every page cleanly.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: WatermarkIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-metadata",
      category: "security-privacy",
      tag: "Security",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Edit Metadata",
      desc: "Change author, title & sanitize tracking info.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: MetadataIllustration,
      pillPrice: "Free",
    },

    // 4. CONVERT, CREATE & OPTIMIZE
    {
      id: "pdf-compress",
      category: "convert-create",
      tag: "Essential",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Compress PDF",
      desc: "Shrink PDF filesize with 3 smart strength presets.",
      accentColor: "#FF4E02",
      icon: Minimize2,
      illustration: CompressPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "images-to-pdf",
      category: "convert-create",
      tag: "Essential",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Images to PDF",
      desc: "Merge photos into clean A4 or Letter PDFs.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: ImagesToPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-to-images",
      category: "convert-create",
      tag: "Extract",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EAF2FD] border-[#C2D8FA]",
      title: "PDF to Images",
      desc: "Extract pages to high-res PNG/JPG & batch ZIP.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: PdfToImagesIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-extract-text",
      category: "convert-create",
      tag: "Extract",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#F3ECFB] border-[#D8C4F4]",
      title: "Extract Text",
      desc: "Pull readable text & export clean .TXT files.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: ExtractTextIllustration,
      pillPrice: "Free",
    },
    {
      id: "camera-to-pdf",
      category: "convert-create",
      tag: "Live Scan",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFF0D9] border-[#F7D8A8]",
      title: "Camera Scanner",
      desc: "Scan physical documents via camera into PDF.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: CameraScanIllustration,
      pillPrice: "Free",
    },
    {
      id: "screen-to-pdf",
      category: "convert-create",
      tag: "Capture",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#EAF2FD] border-[#C2D8FA]",
      title: "Screen to PDF",
      desc: "Capture active window or screen to high-res PDF.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: ScreenCaptureIllustration,
      pillPrice: "Free",
    },
    {
      id: "pdf-repair",
      category: "convert-create",
      tag: "Fix",
      tagColor: "bg-[#FF4E02] text-white",
      bgClass: "bg-[#FFEBE5] border-[#F8C8BD]",
      title: "Repair PDF",
      desc: "Rebuild corrupted xref tables & broken streams.",
      accentColor: "#FF4E02",
      icon: FileText,
      illustration: RepairPdfIllustration,
      pillPrice: "Free",
    },
    {
      id: "create-invoice",
      category: "convert-create",
      tag: "Finance",
      tagColor: "bg-[#1400C3] text-white",
      bgClass: "bg-[#FFF4D4] border-[#F2DE9F]",
      title: "Invoice Maker",
      desc: "Generate professional billing invoices in seconds.",
      accentColor: "#1400C3",
      icon: FileText,
      illustration: InvoiceIllustration,
      pillPrice: "Free",
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
                  Fast, private in-browser image and document tools. Compress photos, resize dimensions, convert formats, and merge or split PDFs without uploading a single byte to cloud servers.
                </p>

                {/* CTA Buttons in Pill Form */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("exam-resizer")}
                    className="px-8 py-4 rounded-full font-black bg-[#1400C3] hover:bg-[#0E008F] text-white shadow-xl shadow-[#1400C3]/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-1 cursor-pointer active:scale-95 text-sm sm:text-base group"
                  >
                    <span>Photo Resizer</span>
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

                  {/* Main Hero Product Bag / Package Card - Bespoke 3D Vector Illustration */}
                  <div className="transform hover:-translate-y-1 transition-transform duration-300">
                    <HeroShowcaseIllustration />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Scroll Down Indicator - Exactly where user drew the box */}
        <div className="flex justify-center -mt-6 sm:-mt-7 relative z-20">
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById("tools-section");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group inline-flex items-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-[#FFFDF5] text-[#1400C3] hover:text-[#FF4E02] border-2 border-[#1400C3] shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer text-xs font-black uppercase tracking-wider active:scale-95"
            aria-label="Scroll down to start your work"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4E02] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4E02]" />
            </span>
            <span>Scroll down to start your work</span>
            <div className="w-5 h-5 rounded-full bg-[#1400C3] group-hover:bg-[#FF4E02] text-white flex items-center justify-center transition-colors shadow-xs animate-bounce">
              <ArrowDown className="w-3 h-3 stroke-[3]" />
            </div>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* "OUR FAVORITES / TOOLS YOU'LL LOVE" COLOR-BLOCK CARDS SECTION             */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* "OUR FAVORITES / TOOLS YOU'LL LOVE" CATEGORIZED COLOR-BLOCK CARDS SECTION */}
      {/* ========================================================================= */}
      <section id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="rounded-[32px] sm:rounded-[44px] bg-[#F7EDBE] border-2 border-[#E6D799] p-5 sm:p-8 lg:p-10 shadow-sm space-y-8">
            {/* Main Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E6D799] pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF4E02] block mb-1">
                  CATEGORIZED UTILITY ENGINE • 23 POWER TOOLS
                </span>
                <h2 className="font-display text-2xl sm:text-4xl text-[#1400C3] tracking-tight uppercase">
                  TOOLS YOU&apos;LL LOVE
                </h2>
              </div>
              <span className="text-xs font-bold text-[#6B627F]">
                100% In-Browser • Free Forever • Zero Cloud Uploads
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-[#1400C3] text-white shadow-md shadow-[#1400C3]/20 scale-105"
                      : "bg-white/80 hover:bg-white text-[#3B3355] hover:text-[#1400C3] border border-[#E6D799]"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Render Category Sections */}
            <div className="space-y-10">
              {(selectedCategory === "all"
                ? categories.filter((c) => c.id !== "all")
                : categories.filter((c) => c.id === selectedCategory)
              ).map((cat, catIdx, arr) => {
                const CatIcon = cat.icon;
                const catTools = toolCards.filter((t) => t.category === cat.id);
                if (catTools.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-4">
                    {/* Category Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#1400C3] text-white flex items-center justify-center shadow-xs">
                          <CatIcon className="w-4 h-4 text-[#F8F2D8]" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg sm:text-xl text-[#1400C3] tracking-tight uppercase flex items-center gap-2">
                            <span>{cat.title}</span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF4E02] text-white tracking-wider">
                              {catTools.length} TOOLS
                            </span>
                          </h3>
                          <p className="text-xs text-[#6B627F] font-semibold">{cat.desc}</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-wider text-[#1400C3] bg-white px-3 py-1 rounded-full border border-[#E6D799]">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Category Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                      {catTools.map((tool) => {
                        const Illustration = tool.illustration;

                        return (
                          <div
                            key={tool.id}
                            onClick={() => onNavigate(tool.id)}
                            className={`human-card rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border-2 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 ${tool.bgClass}`}
                          >
                            <div>
                              {/* Top Tag */}
                              <div className="flex items-center mb-2">
                                <span
                                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs truncate ${tool.tagColor}`}
                                >
                                  {tool.tag}
                                </span>
                              </div>

                              {/* Tool Graphic Showcase Box with Bespoke 3D Vector Illustration */}
                              <div className="my-1.5 h-24 sm:h-28 rounded-xl bg-white border border-black/5 flex items-center justify-center p-2 overflow-hidden shadow-inner group">
                                <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <Illustration />
                                </div>
                              </div>

                              {/* Title & Description */}
                              <h4
                                className="font-display text-sm sm:text-base text-[#1400C3] tracking-tight leading-tight mt-1.5 truncate"
                                title={tool.title}
                              >
                                {tool.title}
                              </h4>
                              <p className="text-[10px] sm:text-[11px] text-[#3B3355] font-semibold leading-snug line-clamp-2 mt-1 min-h-[28px]">
                                {tool.desc}
                              </p>
                            </div>

                            {/* Bottom Action Pill */}
                            <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#1400C3]">
                                {tool.pillPrice}
                              </span>
                              <button
                                type="button"
                                className="px-2.5 py-1 rounded-full font-black text-[10px] sm:text-[11px] bg-[#1400C3] hover:bg-[#FF4E02] text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <span>open</span>
                                <span className="text-xs font-bold">+</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Divider between categories when viewing all */}
                    {selectedCategory === "all" && catIdx < arr.length - 1 && (
                      <div className="pt-6 border-b-2 border-dashed border-[#E6D799]" />
                    )}
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
    </div>
  );
}
