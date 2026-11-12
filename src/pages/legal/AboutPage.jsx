import React from "react";
import {
  Zap,
  Cpu,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Smile,
} from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import AdBanner from "../../components/ads/AdBanner";
import { ScotchTape } from "../../components/comic/TornPaperEdge";

export default function AboutPage({ onBack }) {
  const faqs = [
    {
      q: "Are my uploaded photos and documents safe?",
      a: "Yes, 100%! KraftDoc uses HTML5 Canvas and WebAssembly to process your images and PDFs directly inside your own web browser. Your files are NEVER uploaded to any external server or cloud.",
    },
    {
      q: "How does the Photo Resizer work?",
      a: "It allows you to set custom pixel dimensions, aspect ratios, and target file size limits in KB. It resizes and compresses your photo instantly in your browser to meet any exact specifications.",
    },
    {
      q: "Is KraftDoc completely free to use?",
      a: "Yes! All tools are 100% free with no file limits, no registration required, and no hidden subscriptions.",
    },
    {
      q: "Can I merge multiple large PDF files?",
      a: "Yes, you can merge multiple PDF documents without restriction. All merging happens instantly inside your browser using client-side JavaScript.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-10 font-sans text-white">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#FF3E18] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK TO HOME</span>
        </button>

        <h1 className="font-comic text-5xl sm:text-7xl text-white tracking-tight uppercase leading-none">
          ABOUT <span className="text-[#FF3E18]">{siteConfig.name}</span>
        </h1>
        <p className="mt-2 text-base text-gray-300 font-medium">
          An official in-house product engineered by{" "}
          <span className="text-[#FF3E18] font-bold">
            {siteConfig.company.name}
          </span>
          .
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-200 leading-relaxed">
        {/* Parent Company Showcase Card */}
        <section className="relative p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-white/15 shadow-2xl space-y-4">
          <ScotchTape className="-top-3 right-8" rotate="4deg" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF3E18] text-white flex items-center justify-center font-comic text-2xl shadow-lg">
                TX
              </div>
              <div>
                <h3 className="font-comic text-2xl text-white tracking-wide uppercase">
                  OWNED &amp; ENGINEERED BY {siteConfig.company.name}
                </h3>
                <p className="text-xs text-[#FF3E18] font-mono font-bold">
                  {siteConfig.company.tagline}
                </p>
              </div>
            </div>

            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-white hover:bg-[#FF3E18] hover:text-white text-black font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <span>VISIT OFFICIAL STUDIO</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed font-medium">
            <strong className="text-white font-bold">
              {siteConfig.company.name}
            </strong>{" "}
            is a next-generation software laboratory and product studio founded
            by ambitious developers. We engineer proprietary in-house digital
            products (such as <strong>MousePilot™</strong> for Windows and{" "}
            <strong>KraftDoc</strong> for the web) alongside mission-critical
            digital systems.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs border-t border-white/10">
            <span className="font-black text-white uppercase tracking-wider">
              TAGX Labs Products:
            </span>
            <a
              href={siteConfig.company.otherProducts[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-black hover:bg-[#FF3E18] text-gray-200 hover:text-white font-bold flex items-center gap-1.5 border border-white/15 transition-colors"
            >
              <span>MousePilot™ (Windows)</span>
              <ExternalLink className="w-3 h-3 text-[#FF3E18]" />
            </a>
            <span className="px-3 py-1.5 rounded-lg bg-[#FF3E18]/20 border border-[#FF3E18]/40 text-[#FF3E18] font-black">
              KraftDoc (Web Suite) &bull; Live
            </span>
          </div>
        </section>

        {/* Product Mission */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-white/15 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-[#FF3E18] font-comic text-2xl uppercase tracking-wider">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
            <span>OUR MISSION FOR KRAFTDOC</span>
          </div>
          <p className="font-medium text-gray-300 leading-relaxed">
            Millions of creators, professionals, students, and everyday internet
            users need to compress images, merge PDFs, convert formats, and
            resize photos with strict dimensions or file size limits.
          </p>
          <p className="font-medium text-gray-300 leading-relaxed">
            Traditional utility websites upload these confidential documents
            (which often include government IDs, personal photos, and signatures)
            to external cloud servers.{" "}
            <strong className="text-white font-bold">
              {siteConfig.company.name}
            </strong>{" "}
            created{" "}
            <strong className="text-white font-bold">
              {siteConfig.name}
            </strong>{" "}
            to eliminate this privacy risk completely by doing 100% of the
            computation inside your web browser.
          </p>
        </section>

        {/* Zero Cloud Architecture Feature Breakdown */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-white/15 shadow-xl space-y-6">
          <div>
            <h2 className="font-comic text-3xl sm:text-4xl text-white uppercase tracking-tight">
              ZERO CLOUD. <span className="text-[#FF3E18]">PURE PRIVACY.</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
              Every photo crop, signature resize, and PDF merger is computed in
              local browser memory using HTML5 Canvas &amp; WebAssembly. No
              files ever leave your machine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {/* Feature 1 */}
            <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] flex items-center justify-center mx-auto">
                <Cpu className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-comic text-lg text-white uppercase tracking-wider">
                IN-BROWSER RAM
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed font-sans">
                Zero network transmission. Your files process exclusively in device memory.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-comic text-lg text-white uppercase tracking-wider">
                INSTANT 60 FPS
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed font-sans">
                No waiting in cloud queues or server timeouts. Zero network latency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-xl bg-black border border-white/15 space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] flex items-center justify-center mx-auto">
                <Smile className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-comic text-lg text-white uppercase tracking-wider">
                TAGX CRAFT
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed font-sans">
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
            <HelpCircle className="w-5 h-5 text-[#FF3E18]" />
            <h2 className="font-comic text-3xl sm:text-4xl text-white uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl bg-[#141414] border-2 border-white/15 shadow-sm"
              >
                <h4 className="font-comic text-xl text-white uppercase tracking-wide mb-1.5">
                  {faq.q}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-medium font-sans">
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