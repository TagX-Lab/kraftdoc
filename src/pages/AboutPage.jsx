import React from "react";
import { Sparkles, Shield, Cpu, Lock, ArrowLeft, ExternalLink, Globe, Layers } from "lucide-react";
import { siteConfig } from "../config/siteConfig";

export default function AboutPage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-10">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About {siteConfig.name}
        </h1>
        <p className="mt-2 text-base text-slate-400">
          An official in-house product engineered by <span className="text-sky-400 font-bold">{siteConfig.company.name}</span>.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Parent Company Showcase Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-sky-500/30 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold font-mono">
                TX
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg">
                  Owned &amp; Engineered by {siteConfig.company.name}
                </h3>
                <p className="text-xs text-sky-400/90 font-mono">
                  {siteConfig.company.tagline}
                </p>
              </div>
            </div>

            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20"
            >
              <span>Visit Official Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            <strong>{siteConfig.company.name}</strong> is a next-generation software laboratory and product studio founded by ambitious developers. We engineer proprietary in-house digital products (such as <strong>MousePilot™</strong> for Windows and <strong>DocuPix</strong> for the web) alongside mission-critical digital systems.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-800">
            <span className="font-semibold text-white">TAGX Labs Products:</span>
            <a
              href={siteConfig.company.otherProducts[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>MousePilot™ (Windows)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-400 font-medium">
              DocuPix (Web Suite) &bull; Live
            </span>
          </div>
        </section>

        {/* Product Mission */}
        <section className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Our Mission for DocuPix</span>
          </div>
          <p>
            Millions of students, job seekers, and everyday internet users need to compress images, merge PDFs, and resize photos to prepare for government examinations (like TNPSC, UPSC, SSC, and Banking exams).
          </p>
          <p>
            Traditional utility websites upload these confidential documents (which often include PAN cards, Aadhaar cards, personal photos, and signatures) to external cloud servers. <strong>{siteConfig.company.name}</strong> created <strong>{siteConfig.name}</strong> to eliminate this privacy risk completely.
          </p>
        </section>

        {/* Technical Architecture */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">How Does In-Browser Processing Work?</h2>
          <p>
            {siteConfig.name} leverages modern Web APIs, HTML5 Canvas, and WebAssembly to run image compression and PDF manipulation algorithms directly inside your device's browser memory (RAM).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Shield className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">
                Zero Cloud Uploads
              </h4>
              <p className="text-xs text-slate-400">
                Your files are never transmitted across the network.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Cpu className="w-5 h-5 text-sky-400 mb-2" />
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">
                Local Hardware Speed
              </h4>
              <p className="text-xs text-slate-400">
                Processing speed is instantaneous, bounded only by your device.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <Lock className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-1">
                Bank-Grade Privacy
              </h4>
              <p className="text-xs text-slate-400">
                Even if your internet disconnects after loading, the tools continue working offline!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
