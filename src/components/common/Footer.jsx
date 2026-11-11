import React from "react";
import { Sparkles, Shield, Heart } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-4 h-4 shrink-0" />
              <span>Zero server upload policy: files are processed strictly in browser memory.</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("exam-resizer")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Govt Exam Photo Resizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("compress-image")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("images-to-pdf")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Images to PDF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("pdf-merge-split")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  PDF Merge & Split
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("image-converter")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Format Converter
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (Crucial for AdSense approval) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("about")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("privacy-policy")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("terms")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for students, job applicants & creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
