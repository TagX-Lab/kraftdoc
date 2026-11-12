import React from "react";
import { FileCheck, ArrowLeft } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import { ScotchTape } from "../../components/comic/TornPaperEdge";

const LAST_UPDATED_DATE = "November 2026";

export default function TermsPage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-8 font-sans text-white">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#FF3E18] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="w-8 h-8 text-[#FF3E18]" />
          <h1 className="font-comic text-5xl sm:text-7xl text-white uppercase tracking-tight leading-none">
            TERMS OF <span className="text-[#FF3E18]">SERVICE</span>
          </h1>
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Official terms of {siteConfig.company.name} &bull; Last updated: {LAST_UPDATED_DATE}
        </p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="relative p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-white/15 space-y-3 shadow-xl">
          <ScotchTape className="-top-3 right-8" rotate="-3deg" />

          <h2 className="font-comic text-2xl text-white uppercase">1. ACCEPTANCE OF TERMS</h2>
          <p className="font-medium text-gray-300">
            By accessing and using {siteConfig.name} (an official product of <strong className="text-white font-bold">{siteConfig.company.name}</strong>), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">2. PERMITTED USE</h2>
          <p className="font-medium text-gray-400">
            {siteConfig.name} provides free client-side image and document utilities. You may use our tools for personal, educational, or commercial purposes. You agree not to abuse, disrupt, or attempt to reverse-engineer our web application.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">3. EXAM PRESET DISCLAIMER</h2>
          <p className="font-medium text-gray-400">
            While our government exam presets (for TNPSC, SSC, UPSC, IBPS, etc.) are meticulously updated according to official recruitment notifications, exam conducting bodies may alter specifications at their discretion. It is the user&apos;s sole responsibility to verify the final requirements listed in the official notification.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">4. LIMITATION OF LIABILITY</h2>
          <p className="font-medium text-gray-400">
            {siteConfig.name} is provided by {siteConfig.company.name} on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. Under no circumstances will {siteConfig.company.name} or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website.
          </p>
        </section>
      </div>
    </div>
  );
}