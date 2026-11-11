import React, { useState } from "react";
import {
  Search,
  UserCheck,
  Minimize2,
  RefreshCw,
  FileText,
  FileImage,
  Layers,
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
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function AllToolsPage({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // 'all' | 'image' | 'pdf-edit' | 'pdf-convert'

  const tools = [
    {
      id: "exam-resizer",
      category: "image",
      title: "Photo & Signature Resizer",
      desc: "Crop, resize dimensions, and set strict KB limits for govt exam portals.",
      icon: UserCheck,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
      tag: "Popular",
    },
    {
      id: "compress-image",
      category: "image",
      title: "Image Compressor",
      desc: "Bulk shrink JPG, PNG, WebP up to 90% without visible loss in quality.",
      icon: Minimize2,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
      tag: "Top Tool",
    },
    {
      id: "image-converter",
      category: "image",
      title: "Image Format Converter",
      desc: "Convert image files across WebP, PNG, and JPG in high speed.",
      icon: RefreshCw,
      iconBg: "bg-[#F3ECFB] text-emerald-600 border-[#D8C4F4]",
      tag: "Fast",
    },
    {
      id: "pdf-compress",
      category: "pdf-convert",
      title: "Compress PDF",
      desc: "Downscale PDF size with Light, Balanced, and Extreme presets.",
      icon: Minimize2,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
      tag: "Essential",
    },
    {
      id: "images-to-pdf",
      category: "pdf-convert",
      title: "Images to PDF",
      desc: "Combine multiple photos into standard A4, Letter, or fit-to-image PDFs.",
      icon: FileText,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
      tag: "Essential",
    },
    {
      id: "pdf-to-images",
      category: "pdf-convert",
      title: "PDF to Images",
      desc: "Render high-res PNG or JPG pages and batch download as a ZIP archive.",
      icon: FileImage,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
      tag: "New",
    },
    {
      id: "pdf-merge-split",
      category: "pdf-edit",
      title: "PDF Merge & Split",
      desc: "Merge separate PDF documents or extract custom page ranges effortlessly.",
      icon: Layers,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
      tag: "Popular",
    },
    {
      id: "pdf-organizer",
      category: "pdf-edit",
      title: "PDF Page Organizer",
      desc: "Rotate pages 90°/180°, reorder sheets, and delete unwanted pages.",
      icon: RotateCw,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
      tag: "Organize",
    },
    {
      id: "pdf-sign",
      category: "pdf-edit",
      title: "Sign PDF",
      desc: "Draw or upload your signature and stamp it accurately at any page coordinate.",
      icon: PenTool,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
      tag: "Security",
    },
    {
      id: "pdf-watermark",
      category: "pdf-edit",
      title: "Watermark PDF",
      desc: "Stamp diagonal or custom angle text watermarks across every page.",
      icon: Stamp,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
      tag: "Security",
    },
    {
      id: "pdf-page-numbers",
      category: "pdf-edit",
      title: "Add Page Numbers",
      desc: "Insert clean header/footer page numbers with custom font styling.",
      icon: Hash,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
      tag: "Utility",
    },
    {
      id: "pdf-crop",
      category: "pdf-edit",
      title: "Crop PDF Pages",
      desc: "Trim margins, remove headers/footers, and crop borders from all pages.",
      icon: Crop,
      iconBg: "bg-[#F3ECFB] text-[#1400C3] border-[#D8C4F4]",
      tag: "Utility",
    },
    {
      id: "pdf-flatten",
      category: "pdf-edit",
      title: "Flatten PDF",
      desc: "Lock interactive forms, checkboxes, and signatures into static document vectors.",
      icon: Lock,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
      tag: "Security",
    },
    {
      id: "pdf-blacken",
      category: "pdf-edit",
      title: "Blacken & Redact PDF",
      desc: "Draw solid black censor boxes over confidential data, passwords, and IDs.",
      icon: Square,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
      tag: "Privacy",
    },
    {
      id: "pdf-compare",
      category: "pdf-edit",
      title: "Compare PDFs",
      desc: "Audit contracts and document revisions side-by-side with synchronized scrolling.",
      icon: GitCompare,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
      tag: "Audit",
    },
    {
      id: "pdf-metadata",
      category: "pdf-edit",
      title: "Edit & Sanitize PDF Metadata",
      desc: "Change author, title, keywords, or wipe hidden device tracking metadata.",
      icon: FileCode,
      iconBg: "bg-[#FFF4D4] text-[#FF4E02] border-[#F2DE9F]",
      tag: "Security",
    },
    {
      id: "pdf-page-size",
      category: "pdf-edit",
      title: "Change PDF Page Size",
      desc: "Rescale document pages to standard A4, Letter, A3, A5, and Legal formats.",
      icon: Scaling,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
      tag: "Utility",
    },
    {
      id: "pdf-pages-per-sheet",
      category: "pdf-edit",
      title: "Pages Per Sheet (N-Up Print)",
      desc: "Combine 2 or 4 pages side-by-side onto single sheets to save 50-75% paper.",
      icon: LayoutGrid,
      iconBg: "bg-[#EBF7ED] text-[#1400C3] border-[#C2E7C9]",
      tag: "Paper Saver",
    },
    {
      id: "pdf-extract-text",
      category: "pdf-convert",
      title: "Extract Text from PDF",
      desc: "Pull all readable text characters and export clean .TXT text files.",
      icon: FileText,
      iconBg: "bg-[#F3ECFB] text-[#1400C3] border-[#D8C4F4]",
      tag: "Extract",
    },
    {
      id: "camera-to-pdf",
      category: "pdf-convert",
      title: "Camera & Scanner to PDF",
      desc: "Scan physical documents, notes, or receipts via camera directly into PDF.",
      icon: Camera,
      iconBg: "bg-[#FFF0D9] text-[#FF4E02] border-[#F7D8A8]",
      tag: "Live Scan",
    },
    {
      id: "screen-to-pdf",
      category: "pdf-convert",
      title: "Capture Screen to PDF",
      desc: "Snap high-resolution captures of browser tabs, windows, or full displays.",
      icon: Monitor,
      iconBg: "bg-[#EAF2FD] text-[#1400C3] border-[#C2D8FA]",
      tag: "Capture",
    },
    {
      id: "pdf-repair",
      category: "pdf-edit",
      title: "Repair Damaged PDF",
      desc: "Fix corrupted cross-reference tables and recover broken PDF stream objects.",
      icon: Wrench,
      iconBg: "bg-[#FFEBE5] text-[#FF4E02] border-[#F8C8BD]",
      tag: "Recovery",
    },
    {
      id: "create-invoice",
      category: "pdf-convert",
      title: "Visual Invoice PDF Maker",
      desc: "Create professional vector billing receipts and invoices with tax calculation.",
      icon: Receipt,
      iconBg: "bg-[#FFF4D4] text-[#1400C3] border-[#F2DE9F]",
      tag: "Finance",
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="rounded-[36px] bg-[#F7E7A0] border-2 border-[#EAD585] p-8 sm:p-12 text-center space-y-4 shadow-lg shadow-[#1400C3]/5 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#1400C3] text-xs font-black uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4E02]" />
          <span>Complete Web Utility Suite</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1400C3] uppercase tracking-tight">
          ALL TOOLS &amp; MODULES
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base font-semibold text-[#3B3355]">
          100% private, free, and in-browser. Zero file uploads to cloud servers.
          Everything processes on your device RAM with instant speeds.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-4 relative">
          <Search className="w-5 h-5 text-[#6B627F] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools by name or purpose (e.g. compress, sign, crop, convert)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border-2 border-[#1400C3]/20 focus:border-[#1400C3] focus:outline-none font-bold text-sm text-[#1400C3] shadow-md placeholder:font-medium placeholder:text-[#6B627F]"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", label: `All Tools (${tools.length})` },
          { id: "image", label: "Image Suite (3)" },
          { id: "pdf-edit", label: "PDF Modify & Security (13)" },
          { id: "pdf-convert", label: "PDF Convert & Create (7)" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-[#1400C3] text-white shadow-md shadow-[#1400C3]/20"
                : "bg-white border border-[#E5DCB8] text-[#3B3355] hover:text-[#1400C3] hover:bg-[#F8F2D8]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="rounded-3xl bg-white border-2 border-[#1400C3]/15 hover:border-[#1400C3] p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${tool.iconBg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F2D8] text-[#1400C3] border border-[#E5DCB8]">
                    {tool.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg text-[#1400C3] group-hover:text-[#FF4E02] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#6B627F] font-semibold leading-relaxed mt-1.5">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 bg-[#EBF7ED] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Free • In-Browser</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-[#1400C3] group-hover:text-[#FF4E02] transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="text-sm font-bold text-[#1400C3]">No tools found matching "{searchQuery}"</div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs font-bold text-[#FF4E02] hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
