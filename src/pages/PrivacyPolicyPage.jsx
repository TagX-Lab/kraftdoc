import React from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { siteConfig } from "../config/siteConfig";

export default function PrivacyPolicyPage({ onBack }) {
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
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        </div>
        <p className="text-xs text-slate-400">
          Official policy of {siteConfig.company.name} &bull; Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
          <h3 className="font-bold text-white text-base mb-1">
            Summary: We Never See or Store Your Files
          </h3>
          <p className="text-xs text-slate-300">
            {siteConfig.name} is an official in-house product of {siteConfig.company.name}. Unlike traditional conversion sites, our platform operates 100% on the client side (in your web browser). All image and PDF operations occur within your computer's local memory. No uploaded files, photos, or documents are ever transferred to or saved on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Do Not Collect</h2>
          <p>
            When you use our tools to resize photos, compress images, or merge PDFs:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>We do NOT store your images or documents.</li>
            <li>We do NOT transmit your data to any third-party servers.</li>
            <li>We do NOT collect facial data, biometric information, or signature data.</li>
            <li>Your files are automatically cleared from browser memory as soon as you close or refresh the tab.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Log Files and Analytics</h2>
          <p>
            Like most websites, {siteConfig.name} may log non-personally identifiable information automatically transmitted by your web browser, such as browser type, operating system, referring URL, and timestamps. This data is strictly used for site administration and performance monitoring.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Cookies and Advertising Partners</h2>
          <p>
            We may use third-party advertising partners, including Google AdSense, to display ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to this website or other websites.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to users based on their visits to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Contact Us</h2>
          <p>
            If you have any questions or feedback regarding our privacy practices, please contact us at{" "}
            <span className="text-indigo-400 font-medium">{siteConfig.supportEmail}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}
