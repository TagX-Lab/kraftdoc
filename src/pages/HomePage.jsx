import React from "react";
import {
  UserCheck,
  Minimize2,
  FileText,
  Layers,
  RefreshCw,
  RotateCw,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";
import Badge from "../components/common/Badge";

const ICON_MAP = {
  UserCheck,
  Minimize2,
  FileText,
  Layers,
  RefreshCw,
  RotateCw,
};

export default function HomePage({ onNavigate }) {
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
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% Free &bull; Client-Side Security &bull; No Server Uploads
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Smart Image & PDF Tools
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Right Inside Your Browser
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Compress photos, resize for government exams (TNPSC, UPSC, SSC), convert images to PDF, and merge documents without ever uploading sensitive files to cloud servers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("exam-resizer")}
              className="px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserCheck className="w-5 h-5" />
              <span>Govt Exam Resizer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("compress-image")}
              className="px-6 py-3.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Minimize2 className="w-5 h-5 text-indigo-400" />
              <span>Compress Images</span>
            </button>
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <div className="max-w-6xl mx-auto px-4">
        <AdBanner slotId="1000000001" />
      </div>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore All Utility Tools
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Click on any tool below to start processing your files instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.features.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || FileText;

            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.route)}
                className="group relative p-6 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <Badge color={tool.badgeColor || "indigo"}>
                        {tool.badge}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Middle Banner Ad */}
      <div className="max-w-6xl mx-auto px-4">
        <AdBanner slotId="1000000002" />
      </div>

      {/* Value Pillars (Zero-Server Advantage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/80 p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Choose In-Browser Processing?
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              Traditional online converters upload your files to cloud servers where they could be logged, leaked, or intercepted. DocuPix solves this completely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                100% Client-Side Privacy
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Your photos, Aadhaar cards, marks cards, and confidential documents never leave your browser memory.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                Instant Execution Speed
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                No uploading wait time, no server queueing, and no slow download speeds. Processing happens at your computer's native speed.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                Zero Limits or Paywalls
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                No "3 free conversions per day" locks, no subscriptions, and no forced logins. Everything is completely free forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQs */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60"
            >
              <h4 className="font-bold text-white text-sm sm:text-base mb-2">
                {faq.q}
              </h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
