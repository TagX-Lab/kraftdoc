import React from "react";
import { Sparkles, Shield, Heart, ExternalLink, Globe } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-[#D6CA9E] bg-[#EFE6C4] mt-24 text-[#3B3355] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand & Studio Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1400C3] p-0.5 flex items-center justify-center text-white shadow-md shadow-[#1400C3]/20">
                <Sparkles className="w-4 h-4 text-[#F8F2D8]" />
              </div>
              <span className="text-xl font-black text-[#1400C3] tracking-tight">
                {siteConfig.name}
              </span>
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF4E02] text-white hover:bg-[#E04200] transition-colors"
              >
                by {siteConfig.company.name} ↗
              </a>
            </div>

            <p className="text-[#3B3355] text-xs sm:text-sm max-w-sm leading-relaxed font-medium">
              {siteConfig.description}
            </p>

            {/* TAGX Labs Parent Badge */}
            <div className="p-4 rounded-2xl bg-white border border-[#D6CA9E] max-w-sm space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B627F] font-bold">
                  A Product by
                </span>
                <a
                  href={siteConfig.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black text-[#1400C3] hover:text-[#FF4E02] flex items-center gap-1 transition-colors"
                >
                  <span>{siteConfig.company.name}</span>
                  <ExternalLink className="w-3 h-3 text-[#FF4E02]" />
                </a>
              </div>
              <p className="text-xs text-[#6B627F] font-medium">
                {siteConfig.company.tagline}
              </p>
              {/* Studio Socials */}
              <div className="flex items-center gap-2 pt-1 text-[#1400C3]">
                <a
                  href={siteConfig.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#F8F2D8] hover:bg-[#1400C3] hover:text-white transition-all shadow-sm"
                  title="Official Studio Website"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
                <a
                  href={siteConfig.company.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#F8F2D8] hover:bg-[#FF4E02] hover:text-white transition-all shadow-sm"
                  title="Instagram (@tagx_lab)"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={siteConfig.company.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-[#F8F2D8] hover:bg-[#1400C3] hover:text-white transition-all shadow-sm"
                  title="GitHub"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#1400C3] bg-white border border-[#D6CA9E] px-3.5 py-1.5 rounded-xl w-fit font-bold shadow-sm">
              <Shield className="w-4 h-4 text-[#FF4E02] shrink-0" />
              <span>Zero server upload policy: files stay on your device.</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1400C3] mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("exam-resizer")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Govt Exam Photo Resizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("compress-image")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("images-to-pdf")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Images to PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("pdf-merge-split")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  PDF Merge &amp; Split
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("image-converter")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Image Format Converter
                </button>
              </li>
            </ul>
          </div>

          {/* TAGX Labs Ecosystem */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1400C3] mb-3">
              TAGX Labs Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
              <li>
                <a
                  href={siteConfig.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1400C3] hover:text-[#FF4E02] flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#FF4E02]" />
                  <span>TAGX Labs Studio</span>
                  <ExternalLink className="w-3 h-3 text-[#6B627F]" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.company.otherProducts[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B3355] hover:text-[#FF4E02] flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1400C3]"></span>
                  <span>MousePilot™ (Windows)</span>
                  <ExternalLink className="w-3 h-3 text-[#6B627F]" />
                </a>
              </li>
              <li>
                <span className="text-[#6B627F] text-xs flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#FF4E02]"></span>
                  <span>DocuPix (Web Suite)</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (AdSense Mandatories) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1400C3] mb-3">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("about")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  About Us &amp; Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("privacy-policy")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("terms")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="hover:text-[#FF4E02] transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D6CA9E] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#3B3355] font-semibold">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-[#1400C3]">{siteConfig.company.name}</strong>. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-[#FF4E02] fill-[#FF4E02] inline" /> by{" "}
            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1400C3] hover:text-[#FF4E02] font-black underline underline-offset-2"
            >
              {siteConfig.company.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
