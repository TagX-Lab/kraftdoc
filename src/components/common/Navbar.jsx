import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Menu,
  X,
  FileCheck2,
  Minimize2,
  FileText,
  Layers,
} from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export default function Navbar({ currentRoute, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "All Tools" },
    { id: "exam-resizer", label: "Exam Resizer", icon: FileCheck2 },
    { id: "compress-image", label: "Compress Image", icon: Minimize2 },
    { id: "images-to-pdf", label: "Images to PDF", icon: FileText },
    { id: "pdf-merge-split", label: "PDF Tools", icon: Layers },
    { id: "about", label: "About" },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-800/90 bg-slate-950/85 backdrop-blur-xl shadow-xl shadow-black/40 py-0"
          : "border-b border-transparent bg-transparent backdrop-blur-none py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  {siteConfig.name}
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    FREE
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
                  In-Browser Privacy
                </p>
              </div>
            </div>

            {/* Official Parent Company Tag */}
            <a
              href={siteConfig.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] font-semibold text-sky-300 transition-all hover:scale-105 group"
              title="Visit TAGX Labs Studio"
            >
              <span className="text-slate-400 font-normal">by</span>
              <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                {siteConfig.company.name}
              </span>
              <span className="text-sky-400 text-[10px]">↗</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "text-white bg-slate-800 border border-slate-700/80 shadow-inner"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-70" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl animate-fade-in shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentRoute === item.id
                  ? "text-white bg-slate-800 border border-slate-700"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
