import React from "react";
import { Sparkles, Shield, Cpu, Lock, ArrowLeft, ExternalLink } from "lucide-react";
import { siteConfig } from "../config/siteConfig";

export default function AboutPage({ onBack }) {
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

        <h1 className="text-4xl sm:text-5xl font-black text-[#1400C3] tracking-tight">
          About {siteConfig.name}
        </h1>
        <p className="mt-2 text-base text-[#3B3355] font-semibold">
          An official in-house product engineered by <span className="text-[#FF4E02] font-black">{siteConfig.company.name}</span>.
        </p>
      </div>

      <div className="space-y-8 text-sm text-[#3B3355] leading-relaxed">
        {/* Parent Company Showcase Card in White with Bluebonnet/Orange accents */}
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
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-[#1400C3] hover:bg-[#0D0082] text-white font-black text-xs transition-all shadow-md shadow-[#1400C3]/25"
            >
              <span>Visit Official Studio</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          <p className="text-[#3B3355] text-sm leading-relaxed font-medium">
            <strong className="text-[#1400C3] font-black">{siteConfig.company.name}</strong> is a next-generation software laboratory and product studio founded by ambitious developers. We engineer proprietary in-house digital products (such as <strong>MousePilot™</strong> for Windows and <strong>DocuPix</strong> for the web) alongside mission-critical digital systems.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs border-t border-[#E5DCB8]">
            <span className="font-black text-[#1400C3]">TAGX Labs Products:</span>
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
            Millions of students, job seekers, and everyday internet users need to compress images, merge PDFs, and resize photos to prepare for government examinations (like TNPSC, UPSC, SSC, and Banking exams).
          </p>
          <p className="font-medium text-[#3B3355]">
            Traditional utility websites upload these confidential documents (which often include PAN cards, Aadhaar cards, personal photos, and signatures) to external cloud servers. <strong className="text-[#1400C3] font-black">{siteConfig.company.name}</strong> created <strong className="text-[#1400C3] font-black">{siteConfig.name}</strong> to eliminate this privacy risk completely.
          </p>
        </section>

        {/* Technical Architecture */}
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-[#1400C3]">How Does In-Browser Processing Work?</h2>
          <p className="font-medium text-[#3B3355]">
            {siteConfig.name} leverages modern Web APIs, HTML5 Canvas, and WebAssembly to run image compression and PDF manipulation algorithms directly inside your device's browser memory (RAM).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border-2 border-[#E5DCB8] shadow-sm">
              <Shield className="w-6 h-6 text-[#1400C3] mb-2 stroke-[2.2]" />
              <h4 className="font-black text-[#1400C3] text-sm uppercase tracking-wider mb-1">
                Zero Cloud Uploads
              </h4>
              <p className="text-xs text-[#6B627F] font-semibold">
                Your files are never transmitted across the network.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-[#E5DCB8] shadow-sm">
              <Cpu className="w-6 h-6 text-[#FF4E02] mb-2 stroke-[2.2]" />
              <h4 className="font-black text-[#1400C3] text-sm uppercase tracking-wider mb-1">
                Local Hardware Speed
              </h4>
              <p className="text-xs text-[#6B627F] font-semibold">
                Processing speed is instantaneous, bounded only by your device.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-[#E5DCB8] shadow-sm">
              <Lock className="w-6 h-6 text-[#1400C3] mb-2 stroke-[2.2]" />
              <h4 className="font-black text-[#1400C3] text-sm uppercase tracking-wider mb-1">
                Bank-Grade Privacy
              </h4>
              <p className="text-xs text-[#6B627F] font-semibold">
                Even if your internet disconnects after loading, the tools continue working offline!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
