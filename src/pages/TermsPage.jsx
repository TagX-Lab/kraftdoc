import React from "react";
import { FileCheck, ArrowLeft } from "lucide-react";
import { siteConfig } from "../config/siteConfig";

export default function TermsPage({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-8">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#1400C3] hover:text-[#FF4E02] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="w-7 h-7 text-[#FF4E02]" />
          <h1 className="text-4xl font-black text-[#1400C3]">Terms of Service</h1>
        </div>
        <p className="text-xs text-[#6B627F] font-bold">
          Official terms of {siteConfig.company.name} &bull; Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#3B3355] leading-relaxed">
        <section className="p-6 rounded-3xl bg-white border border-[#E5DCB8] space-y-3 shadow-sm">
          <h2 className="text-xl font-black text-[#1400C3]">1. Acceptance of Terms</h2>
          <p className="font-medium">
            By accessing and using {siteConfig.name} (an official product of <strong className="text-[#1400C3]">{siteConfig.company.name}</strong>), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-white border border-[#E5DCB8] space-y-3 shadow-sm">
          <h2 className="text-xl font-black text-[#1400C3]">2. Permitted Use</h2>
          <p className="font-medium">
            {siteConfig.name} provides free client-side image and document utilities. You may use our tools for personal, educational, or commercial purposes. You agree not to abuse, disrupt, or attempt to reverse-engineer our web application.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-white border border-[#E5DCB8] space-y-3 shadow-sm">
          <h2 className="text-xl font-black text-[#1400C3]">3. Exam Preset Disclaimer</h2>
          <p className="font-medium">
            While our government exam presets (for TNPSC, SSC, UPSC, IBPS, etc.) are meticulously updated according to official recruitment notifications, exam conducting bodies may alter specifications at their discretion. It is the user's sole responsibility to verify the final requirements listed in the official notification.
          </p>
        </section>

        <section className="p-6 rounded-3xl bg-white border border-[#E5DCB8] space-y-3 shadow-sm">
          <h2 className="text-xl font-black text-[#1400C3]">4. Limitation of Liability</h2>
          <p className="font-medium">
            {siteConfig.name} is provided by {siteConfig.company.name} on an "as is" and "as available" basis without warranties of any kind. Under no circumstances will {siteConfig.company.name} or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website.
          </p>
        </section>
      </div>
    </div>
  );
}
