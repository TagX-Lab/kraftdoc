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
  Sparkles,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import AdBanner from "../components/ads/AdBanner";
import Badge from "../components/common/Badge";
import ScrollReveal from "../components/common/ScrollReveal";

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
    <div className="space-y-20 relative overflow-hidden">
      {/* Background Ambient Floating Glow Lights */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-96 right-1/4 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-reverse" />
      <div className="absolute top-[1600px] left-1/3 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal animation="fade-up" delay={50}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Smart Image &amp; PDF Tools
              <span className="block mt-3 bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Right Inside Your Browser
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Compress photos, resize for government exams (TNPSC, UPSC, SSC), convert images to PDF, and merge documents without ever uploading sensitive files to cloud servers.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("exam-resizer")}
                className="px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-1 hover:shadow-emerald-500/40 cursor-pointer active:scale-95"
              >
                <UserCheck className="w-5 h-5" />
                <span>Govt Exam Resizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("compress-image")}
                className="px-6 py-3.5 rounded-xl font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-2 transition-all transform hover:-translate-y-1 hover:border-slate-500 cursor-pointer active:scale-95"
              >
                <Minimize2 className="w-5 h-5 text-indigo-400" />
                <span>Compress Images</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Top Banner Ad with Scroll Animation */}
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal animation="fade-in" delay={100}>
          <AdBanner slotId="1000000001" />
        </ScrollReveal>
      </div>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore All Utility Tools
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Select any tool below to process your files securely in your browser memory.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.features.map((tool, index) => {
            const Icon = ICON_MAP[tool.icon] || FileText;

            return (
              <ScrollReveal
                key={tool.id}
                animation="fade-up"
                delay={index * 80}
              >
                <div
                  onClick={() => onNavigate(tool.route)}
                  className="group relative h-full p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/50 transition-all duration-300">
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

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Middle Banner Ad */}
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal animation="fade-in">
          <AdBanner slotId="1000000002" />
        </ScrollReveal>
      </div>

      {/* Value Pillars (Zero-Server Advantage) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ScrollReveal animation="scale-up">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="max-w-3xl mb-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Why Choose In-Browser Processing?
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Traditional online converters upload your files to cloud servers where they could be logged, leaked, or intercepted. DocuPix solves this completely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="space-y-3 p-5 rounded-2xl bg-slate-850/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
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
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <div className="space-y-3 p-5 rounded-2xl bg-slate-850/40 border border-slate-800/80 hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1">
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
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <div className="space-y-3 p-5 rounded-2xl bg-slate-850/40 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
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
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SEO FAQs with Scroll Reveals */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <ScrollReveal
              key={idx}
              animation="fade-up"
              delay={idx * 100}
            >
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:shadow-lg">
                <h4 className="font-bold text-white text-sm sm:text-base mb-2">
                  {faq.q}
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
