import React from "react";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";
import { TornPaperTop, ScotchTape } from "../components/comic/TornPaperEdge";
import ScrollReveal from "../components/common/ScrollReveal";
import {
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

export default function HomePage({ onNavigate }) {
  const categories = [
    {
      id: "image",
      title: "Image Studio",
      shortTitle: "Image Studio",
      desc: "Crop, resize px, shrink KB, and instant format conversions",
      badge: "High-Speed Canvas",
      icon: ImageIcon,
    },
    {
      id: "organize-edit",
      title: "Organize & Edit PDF",
      shortTitle: "Organize & Edit",
      desc: "Merge, split, rotate, crop margins, scale page size & N-up sheets",
      badge: "Vector Engine",
      icon: Layers,
    },
    {
      id: "security-privacy",
      title: "Security & Redaction",
      shortTitle: "Security & Privacy",
      desc: "Digital sign, form flatten, redact black boxes, watermark & sanitize",
      badge: "100% In-Browser Privacy",
      icon: ShieldCheck,
    },
    {
      id: "convert-create",
      title: "Convert, Create & Optimize",
      shortTitle: "Convert & Create",
      desc: "Compress, images to PDF, plain text, live webcam scan & invoice maker",
      badge: "Productivity Engine",
      icon: Sparkles,
    },
  ];

  // All 23 Handcrafted Tool Cards styled like authentic comic book issues
  const toolCards = [
    // 1. IMAGE SUITE (3 Tools)
    {
      id: "exam-resizer",
      category: "image",
      issueNo: "NO. 01",
      tag: "POPULAR",
      tagBg: "bg-[#FF3E18] text-white",
      title: "PHOTO RESIZER",
      desc: "Crop, resize dimensions & set exact KB limits for portal uploads.",
      illustration: PhotoResizerIllustration,
      price: "FREE",
    },
    {
      id: "compress-image",
      category: "image",
      issueNo: "NO. 02",
      tag: "POPULAR",
      tagBg: "bg-black text-white",
      title: "BULK COMPRESSOR",
      desc: "Shrink JPG, PNG, and WebP up to 90% without visible quality loss.",
      illustration: CompressorIllustration,
      price: "FREE",
    },
    {
      id: "image-converter",
      category: "image",
      issueNo: "NO. 03",
      tag: "NEW",
      tagBg: "bg-[#FF3E18] text-white",
      title: "FORMAT CONVERTER",
      desc: "High-speed batch conversion across WebP, PNG, and JPG formats.",
      illustration: ConverterIllustration,
      price: "FREE",
    },

    // 2. ORGANIZE & EDIT PDF (7 Tools)
    {
      id: "pdf-merge-split",
      category: "organize-edit",
      issueNo: "NO. 04",
      tag: "TOP TOOL",
      tagBg: "bg-[#FF3E18] text-white",
      title: "MERGE & SPLIT",
      desc: "Combine separate PDF docs or extract custom page ranges easily.",
      illustration: MergeSplitIllustration,
      price: "FREE",
    },
    {
      id: "pdf-organizer",
      category: "organize-edit",
      issueNo: "NO. 05",
      tag: "ORGANIZE",
      tagBg: "bg-black text-white",
      title: "PDF ORGANIZER",
      desc: "Rotate pages 90°/180°, reorder sequence, and delete unwanted pages.",
      illustration: OrganizerIllustration,
      price: "FREE",
    },
    {
      id: "pdf-crop",
      category: "organize-edit",
      issueNo: "NO. 06",
      tag: "UTILITY",
      tagBg: "bg-[#FF3E18] text-white",
      title: "CROP PDF PAGES",
      desc: "Trim margins, headers, footers & white borders from any page.",
      illustration: CropPdfIllustration,
      price: "FREE",
    },
    {
      id: "pdf-page-size",
      category: "organize-edit",
      issueNo: "NO. 07",
      tag: "SCALE",
      tagBg: "bg-black text-white",
      title: "RESCALE PAGE SIZE",
      desc: "Standardize sheets to clean A4, Letter, A3, Legal, or custom sizes.",
      illustration: ResizePdfIllustration,
      price: "FREE",
    },
    {
      id: "pdf-pages-per-sheet",
      category: "organize-edit",
      issueNo: "NO. 08",
      tag: "PAPER SAVER",
      tagBg: "bg-[#FF3E18] text-white",
      title: "PAGES PER SHEET",
      desc: "Combine 2 or 4 pages side-by-side on 1 sheet for print saving.",
      illustration: PagesPerSheetIllustration,
      price: "FREE",
    },
    {
      id: "pdf-page-numbers",
      category: "organize-edit",
      issueNo: "NO. 09",
      tag: "NUMBERING",
      tagBg: "bg-black text-white",
      title: "PAGE NUMBERS",
      desc: "Insert header or footer page numbers with custom font styling.",
      illustration: PageNumbersIllustration,
      price: "FREE",
    },
    {
      id: "pdf-compare",
      category: "organize-edit",
      issueNo: "NO. 10",
      tag: "AUDIT",
      tagBg: "bg-[#FF3E18] text-white",
      title: "COMPARE PDFS",
      desc: "Side-by-side visual difference audit comparison between revisions.",
      illustration: ComparePdfIllustration,
      price: "FREE",
    },

    // 3. SECURITY & PRIVACY (5 Tools)
    {
      id: "pdf-sign",
      category: "security-privacy",
      issueNo: "NO. 11",
      tag: "SECURITY",
      tagBg: "bg-[#FF3E18] text-white",
      title: "SIGN PDF",
      desc: "Draw or upload signature & stamp onto any contract page.",
      illustration: SignPdfIllustration,
      price: "FREE",
    },
    {
      id: "pdf-flatten",
      category: "security-privacy",
      issueNo: "NO. 12",
      tag: "LOCK",
      tagBg: "bg-black text-white",
      title: "FLATTEN PDF",
      desc: "Lock interactive forms & vector fields to prevent future tampering.",
      illustration: FlattenPdfIllustration,
      price: "FREE",
    },
    {
      id: "pdf-blacken",
      category: "security-privacy",
      issueNo: "NO. 13",
      tag: "PRIVACY",
      tagBg: "bg-[#FF3E18] text-white",
      title: "BLACKEN & REDACT",
      desc: "Censor sensitive confidential text with permanent black boxes.",
      illustration: BlackenIllustration,
      price: "FREE",
    },
    {
      id: "pdf-watermark",
      category: "security-privacy",
      issueNo: "NO. 14",
      tag: "SECURITY",
      tagBg: "bg-black text-white",
      title: "WATERMARK PDF",
      desc: "Stamp text watermarks across every page cleanly with opacity control.",
      illustration: WatermarkIllustration,
      price: "FREE",
    },
    {
      id: "pdf-metadata",
      category: "security-privacy",
      issueNo: "NO. 15",
      tag: "SANITIZER",
      tagBg: "bg-[#FF3E18] text-white",
      title: "EDIT METADATA",
      desc: "Sanitize creator, author, and tracking tags from document headers.",
      illustration: MetadataIllustration,
      price: "FREE",
    },

    // 4. CONVERT, CREATE & OPTIMIZE (8 Tools)
    {
      id: "pdf-compress",
      category: "convert-create",
      issueNo: "NO. 16",
      tag: "ESSENTIAL",
      tagBg: "bg-[#FF3E18] text-white",
      title: "COMPRESS PDF",
      desc: "Shrink PDF filesize with 3 smart presets (Light, Balanced, Extreme).",
      illustration: CompressPdfIllustration,
      price: "FREE",
    },
    {
      id: "images-to-pdf",
      category: "convert-create",
      issueNo: "NO. 17",
      tag: "ESSENTIAL",
      tagBg: "bg-black text-white",
      title: "IMAGES TO PDF",
      desc: "Merge photos into clean A4 or Letter PDFs in custom order.",
      illustration: ImagesToPdfIllustration,
      price: "FREE",
    },
    {
      id: "pdf-to-images",
      category: "convert-create",
      issueNo: "NO. 18",
      tag: "EXTRACT",
      tagBg: "bg-[#FF3E18] text-white",
      title: "PDF TO IMAGES",
      desc: "Extract pages to high-res PNG or JPG files & batch download ZIP.",
      illustration: PdfToImagesIllustration,
      price: "FREE",
    },
    {
      id: "pdf-extract-text",
      category: "convert-create",
      issueNo: "NO. 19",
      tag: "EXTRACT",
      tagBg: "bg-black text-white",
      title: "EXTRACT TEXT",
      desc: "Pull readable text streams and export clean .TXT files instantly.",
      illustration: ExtractTextIllustration,
      price: "FREE",
    },
    {
      id: "camera-to-pdf",
      category: "convert-create",
      issueNo: "NO. 20",
      tag: "LIVE SCAN",
      tagBg: "bg-[#FF3E18] text-white",
      title: "CAMERA SCANNER",
      desc: "Capture physical papers directly via webcam/mobile camera into PDF.",
      illustration: CameraScanIllustration,
      price: "FREE",
    },
    {
      id: "screen-to-pdf",
      category: "convert-create",
      issueNo: "NO. 21",
      tag: "CAPTURE",
      tagBg: "bg-black text-white",
      title: "SCREEN TO PDF",
      desc: "Snap high-resolution captures of browser tabs or windows to PDF.",
      illustration: ScreenCaptureIllustration,
      price: "FREE",
    },
    {
      id: "pdf-repair",
      category: "convert-create",
      issueNo: "NO. 22",
      tag: "REPAIR",
      tagBg: "bg-[#FF3E18] text-white",
      title: "REPAIR PDF",
      desc: "Rebuild corrupted cross-reference tables & broken stream objects.",
      illustration: RepairPdfIllustration,
      price: "FREE",
    },
    {
      id: "create-invoice",
      category: "convert-create",
      issueNo: "NO. 23",
      tag: "FINANCE",
      tagBg: "bg-black text-white",
      title: "INVOICE MAKER",
      desc: "Generate professional billing invoices & receipts in seconds.",
      illustration: InvoiceIllustration,
      price: "FREE",
    },
  ];

  return (
    <div className="w-full bg-[#0C0C0C] text-white font-sans selection:bg-[#FF3E18] selection:text-white">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO (PITCH BLACK #0C0C0C + HOT COMIC RED-ORANGE #FF3E18)     */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle halftone background overlay */}
        <div className="absolute inset-0 bg-halftone-white opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Row: Massive Bebas Neue Headline + Editorial Description */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Giant Comic Headline */}
            <div className="lg:col-span-8">
              <ScrollReveal animation="fade-up" duration={700}>
                <h1 className="font-comic text-5xl sm:text-8xl md:text-9xl lg:text-[108px] text-[#FF3E18] leading-[0.88] tracking-tight uppercase select-none">
                  BEST IN-BROWSER
                  <span className="block text-white">UTILITY SUITE</span>
                  <span className="block text-[#FF3E18]">YOU&apos;VE EVER SEEN</span>
                </h1>
              </ScrollReveal>
            </div>

            {/* Right-Hand Editorial Copy & Fast Actions */}
            <div className="lg:col-span-4 lg:pt-3 space-y-5">
              <ScrollReveal animation="fade-up" delay={120} duration={700}>
                <div className="space-y-5">
                  <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed font-sans">
                    Explore a suite of 23 fast, private in-browser tools. Zero file uploads to cloud servers, zero waiting, and military-grade privacy. Everything executes inside your device memory.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate("exam-resizer")}
                      className="px-6 py-3 rounded-full bg-white text-black hover:bg-[#FF3E18] hover:text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer active:scale-95 flex items-center gap-2"
                    >
                      <span>PHOTO RESIZER</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate("compress-image")}
                      className="px-6 py-3 rounded-full bg-transparent border-2 border-white/30 text-white hover:border-[#FF3E18] hover:text-[#FF3E18] font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <span>BULK COMPRESS</span>
                    </button>
                  </div>

                  {/* Verified Tag */}
                  <div className="pt-1 flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-[#FF3E18] animate-ping" />
                    <span>100% Client-Side RAM Processing • Free Forever</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Comic Showcase Shelf: 4 Vintage Comic Book Covers Tilted with Scotch Tape */}
          <div className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {/* Shelf Item 1: Photo Resizer */}
            <ScrollReveal animation="tilt-in" delay={0} duration={650}>
              <div
                onClick={() => onNavigate("exam-resizer")}
                className="relative group cursor-pointer sm:-rotate-2 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="3deg" />
                <div className="bg-[#141414] border-2 border-white/20 group-hover:border-[#FF3E18] p-2.5 sm:p-3 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-end items-center text-[9px] sm:text-[10px] font-black tracking-widest text-[#FF3E18] uppercase pb-1.5 sm:pb-2 border-b border-white/10">
                      <span>NO. 01 • FREE</span>
                    </div>
                    <div className="my-2 sm:my-2.5 h-32 sm:h-44 md:h-52 bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden border border-black/20">
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <PhotoResizerIllustration />
                      </div>
                    </div>
                    <h3 className="font-comic text-lg sm:text-2xl text-white group-hover:text-[#FF3E18] transition-colors uppercase leading-none truncate">
                      PHOTO RESIZER
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">Exact KB lock & px crop</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Shelf Item 2: Image Compressor */}
            <ScrollReveal animation="tilt-in" delay={90} duration={650}>
              <div
                onClick={() => onNavigate("compress-image")}
                className="relative group cursor-pointer sm:rotate-1 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="-2deg" />
                <div className="bg-[#141414] border-2 border-white/20 group-hover:border-[#FF3E18] p-2.5 sm:p-3 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-end items-center text-[9px] sm:text-[10px] font-black tracking-widest text-[#FF3E18] uppercase pb-1.5 sm:pb-2 border-b border-white/10">
                      <span>NO. 02 • FREE</span>
                    </div>
                    <div className="my-2 sm:my-2.5 h-32 sm:h-44 md:h-52 bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden border border-black/20">
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CompressorIllustration />
                      </div>
                    </div>
                    <h3 className="font-comic text-lg sm:text-2xl text-white group-hover:text-[#FF3E18] transition-colors uppercase leading-none truncate">
                      IMAGE COMPRESSOR
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">Up to 90% size reduction</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Shelf Item 3: Merge & Split PDF */}
            <ScrollReveal animation="tilt-in" delay={180} duration={650}>
              <div
                onClick={() => onNavigate("pdf-merge-split")}
                className="relative group cursor-pointer sm:-rotate-1 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="4deg" />
                <div className="bg-[#141414] border-2 border-white/20 group-hover:border-[#FF3E18] p-2.5 sm:p-3 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-end items-center text-[9px] sm:text-[10px] font-black tracking-widest text-[#FF3E18] uppercase pb-1.5 sm:pb-2 border-b border-white/10">
                      <span>NO. 04 • FREE</span>
                    </div>
                    <div className="my-2 sm:my-2.5 h-32 sm:h-44 md:h-52 bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden border border-black/20">
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MergeSplitIllustration />
                      </div>
                    </div>
                    <h3 className="font-comic text-lg sm:text-2xl text-white group-hover:text-[#FF3E18] transition-colors uppercase leading-none truncate">
                      MERGE &amp; SPLIT
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">Reorder &amp; combine pages</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Shelf Item 4: Sign & Stamp PDF */}
            <ScrollReveal animation="tilt-in" delay={270} duration={650}>
              <div
                onClick={() => onNavigate("pdf-sign")}
                className="relative group cursor-pointer sm:rotate-2 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full"
              >
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="-3deg" />
                <div className="bg-[#141414] border-2 border-white/20 group-hover:border-[#FF3E18] p-2.5 sm:p-3 rounded-xl shadow-2xl overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-end items-center text-[9px] sm:text-[10px] font-black tracking-widest text-[#FF3E18] uppercase pb-1.5 sm:pb-2 border-b border-white/10">
                      <span>NO. 11 • FREE</span>
                    </div>
                    <div className="my-2 sm:my-2.5 h-32 sm:h-44 md:h-52 bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden border border-black/20">
                      <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <SignPdfIllustration />
                      </div>
                    </div>
                    <h3 className="font-comic text-lg sm:text-2xl text-white group-hover:text-[#FF3E18] transition-colors uppercase leading-none truncate">
                      SIGN &amp; STAMP
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">Draw digital signatures</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Crumpled Dark Paper Banner with Taped Badges */}
          <div className="mt-14 sm:mt-20 relative">
            <ScrollReveal animation="pop-in" duration={650} threshold={0.1}>
              <div className="relative rounded-2xl bg-[#141414] border-2 border-white/15 p-6 sm:p-10 shadow-2xl text-center">
                {/* Halftone texture */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden bg-halftone-white opacity-10 pointer-events-none" />

                <ScotchTape className="-top-3.5 left-8 sm:left-12" rotate="-5deg" />
                <ScotchTape className="-top-3.5 right-8 sm:right-12" rotate="4deg" />

                <h2 className="relative z-10 font-comic text-3xl sm:text-5xl md:text-6xl text-white leading-[0.95] uppercase tracking-tight max-w-4xl mx-auto">
                  WE HAVE A WIDE SELECTION OF
                  <span className="text-[#FF3E18]"> 23 POWER UTILITIES, </span>
                  INCLUDING <span className="underline decoration-[#FF3E18] decoration-4">RESIZER</span>,
                  <span className="underline decoration-[#FF3E18] decoration-4"> COMPRESSOR</span>,
                  <span className="underline decoration-[#FF3E18] decoration-4"> PDF MERGE</span>,
                  AND <span className="text-[#FF3E18]">ZERO CLOUD PRIVACY</span>
                </h2>

                <p className="text-xs sm:text-sm text-gray-400 mt-4 max-w-2xl mx-auto font-medium">
                  Engineered with pure craftsmanship by{" "}
                  <a
                    href={siteConfig.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#FF3E18] underline font-bold transition-colors"
                  >
                    TAGX Labs™
                  </a>
                  . Zero subscriptions, zero signups, and 100% free forever.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TORN PAPER TRANSITION 1: Black Hero tearing into White Paper Section       */}
      {/* ========================================================================= */}
      <TornPaperTop fill="#FFFFFF" />

      {/* ========================================================================= */}
      {/* SECTION 2: WHITE PAPER CATALOG ("WIDE SELECTION OF 23 POWER TOOLS")        */}
      {/* ========================================================================= */}
      <section id="tools-catalog" className="scroll-mt-16 bg-white text-black py-12 sm:py-20 relative">
        {/* Subtle halftone paper texture */}
        <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Section Header: Left Bebas Neue Headline + Right Description */}
          <ScrollReveal animation="fade-up" duration={650}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-4 border-b-2 border-black/10">
              <div className="lg:col-span-7">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF3E18] block mb-1">
                  COMPLETE CLIENT-SIDE SUITE
                </span>
                <h2 className="font-comic text-5xl sm:text-8xl lg:text-9xl text-[#FF3E18] leading-[0.85] tracking-tight uppercase">
                  WIDE SELECTION
                </h2>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  Explore a vast selection of 23 offline-capable tools from timeless classics to modern features. With zero bytes sent to servers, your privacy is always guaranteed.
                </p>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 rounded-sm bg-black hover:bg-[#FF3E18] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <span>SEE MORE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Render Categorized Comic Cards Shelves */}
          <div id="tools-grid" className="space-y-12">
          {categories.map((cat) => {
            const catTools = toolCards.filter((t) => t.category === cat.id);

            if (catTools.length === 0) return null;

            const CatIcon = cat.icon;

            return (
              <div key={cat.id} className="space-y-6 pt-4">
                {/* Category Header Row */}
                <ScrollReveal animation="fade-up" duration={500}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center">
                        <CatIcon className="w-4 h-4 text-[#FF3E18]" />
                      </div>
                      <div>
                        <h3 className="font-comic text-2xl sm:text-3xl text-black uppercase tracking-tight flex items-center gap-2.5">
                          <span>{cat.title}</span>
                          <span className="text-[11px] font-sans font-black px-2 py-0.5 rounded-full bg-[#FF3E18] text-white tracking-wider">
                            {catTools.length} ISSUES
                          </span>
                        </h3>
                        <p className="text-xs text-gray-600 font-medium">{cat.desc}</p>
                      </div>
                    </div>

                    <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-wider text-black bg-gray-100 px-3 py-1 rounded-full border border-black/10">
                      {cat.badge}
                    </span>
                  </div>
                </ScrollReveal>

                {/* Comic Book Covers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
                  {catTools.map((tool, toolIndex) => {
                    const Illustration = tool.illustration;

                    return (
                      <ScrollReveal
                        key={tool.id}
                        animation="fade-up"
                        delay={(toolIndex % 4) * 70}
                        duration={550}
                        className="h-full"
                      >
                        <div
                          onClick={() => onNavigate(tool.id)}
                          className="comic-card bg-white border-2 border-black rounded-xl p-2.5 sm:p-4 cursor-pointer flex flex-col justify-between shadow-[3px_3px_0px_0px_#0C0C0C] sm:shadow-[4px_4px_0px_0px_#0C0C0C] hover:shadow-[4px_4px_0px_0px_#FF3E18] sm:hover:shadow-[6px_6px_0px_0px_#FF3E18] hover:border-[#FF3E18] transition-all duration-200 group h-full"
                        >
                          <div>
                            {/* Comic Book Issue Header Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-1 pb-1.5 sm:pb-2 border-b border-black/10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                              <span className="text-gray-500">{tool.issueNo}</span>
                              <span className={`px-1.5 sm:px-2 py-0.5 rounded-sm font-black ${tool.tagBg}`}>
                                {tool.tag}
                              </span>
                            </div>

                            {/* Illustration Comic Frame */}
                            <div className="my-2 sm:my-2.5 h-24 sm:h-32 md:h-36 rounded-lg bg-gray-50 border border-black/15 flex items-center justify-center p-2 sm:p-2.5 overflow-hidden group-hover:bg-[#FFF4EB] transition-colors">
                              <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <Illustration />
                              </div>
                            </div>

                            {/* Comic Title & Description */}
                            <h4 className="font-comic text-base sm:text-xl text-black group-hover:text-[#FF3E18] transition-colors uppercase leading-none truncate mt-1.5 sm:mt-2">
                              {tool.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-snug line-clamp-2 mt-1 min-h-[30px] sm:min-h-[32px]">
                              {tool.desc}
                            </p>
                          </div>

                          {/* Bottom Bar: Free Price Tag + Open Button */}
                          <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-black/10 flex items-center justify-between">
                            <span className="font-comic text-sm sm:text-base text-black tracking-wide">
                              {tool.price}
                            </span>
                            <button
                              type="button"
                              className="px-2.5 sm:px-3 py-1 rounded-full bg-black group-hover:bg-[#FF3E18] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <span>OPEN</span>
                              <span className="font-bold">+</span>
                            </button>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>

          {/* Giant Bottom Headline (Matching "OF BEST COMICS" in the Reference) */}
          <ScrollReveal animation="pop-in" duration={650}>
            <div className="pt-10 text-center sm:text-left">
              <h2 className="font-comic text-5xl sm:text-8xl lg:text-9xl text-[#FF3E18] leading-[0.85] tracking-tight uppercase">
                OF 23 POWER TOOLS
              </h2>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TORN PAPER TRANSITION 2: White Paper tearing into Fiery Red-Orange Section */}
      {/* ========================================================================= */}
      <TornPaperTop fill="#FF3E18" />

      {/* ========================================================================= */}
      {/* SECTION 3: FIERY RED-ORANGE SECTION ("CHOOSE YOUR TOOLKIT")                */}
      {/* ========================================================================= */}
      <section className="bg-[#FF3E18] text-white py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle halftone texture overlay */}
        <div className="absolute inset-0 bg-halftone-white opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Header Row: White Bebas Neue Title + Subtitle */}
          <ScrollReveal animation="fade-up" duration={650}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-8">
                <span className="text-xs font-black uppercase tracking-widest text-black block mb-1">
                  100% FREE FOREVER • ZERO SUBSCRIPTION
                </span>
                <h2 className="font-comic text-5xl sm:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight uppercase">
                  CHOOSE YOUR TOOLKIT
                </h2>
              </div>
              <div className="lg:col-span-4">
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                  Unlock the full power of fast client-side utilities. Everything runs 100% inside your browser memory with zero paywalls, zero cloud uploads, and zero tracking.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 3 Tilted Comic Plan Cards with Scotch Tape (Matching the reference's 3 Plan Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4 sm:pt-6">
            {/* Plan Card 1: BASIC (Image Studio) */}
            <ScrollReveal animation="tilt-in" delay={0} duration={650} className="h-full">
              <div className="relative group md:-rotate-2 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full">
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="3deg" />
                <div className="bg-white text-black border-2 border-black rounded-2xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#0C0C0C] sm:shadow-[8px_8px_0px_0px_#0C0C0C] flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-black/10 pb-3">
                      <span className="font-comic text-xl sm:text-2xl text-black">IMAGE STUDIO</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-sm">
                        $0.00 / FOREVER
                      </span>
                    </div>

                    <div className="h-32 bg-gray-50 rounded-lg p-2 border border-black/15 flex items-center justify-center overflow-hidden">
                      <PhotoResizerIllustration />
                    </div>

                    <ul className="space-y-2 text-xs font-medium text-gray-700 pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Govt exam photo resizer with exact KB limits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Bulk lossy &amp; lossless image compression</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Batch convert WebP, JPG, and PNG formats</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Zero watermarks &amp; unlimited file sizes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-4 border-t border-black/10">
                    <button
                      type="button"
                      onClick={() => onNavigate("exam-resizer")}
                      className="w-full py-3 rounded-xl bg-black hover:bg-[#FF3E18] text-white font-comic text-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      BASIC STUDIO
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Plan Card 2: ULTIMATE (Full PDF Powerhouse) - Black Card in Center */}
            <ScrollReveal animation="pop-in" delay={120} duration={650} className="h-full">
              <div className="relative group md:-translate-y-3 hover:translate-y-0 transition-all duration-300 h-full">
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="-2deg" />
                <div className="bg-[#0C0C0C] text-white border-2 border-white rounded-2xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#FFFFFF] sm:shadow-[8px_8px_0px_0px_#FFFFFF] flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/20 pb-3">
                      <span className="font-comic text-xl sm:text-2xl text-[#FF3E18]">PDF POWERHOUSE</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#FF3E18] text-white px-2.5 py-1 rounded-sm">
                        $0.00 / FOREVER
                      </span>
                    </div>

                    <div className="h-32 bg-[#1A1A1A] rounded-lg p-2 border border-white/20 flex items-center justify-center overflow-hidden">
                      <MergeSplitIllustration />
                    </div>

                    <ul className="space-y-2 text-xs font-medium text-gray-300 pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Merge, split &amp; reorder PDF pages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Compress PDF files with 3 strength levels</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Crop margins, rescale A4/Letter &amp; N-up sheets</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Convert images to PDF and PDF back to images</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-4 border-t border-white/20">
                    <button
                      type="button"
                      onClick={() => onNavigate("pdf-merge-split")}
                      className="w-full py-3 rounded-xl bg-[#FF3E18] hover:bg-white hover:text-black text-white font-comic text-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ULTIMATE PDF
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Plan Card 3: PREMIUM (Security & Redaction) */}
            <ScrollReveal animation="tilt-in" delay={240} duration={650} className="h-full">
              <div className="relative group md:rotate-2 hover:rotate-0 transition-all duration-300 transform hover:-translate-y-2 h-full">
                <ScotchTape className="-top-3 left-1/2 -translate-x-1/2" rotate="4deg" />
                <div className="bg-white text-black border-2 border-black rounded-2xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#0C0C0C] sm:shadow-[8px_8px_0px_0px_#0C0C0C] flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-black/10 pb-3">
                      <span className="font-comic text-xl sm:text-2xl text-black">PRIVACY &amp; SECURITY</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-sm">
                        $0.00 / FOREVER
                      </span>
                    </div>

                    <div className="h-32 bg-gray-50 rounded-lg p-2 border border-black/15 flex items-center justify-center overflow-hidden">
                      <SignPdfIllustration />
                    </div>

                    <ul className="space-y-2 text-xs font-medium text-gray-700 pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Draw or upload digital signature on contracts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Blacken &amp; censor sensitive PII / secret text</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Flatten interactive PDF forms to lock editing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3E18] shrink-0" />
                        <span>Sanitize metadata &amp; compare file versions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 mt-4 border-t border-black/10">
                    <button
                      type="button"
                      onClick={() => onNavigate("pdf-sign")}
                      className="w-full py-3 rounded-xl bg-black hover:bg-[#FF3E18] text-white font-comic text-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      SECURITY SUITE
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TORN PAPER TRANSITION 3: Fiery Red-Orange tearing into Black Footer        */}
      {/* ========================================================================= */}
      <TornPaperTop fill="#0C0C0C" />

      {/* Responsive AdSense Banner */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdBanner slotId="1000000002" />
      </div>
    </div>
  );
}