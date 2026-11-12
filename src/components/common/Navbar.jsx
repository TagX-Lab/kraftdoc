import React, { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { KraftDocLogo } from "./KraftDocLogo";

const NAV_LINKS = [
  { id: "donate", label: "Donate", icon: Heart },
  { id: "contact", label: "Contact Us" },
  { id: "about", label: "About Us" },
];

const NON_TOOL_ROUTES = new Set([
  "home",
  "donate",
  "contact",
  "about",
  "privacy-policy",
  "terms",
]);

function scrollToElementWhenReady(elementId, maxFrames = 30) {
  let frames = 0;

  const tryScroll = () => {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    frames += 1;
    if (frames < maxFrames) {
      window.requestAnimationFrame(tryScroll);
    }
  };

  tryScroll();
}

/**
 * Sticky top navigation bar displaying the KraftDoc logo and four direct navigation
 * actions (Tools scroll-to-catalog, Donate, Contact Us, About Us).
 */
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleToolsScrollClick = () => {
    setMobileMenuOpen(false);
    if (currentRoute !== "home") {
      onNavigate("home", { skipScrollTop: true });
    }
    scrollToElementWhenReady("tools-catalog");
  };

  const isToolRoute = Boolean(currentRoute && !NON_TOOL_ROUTES.has(currentRoute));

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-[#0C0C0C]/95 backdrop-blur-xl shadow-2xl py-0"
          : "border-b border-transparent bg-[#0C0C0C] py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo (3D Isometric Cube Monogram) */}
          <div className="flex items-center gap-3">
            <KraftDocLogo onNavigate={() => handleNavClick("home")} />
          </div>

          {/* Desktop Navigation: Tools | Donate | Contact Us | About Us */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Primary navigation">
            <button
              type="button"
              onClick={handleToolsScrollClick}
              className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isToolRoute
                  ? "text-white bg-white/15 border-white/20"
                  : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
              }`}
            >
              Tools
            </button>

            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? "text-white bg-white/15 border-white/20"
                      : "text-white/80 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        isActive ? "text-[#FF3E18] fill-[#FF3E18]" : "text-[#FF3E18]"
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer: Tools | Donate | Contact Us | About Us */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0C0C0C]/98 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl animate-fade-in shadow-2xl">
          <button
            type="button"
            onClick={handleToolsScrollClick}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isToolRoute
                ? "text-white bg-white/15"
                : "text-white/80 hover:text-white hover:bg-white/5"
            }`}
          >
            Tools
          </button>

          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "text-white bg-white/15"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 text-[#FF3E18]" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
