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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="w-6 h-6 text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        </div>
        <p className="text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using {siteConfig.name}, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Permitted Use</h2>
          <p>
            {siteConfig.name} provides free client-side image and document utilities. You may use our tools for personal, educational, or commercial purposes. You agree not to abuse, disrupt, or attempt to reverse-engineer our web application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Exam Preset Disclaimer</h2>
          <p>
            While our government exam presets (for TNPSC, SSC, UPSC, IBPS, etc.) are meticulously updated according to official recruitment notifications, exam conducting bodies may alter specifications at their discretion. It is the user's sole responsibility to verify the final requirements listed in the official notification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
          <p>
            {siteConfig.name} is provided on an "as is" and "as available" basis without warranties of any kind. Under no circumstances will {siteConfig.name} or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this website.
          </p>
        </section>
      </div>
    </div>
  );
}
