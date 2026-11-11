import React from "react";
import {
  Sparkles,
  Cpu,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
  Zap,
  Smile,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";

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

export default function AboutPage({ onBack }) {
  const faqs = [
    {
      q: "Are my uploaded photos and documents safe?",
      a: "Yes, 100%! DocuPix uses HTML5 Canvas and WebAssembly to process your images and PDFs directly inside your own web browser. Your files are NEVER uploaded to any external server or cloud.",
    },
    {
      q: "How does the Photo Resizer work?",
      a: "It allows you to set custom pixel dimensions, aspect ratios, and target file size limits in KB. It resizes and compresses your photo instantly in your browser to meet any exact specifications.",
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
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-10">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#1400C3] hover:text-[#FF4E02] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Home</span>
        </button>

        <h1 className="font-display text-4xl sm:text-5xl text-[#1400C3] tracking-tight uppercase">
          About {siteConfig.name}
        </h1>
        <p className="mt-2 text-base text-[#3B3355] font-semibold">
          An official in-house product engineered by{" "}
          <span className="text-[#FF4E02] font-black">
            {siteConfig.company.name}
          </span>
          .
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#3B3355] leading-relaxed">
        {/* Parent Company Showcase Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1400C3] text-white flex items-center justify-center font-black text-lg font-mono shadow-md shadow-[#1400C3]/20">
                TX
              </div>
              <div>
                <h3 className="font-black text-[#1400C3] text-xl">
                  Owned &amp; Engineered by {siteConfig.company.name}
                </h3>
                <p className="text-xs text-[#FF4E02] font-mono font-bold">
                  {siteConfig.company.tagline}
                </p>
              </div>
            </div>

            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#1400C3] hover:bg-[#0D0082] text-white font-black text-xs transition-all shadow-md shadow-[#1400C3]/25 cursor-pointer"
            >
              <span>Visit Official Studio</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          <p className="text-[#3B3355] text-sm leading-relaxed font-medium">
            <strong className="text-[#1400C3] font-black">
              {siteConfig.company.name}
            </strong>{" "}
            is a next-generation software laboratory and product studio founded
            by ambitious developers. We engineer proprietary in-house digital
            products (such as <strong>MousePilot™</strong> for Windows and{" "}
            <strong>DocuPix</strong> for the web) alongside mission-critical
            digital systems.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs border-t border-[#E5DCB8]">
            <span className="font-black text-[#1400C3]">
              TAGX Labs Products:
            </span>
            <a
              href={siteConfig.company.otherProducts[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#F8F2D8] hover:bg-[#1400C3] hover:text-white text-[#1400C3] font-bold flex items-center gap-1 transition-colors"
            >
              <span>MousePilot™ (Windows)</span>
              <ExternalLink className="w-3 h-3 text-[#FF4E02]" />
            </a>
            <span className="px-3 py-1.5 rounded-xl bg-[#FF4E02]/15 text-[#D93E00] font-black">
              DocuPix (Web Suite) &bull; Live
            </span>
          </div>
        </section>

        {/* Product Mission */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#FF4E02] font-black text-lg">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
            <span>Our Mission for DocuPix</span>
          </div>
          <p className="font-medium text-[#3B3355]">
            Millions of creators, professionals, students, and everyday internet
            users need to compress images, merge PDFs, convert formats, and
            resize photos with strict dimensions or file size limits.
          </p>
          <p className="font-medium text-[#3B3355]">
            Traditional utility websites upload these confidential documents
            (which often include government IDs, personal photos, and signatures)
            to external cloud servers.{" "}
            <strong className="text-[#1400C3] font-black">
              {siteConfig.company.name}
            </strong>{" "}
            created{" "}
            <strong className="text-[#1400C3] font-black">
              {siteConfig.name}
            </strong>{" "}
            to eliminate this privacy risk completely by doing 100% of the
            computation inside your web browser.
          </p>
        </section>

        {/* Zero Cloud Architecture Feature Breakdown */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm space-y-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-[#1400C3] uppercase tracking-tight">
              ZERO CLOUD. PURE PRIVACY.
            </h2>
            <p className="text-xs sm:text-sm text-[#3B3355] font-semibold mt-1">
              Every photo crop, signature resize, and PDF merger is computed in
              local browser memory using HTML5 Canvas &amp; WebAssembly. No
              files ever leave your machine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* Feature 1 */}
            <div className="p-4 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-2">
              <DoodleRays className="mx-auto text-[#FF4E02]" />
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D6CA9E] text-[#1400C3] flex items-center justify-center mx-auto shadow-2xs">
                <Cpu className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-black text-xs text-[#1400C3] uppercase tracking-wide">
                IN-BROWSER RAM
              </h4>
              <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                Zero network transmission. Your files process exclusively in device RAM.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-2">
              <DoodleRays className="mx-auto text-[#1400C3]" />
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D6CA9E] text-[#FF4E02] flex items-center justify-center mx-auto shadow-2xs">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-black text-xs text-[#1400C3] uppercase tracking-wide">
                INSTANT 60 FPS
              </h4>
              <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                No waiting in cloud queues or server timeouts. Zero network latency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] space-y-2">
              <DoodleRays className="mx-auto text-[#FF4E02]" />
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D6CA9E] text-[#1400C3] flex items-center justify-center mx-auto shadow-2xs">
                <Smile className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-black text-xs text-[#1400C3] uppercase tracking-wide">
                TAGX CRAFT
              </h4>
              <p className="text-[11px] text-[#6B627F] font-semibold leading-relaxed">
                Human-crafted software by the studio behind MousePilot™.
              </p>
            </div>
          </div>
        </section>

        {/* Ad Banner on About Page */}
        <div className="pt-2">
          <AdBanner slotId="1000000001" />
        </div>

        {/* Frequently Asked Questions */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FF4E02]" />
            <h2 className="font-display text-2xl sm:text-3xl text-[#1400C3] uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#E5DCB8] shadow-xs"
              >
                <h4 className="font-display text-base sm:text-lg text-[#1400C3] tracking-tight mb-1.5">
                  {faq.q}
                </h4>
                <p className="text-[#3B3355] text-xs sm:text-sm leading-relaxed font-semibold">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
