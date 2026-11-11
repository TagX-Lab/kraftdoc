import React from "react";
import { Sparkles, Shield, Cpu, Lock, ArrowLeft } from "lucide-react";
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
        <p className="mt-3 text-base text-slate-400">
          The privacy-first document and image utility suite built entirely for in-browser client execution.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Our Mission</span>
          </div>
          <p>
            Millions of students, job seekers, and everyday internet users need to compress images, merge PDFs, and resize photos to prepare for government examinations (like TNPSC, UPSC, SSC, and Banking exams).
          </p>
          <p>
            Traditional utility websites upload these confidential documents (which often include PAN cards, Aadhaar cards, personal photos, and signatures) to external cloud servers. We created <strong>{siteConfig.name}</strong> to eliminate this privacy risk completely.
          </p>
        </section>

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

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Free & Accessible For Everyone</h2>
          <p>
            We believe essential everyday productivity tools should be 100% free and open to everyone without paywalls, forced logins, or subscriptions. We keep our service running through non-intrusive advertisements.
          </p>
        </section>
      </div>
    </div>
  );
}
