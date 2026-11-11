import React from "react";
import {
  UserCheck,
  Minimize2,
  FileText,
  Layers,
  RefreshCw,
  RotateCw,
  ArrowRight,
  Zap,
  Lock,
  CheckCircle,
  HelpCircle,
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
      {/* Background Ambient Floating Glow Lights in Bluebonnet & Blaze Orange */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#1400C3]/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-96 right-1/4 w-[450px] h-[450px] bg-[#FF4E02]/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-reverse" />
      <div className="absolute top-[1600px] left-1/3 w-[600px] h-[600px] bg-[#FF4E02]/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal animation="fade-up" delay={50}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1400C3] tracking-tight leading-tight">
              Smart Image &amp; PDF Tools
              <span className="block mt-3 bg-gradient-to-r from-[#1400C3] via-[#8B00C3] to-[#FF4E02] bg-clip-text text-transparent">
                Right Inside Your Browser
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <p className="mt-6 text-base sm:text-lg text-[#3B3355] max-w-2xl mx-auto leading-relaxed font-semibold">
              Compress photos, resize for government exams (TNPSC, UPSC, SSC), convert images to PDF, and merge documents without ever uploading sensitive files to cloud servers.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate("exam-resizer")}
                className="px-6 py-4 rounded-2xl font-black bg-[#FF4E02] hover:bg-[#E04200] text-white shadow-xl shadow-[#FF4E02]/30 flex items-center gap-2 transition-all transform hover:-translate-y-1 hover:shadow-[#FF4E02]/50 cursor-pointer active:scale-95 text-base"
              >
                <UserCheck className="w-5 h-5 stroke-[2.5]" />
                <span>Govt Exam Resizer</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("compress-image")}
                className="px-6 py-4 rounded-2xl font-black bg-white hover:bg-[#EFE6C4] text-[#1400C3] border-2 border-[#1400C3] shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-1 cursor-pointer active:scale-95 text-base"
              >
                <Minimize2 className="w-5 h-5 text-[#1400C3] stroke-[2.5]" />
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
            <h2 className="text-3xl sm:text-4xl font-black text-[#1400C3] tracking-tight">
              Explore All Utility Tools
            </h2>
            <p className="text-[#3B3355] text-sm mt-2 max-w-md mx-auto font-semibold">
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
                  className="group relative h-full p-7 rounded-3xl bg-white hover:bg-white border-2 border-[#E5DCB8] hover:border-[#1400C3] transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#1400C3]/15 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1400C3]/10 border border-[#1400C3]/20 text-[#1400C3] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FF4E02] group-hover:text-white group-hover:border-[#FF4E02] transition-all duration-300">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      {tool.badge && (
                        <Badge color={tool.badgeColor || "indigo"}>
                          {tool.badge}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-[#1400C3] group-hover:text-[#FF4E02] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-[#6B627F] text-sm mt-2 leading-relaxed font-medium">
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E5DCB8] flex items-center justify-between text-xs font-black text-[#1400C3] group-hover:text-[#FF4E02] transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
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
          <div className="rounded-3xl bg-white border-2 border-[#E5DCB8] p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl mb-10">
              <h3 className="text-2xl sm:text-3xl font-black text-[#1400C3]">
                Why Choose In-Browser Processing?
              </h3>
              <p className="text-[#3B3355] text-sm mt-2 font-semibold">
                Traditional online converters upload your files to cloud servers where they could be logged, leaked, or intercepted. DocuPix solves this completely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] hover:border-[#1400C3] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#1400C3]/10 text-[#1400C3] flex items-center justify-center border border-[#1400C3]/20">
                    <Lock className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-[#1400C3] text-base">
                    100% Client-Side Privacy
                  </h4>
                  <p className="text-[#3B3355] text-xs sm:text-sm leading-relaxed font-medium">
                    Your photos, Aadhaar cards, marks cards, and confidential documents never leave your browser memory.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] hover:border-[#FF4E02] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4E02]/10 text-[#FF4E02] flex items-center justify-center border border-[#FF4E02]/30">
                    <Zap className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-[#1400C3] text-base">
                    Instant Execution Speed
                  </h4>
                  <p className="text-[#3B3355] text-xs sm:text-sm leading-relaxed font-medium">
                    No uploading wait time, no server queueing, and no slow download speeds. Processing happens at your computer's native speed.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <div className="space-y-3 p-5 rounded-2xl bg-[#F8F2D8]/60 border border-[#E5DCB8] hover:border-[#1400C3] transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-[#1400C3]/10 text-[#1400C3] flex items-center justify-center border border-[#1400C3]/20">
                    <CheckCircle className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-[#1400C3] text-base">
                    Zero Limits or Paywalls
                  </h4>
                  <p className="text-[#3B3355] text-xs sm:text-sm leading-relaxed font-medium">
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
            <div className="inline-flex items-center gap-1.5 text-xs text-[#FF4E02] font-black uppercase tracking-wider mb-2 bg-[#FF4E02]/10 px-3 py-1 rounded-full">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1400C3] tracking-tight">
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
              <div className="p-6 rounded-3xl bg-white border border-[#E5DCB8] hover:border-[#1400C3] transition-all duration-300 shadow-sm">
                <h4 className="font-black text-[#1400C3] text-base sm:text-lg mb-2">
                  {faq.q}
                </h4>
                <p className="text-[#3B3355] text-sm leading-relaxed font-medium">
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
