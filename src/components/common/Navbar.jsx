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
          ? "border-b border-[#E5DCB8] bg-[#F8F2D8]/95 backdrop-blur-xl shadow-lg shadow-[#1400C3]/5 py-0"
          : "border-b border-transparent bg-transparent backdrop-blur-none py-1.5"
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
              <div className="w-10 h-10 rounded-2xl bg-[#1400C3] shadow-md shadow-[#1400C3]/20 group-hover:rotate-6 group-hover:scale-105 transition-all flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-[#F8F2D8]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl tracking-tight text-[#1400C3] flex items-center gap-1.5 uppercase">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FF4E02] text-white uppercase tracking-wider shadow-xs">
                  FREE
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "text-[#1400C3] bg-white border border-[#E5DCB8] shadow-sm font-bold"
                      : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white/60"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-80" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1400C3] hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5DCB8] bg-[#F8F2D8]/98 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl animate-fade-in shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                currentRoute === item.id
                  ? "text-[#1400C3] bg-white border border-[#E5DCB8]"
                  : "text-[#3B3355] hover:text-[#1400C3] hover:bg-white/60"
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
