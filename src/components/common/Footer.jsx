import React from "react";
import { ExternalLink, Globe } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";
import { KraftDocCubeIcon } from "./KraftDocLogo";

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
    <footer className="relative bg-[#0C0C0C] text-white border-t-2 border-white/15 text-xs font-sans mt-0">
      {/* Halftone dot pattern overlay */}
      <div className="absolute inset-0 bg-halftone-white opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Brand & Studio Lockup */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <KraftDocCubeIcon className="w-10 h-10 drop-shadow-[0_4px_12px_rgba(255,62,24,0.35)]" />
              <span className="font-comic text-3xl sm:text-4xl text-white tracking-wider uppercase leading-none">
                {siteConfig.name}
              </span>
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF3E18] text-white hover:bg-white hover:text-black transition-colors shadow-sm"
              >
                BY {siteConfig.company.name} ↗
              </a>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
              100% private, client-side tools to compress images, resize photos, and manipulate PDFs directly in your browser. Zero cloud uploads.
            </p>

            {/* Studio Socials Inline Row */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href={siteConfig.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#141414] hover:bg-[#FF3E18] text-gray-300 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer"
                title="TAGX Labs Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.company.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#141414] hover:bg-[#FF3E18] text-gray-300 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer"
                title="Instagram (@tagx_lab)"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.company.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#141414] hover:bg-[#FF3E18] text-gray-300 hover:text-white border border-white/20 transition-all shadow-md cursor-pointer"
                title="GitHub (@tagx-lab)"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <span className="text-xs font-bold text-gray-500 ml-1">
                TAGX Labs™ Ecosystem
              </span>
            </div>
          </div>

          {/* Ecosystem & Legal Columns (Popular Tools Removed Completely) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* TAGX Labs Ecosystem */}
            <div className="space-y-3">
              <h4 className="font-comic text-xl text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3E18]" />
                <span>ECOSYSTEM</span>
              </h4>
              <div className="space-y-2">
                <a
                  href={siteConfig.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#FF3E18] text-gray-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#FF3E18]" />
                    <div>
                      <div className="text-xs font-bold leading-tight">TAGX Labs Studio</div>
                      <div className="text-[10px] text-gray-500 font-mono">tagxlab.in</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#FF3E18] transition-colors" />
                </a>

                <a
                  href={siteConfig.company.otherProducts[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-[#FF3E18] text-gray-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF3E18]" />
                    <div>
                      <div className="text-xs font-bold leading-tight">MousePilot™ (Win)</div>
                      <div className="text-[10px] text-gray-500 font-mono">mousepilot.tagxlab.in</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#FF3E18] transition-colors" />
                </a>
              </div>
            </div>

            {/* Trust & Legal */}
            <div className="space-y-3">
              <h4 className="font-comic text-xl text-white uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3E18]" />
                <span>TRUST &amp; LEGAL</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "about", name: "About Us" },
                  { id: "privacy-policy", name: "Privacy Policy" },
                  { id: "terms", name: "Terms of Service" },
                  { id: "contact", name: "Contact Support" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className="p-2 rounded-xl bg-[#141414] border border-white/10 hover:border-[#FF3E18] hover:bg-[#FF3E18] text-gray-300 hover:text-white text-xs font-bold transition-all text-center cursor-pointer truncate"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Bottom Bar */}
        <div className="border-t border-white/10 pt-6 mt-10 text-xs text-gray-400 font-medium text-center">
          <p>
            &copy; {CURRENT_YEAR} <strong className="text-white">{siteConfig.company.name}</strong>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}