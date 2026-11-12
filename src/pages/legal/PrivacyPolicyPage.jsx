import React from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import { ScotchTape } from "../../components/comic/TornPaperEdge";

const LAST_UPDATED_DATE = "November 2026";

export default function PrivacyPolicyPage({ onBack }) {
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
          <ShieldCheck className="w-8 h-8 text-[#FF3E18]" />
          <h1 className="font-comic text-5xl sm:text-7xl text-white uppercase tracking-tight leading-none">
            PRIVACY <span className="text-[#FF3E18]">POLICY</span>
          </h1>
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Official policy of {siteConfig.company.name} &bull; Last updated: {LAST_UPDATED_DATE}
        </p>
      </div>

      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="relative p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-[#FF3E18] shadow-2xl space-y-3">
          <ScotchTape className="-top-3 right-6" rotate="3deg" />

          <h3 className="font-comic text-2xl text-[#FF3E18] uppercase tracking-wide">
            SUMMARY: WE NEVER SEE OR STORE YOUR FILES
          </h3>
          <p className="text-sm text-gray-300 font-medium leading-relaxed">
            {siteConfig.name} is an official in-house product of <strong className="text-white font-bold">{siteConfig.company.name}</strong>. Unlike traditional conversion sites, our platform operates 100% on the client side (in your web browser). All image and PDF operations occur within your computer&apos;s local memory. No uploaded files, photos, or documents are ever transferred to or saved on our servers.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">1. INFORMATION WE DO NOT COLLECT</h2>
          <p className="font-medium text-gray-300">
            When you use our tools to resize photos, compress images, or merge PDFs:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium text-gray-400">
            <li>We do NOT store your images or documents.</li>
            <li>We do NOT transmit your data to any third-party servers.</li>
            <li>We do NOT collect facial data, biometric information, or signature data.</li>
            <li>Your files are automatically cleared from browser memory as soon as you close or refresh the tab.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">2. LOG FILES AND ANALYTICS</h2>
          <p className="font-medium text-gray-400">
            Like most websites, {siteConfig.name} may log non-personally identifiable information automatically transmitted by your web browser, such as browser type, operating system, referring URL, and timestamps. This data is strictly used for site administration and performance monitoring.
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">3. COOKIES AND ADVERTISING PARTNERS</h2>
          <p className="font-medium text-gray-400">
            We may use third-party advertising partners, including Google AdSense, to display ads when you visit our website. These companies may use cookies to serve ads based on your prior visits to this website or other websites.
          </p>
          <p className="font-medium text-gray-400">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF3E18] font-bold underline"
            >
              Google Ad Settings
            </a>
            .
          </p>
        </section>

        <section className="p-6 rounded-2xl bg-[#141414] border border-white/15 space-y-3 shadow-xl">
          <h2 className="font-comic text-2xl text-white uppercase">4. CONTACT US</h2>
          <p className="font-medium text-gray-400">
            If you have any questions or feedback regarding our privacy practices, please contact <strong className="text-white">{siteConfig.company.name}</strong> at{" "}
            <span className="text-[#FF3E18] font-black">{siteConfig.supportEmail}</span>.
          </p>
        </section>
      </div>
    </div>
  );
}