import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Minimize2,
  FileText,
  FileImage,
  Layers,
  RefreshCw,
  RotateCw,
  Stamp,
  Hash,
  PenTool,
  Crop,
  Lock,
  Square,
  GitCompare,
  FileCode,
  Scaling,
  LayoutGrid,
  Camera,
  Monitor,
  Wrench,
  Receipt,
} from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export default function Navbar({ currentRoute, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const imageTools = [
    {
      id: "exam-resizer",
      title: "Photo Resizer",
      desc: "Crop, resize & set exact KB limits",
      icon: UserCheck,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
    },
    {
      id: "compress-image",
      title: "Image Compressor",
      desc: "Bulk shrink JPG, PNG, WebP up to 90%",
      icon: Minimize2,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
    },
    {
      id: "image-converter",
      title: "Format Converter",
      desc: "Convert across WebP, PNG & JPG",
      icon: RefreshCw,
      iconBg: "bg-[#F3ECFB] text-emerald-600 border-[#D8C4F4]",
    },
  ];

  const pdfTools = [
    {
      id: "pdf-compress",
      title: "Compress PDF",
      desc: "Downscale PDF size with 3 presets",
      icon: Minimize2,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
    },
    {
      id: "images-to-pdf",
      title: "Images to PDF",
      desc: "Merge photos into clean A4/Letter PDFs",
      icon: FileText,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
    },
    {
      id: "pdf-to-images",
      title: "PDF to Images",
      desc: "Extract pages to high-res PNG/JPG or ZIP",
      icon: FileImage,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
    },
    {
      id: "pdf-merge-split",
      title: "PDF Merge & Split",
      desc: "Combine docs or extract custom ranges",
      icon: Layers,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
    },
    {
      id: "pdf-organizer",
      title: "PDF Organizer",
      desc: "Rotate pages 90°/180° & delete pages",
      icon: RotateCw,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
    },
    {
      id: "pdf-sign",
      title: "Sign PDF",
      desc: "Draw/upload signature & stamp coordinates",
      icon: PenTool,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
    },
    {
      id: "pdf-watermark",
      title: "Watermark PDF",
      desc: "Stamp text watermarks across pages",
      icon: Stamp,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
    },
    {
      id: "pdf-page-numbers",
      title: "Page Numbers",
      desc: "Add header/footer page numbers",
      icon: Hash,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
    },
    {
      id: "pdf-crop",
      title: "Crop PDF Pages",
      desc: "Trim margins & borders cleanly",
      icon: Crop,
      iconBg: "bg-[#F3ECFB] text-[#1400C3] border-[#D8C4F4]",
    },
    {
      id: "pdf-flatten",
      title: "Flatten PDF",
      desc: "Lock interactive forms & prevent edits",
      icon: Lock,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
    },
    {
      id: "pdf-blacken",
      title: "Blacken & Redact",
      desc: "Censor sensitive data with black boxes",
      icon: Square,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
    },
    {
      id: "pdf-compare",
      title: "Compare PDFs",
      desc: "Side-by-side visual difference audit",
      icon: GitCompare,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
    },
    {
      id: "pdf-metadata",
      title: "Edit Metadata",
      desc: "Change author, title & sanitize info",
      icon: FileCode,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
    },
    {
      id: "pdf-page-size",
      title: "Change Page Size",
      desc: "Rescale to standard A4, Letter, A3",
      icon: Scaling,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
    },
    {
      id: "pdf-pages-per-sheet",
      title: "Pages Per Sheet",
      desc: "Fit 2 or 4 pages per sheet (N-Up)",
      icon: LayoutGrid,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
    },
    {
      id: "pdf-extract-text",
      title: "Extract Text",
      desc: "Export clean plain .TXT files",
      icon: FileText,
      iconBg: "bg-[#F3ECFB] text-[#1400C3] border-[#D8C4F4]",
    },
    {
      id: "camera-to-pdf",
      title: "Camera Scanner",
      desc: "Scan documents via webcam into PDF",
      icon: Camera,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
    },
    {
      id: "screen-to-pdf",
      title: "Screen to PDF",
      desc: "Capture window or screen to PDF",
      icon: Monitor,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
    },
    {
      id: "pdf-repair",
      title: "Repair PDF",
      desc: "Fix corrupted xref tables & streams",
      icon: Wrench,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
    },
    {
      id: "create-invoice",
      title: "Invoice Maker",
      desc: "Generate professional vector invoices",
      icon: Receipt,
      iconBg: "bg-[#FFF4D4] text-[#1400C3] border-[#F2DE9F]",
    },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#E5DCB8] bg-[#F8F2D8]/95 backdrop-blur-xl shadow-lg shadow-[#1400C3]/5 py-0"
          : "border-b border-transparent bg-transparent backdrop-blur-none py-1.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo (Left) */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#1400C3] shadow-md shadow-[#1400C3]/20 group-hover:rotate-6 group-hover:scale-105 transition-all flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-[#F8F2D8]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl tracking-tight text-[#1400C3] flex items-center gap-1.5 uppercase">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF4E02] text-white uppercase tracking-wider shadow-xs">
                  FREE
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation (Center/Right) */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Tools Dropdown Button */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  toolsDropdownOpen || currentRoute !== "home" && currentRoute !== "about"
                    ? "text-[#1400C3] bg-white border border-[#E5DCB8] shadow-xs"
                    : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white/60"
                }`}
                aria-expanded={toolsDropdownOpen}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    toolsDropdownOpen ? "rotate-180 text-[#FF4E02]" : "text-[#6B627F]"
                  }`}
                />
              </button>

              {/* Tools Dropdown Card */}
              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-[640px] z-50">
                  <div className="rounded-3xl bg-white border-2 border-[#1400C3] p-5 shadow-2xl animate-fade-in max-h-[82vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Column 1: Image Tools */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E02] block mb-2 px-2">
                          IMAGE TOOLS
                        </span>
                        <div className="space-y-1">
                          {imageTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleNavClick(tool.id)}
                                className="w-full text-left p-2.5 rounded-2xl hover:bg-[#F8F2D8] transition-all flex items-start gap-3 cursor-pointer group"
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${tool.iconBg}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs text-[#1400C3] group-hover:text-[#FF4E02] transition-colors leading-snug">
                                    {tool.title}
                                  </div>
                                  <p className="text-[11px] text-[#6B627F] font-semibold leading-tight mt-0.5 truncate">
                                    {tool.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: PDF Tools */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1400C3] block mb-2 px-2">
                          PDF TOOLS ({pdfTools.length})
                        </span>
                        <div className="space-y-1">
                          {pdfTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleNavClick(tool.id)}
                                className="w-full text-left p-2 rounded-2xl hover:bg-[#F8F2D8] transition-all flex items-start gap-2.5 cursor-pointer group"
                              >
                                <div
                                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${tool.iconBg}`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs text-[#1400C3] group-hover:text-[#FF4E02] transition-colors leading-snug">
                                    {tool.title}
                                  </div>
                                  <p className="text-[10px] text-[#6B627F] font-semibold leading-tight mt-0.5 truncate">
                                    {tool.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Footer Plaque */}
                    <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-[#6B627F] px-2">
                      <span className="flex items-center gap-1.5 text-[#1400C3]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF4E02]" />
                        <span>100% Client-Side In-Browser</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNavClick("all-tools")}
                        className="text-[#FF4E02] hover:underline font-black cursor-pointer"
                      >
                        Explore all tools directory &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All Tools Page Link */}
            <button
              type="button"
              onClick={() => handleNavClick("all-tools")}
              className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                currentRoute === "all-tools"
                  ? "text-[#1400C3] bg-white border border-[#E5DCB8] shadow-xs"
                  : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white/60"
              }`}
            >
              All Tools
            </button>

            {/* About Page Link */}
            <button
              type="button"
              onClick={() => handleNavClick("about")}
              className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                currentRoute === "about"
                  ? "text-[#1400C3] bg-white border border-[#E5DCB8] shadow-xs"
                  : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white/60"
              }`}
            >
              About
            </button>

            {/* TAGX Labs Studio Link */}
            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full text-sm font-bold text-[#3B3355] hover:text-[#FF4E02] hover:bg-white/60 transition-all flex items-center gap-1"
            >
              <span>TAGX Labs</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            {/* Primary Action CTA Button (Far Right) */}
            <button
              type="button"
              onClick={() => handleNavClick("exam-resizer")}
              className="ml-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#FF4E02] hover:bg-[#1400C3] text-white shadow-md shadow-[#FF4E02]/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Photo Resizer</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1400C3] hover:bg-white/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5DCB8] bg-[#F8F2D8]/98 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-fade-in shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4E02] px-2 block">
              TOOLS
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[...imageTools, ...pdfTools].map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleNavClick(tool.id)}
                    className="p-2.5 rounded-xl bg-white border border-[#E5DCB8] text-left flex items-center gap-2 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#FF4E02] shrink-0" />
                    <span className="text-xs font-bold text-[#1400C3] truncate">
                      {tool.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E5DCB8] flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleNavClick("home")}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold text-[#3B3355] hover:text-[#1400C3] hover:bg-white"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("all-tools")}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold text-[#3B3355] hover:text-[#1400C3] hover:bg-white flex items-center justify-between"
            >
              <span>All Tools Directory</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF4E02] text-white">
                15+
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("about")}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold text-[#3B3355] hover:text-[#1400C3] hover:bg-white"
            >
              About Studio &amp; Team
            </button>
            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[#3B3355] hover:text-[#FF4E02] hover:bg-white flex items-center justify-between"
            >
              <span>TAGX Labs Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick("exam-resizer")}
            className="w-full py-3 rounded-full font-black text-xs uppercase tracking-wider bg-[#FF4E02] hover:bg-[#1400C3] text-white shadow-md text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Launch Photo Resizer</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </header>
  );
}
