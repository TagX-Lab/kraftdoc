import React from "react";
import { Sparkles, ExternalLink, Globe } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-[#D6CA9E] bg-[#EFE6C4] mt-12 sm:mt-16 text-[#3B3355] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brand & Studio Lockup */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1400C3] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-[#F8F2D8]" />
              </div>
              <span className="font-display text-xl text-[#1400C3] tracking-tight">
                {siteConfig.name}
              </span>
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF4E02] text-white hover:bg-[#1400C3] transition-colors"
              >
                by {siteConfig.company.name} ↗
              </a>
            </div>

            <p className="text-[#3B3355] text-xs max-w-sm leading-relaxed font-semibold">
              100% private, client-side tools to compress images, resize photos, and manipulate PDFs directly in your browser. Zero cloud uploads.
            </p>

            {/* Studio Socials Inline Row */}
            <div className="flex items-center gap-2 pt-1 text-[#1400C3]">
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/90 hover:bg-[#1400C3] text-[#1400C3] hover:text-white border border-[#D6CA9E] transition-all shadow-xs cursor-pointer"
                title="TAGX Labs Official Website"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteConfig.company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/90 hover:bg-[#FF4E02] text-[#1400C3] hover:text-white border border-[#D6CA9E] transition-all shadow-xs cursor-pointer"
                title="Instagram (@tagx_lab)"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteConfig.company.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/90 hover:bg-[#1400C3] text-[#1400C3] hover:text-white border border-[#D6CA9E] transition-all shadow-xs cursor-pointer"
                title="GitHub (@tagx-lab)"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] font-bold text-[#6B627F] ml-1">
                TAGX Labs™ Ecosystem
              </span>
            </div>
          </div>

          {/* Nav Columns: Tools, Ecosystem, Trust & Legal */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Column 1: Popular Tools */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1400C3] mb-2.5">
                Popular Tools
              </h4>
              <ul className="space-y-1.5 font-semibold text-xs text-[#3B3355]">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("exam-resizer")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Photo Resizer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("compress-image")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Image Compressor
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("images-to-pdf")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Images to PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("pdf-merge-split")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    PDF Merge &amp; Split
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("image-converter")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Image Converter
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("pdf-organizer")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    PDF Organizer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("pdf-watermark")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Watermark PDF
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("pdf-page-numbers")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Page Numbers
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: TAGX Labs Ecosystem */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1400C3] mb-2.5">
                Ecosystem
              </h4>
              <ul className="space-y-2 font-semibold text-xs">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1400C3]"></span>
                    <span>MousePilot™ (Win)</span>
                    <ExternalLink className="w-3 h-3 text-[#6B627F]" />
                  </a>
                </li>
                <li>
                  <span className="text-[#6B627F] text-xs flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E02]"></span>
                    <span>DocuPix Suite</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Legal */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1400C3] mb-2.5">
                Trust &amp; Legal
              </h4>
              <ul className="space-y-1.5 font-semibold text-xs text-[#3B3355]">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("about")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    About Us &amp; Studio
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("privacy-policy")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("terms")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("contact")}
                    className="hover:text-[#FF4E02] transition-colors cursor-pointer text-left"
                  >
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slim Corporate Bottom Bar */}
        <div className="border-t border-[#D6CA9E]/70 pt-4 mt-6 text-xs text-[#3B3355] font-semibold text-center flex justify-center items-center">
          <p className="text-center">
            &copy; {CURRENT_YEAR} <strong className="text-[#1400C3]">{siteConfig.company.name}</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
