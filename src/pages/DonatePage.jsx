import React, { useState } from "react";
import {
  Heart,
  ArrowLeft,
  Coffee,
  Sparkles,
  ShieldCheck,
  Zap,
  Share2,
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import Button from "../components/common/Button";
import { useToast } from "../hooks/useToast";
import { ScotchTape } from "../components/comic/TornPaperEdge";

const PRESET_AMOUNTS = [
  { amount: 49, label: "₹49", caption: "Chai" },
  { amount: 149, label: "₹149", caption: "Coffee" },
  { amount: 499, label: "₹499", caption: "Turbo Fuel" },
];

export default function DonatePage({ onBack, onNavigate }) {
  const { showToast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState(149);
  const [copiedField, setCopiedField] = useState("");

  const donateConfig = siteConfig.donate || {};
  const hasUpi = Boolean(donateConfig.upiId?.trim());
  const hasBuyMeACoffee = Boolean(donateConfig.buyMeACoffeeUrl?.trim());
  const hasDirectPayment = hasUpi || hasBuyMeACoffee;

  const upiLink = hasUpi
    ? `upi://pay?pa=${encodeURIComponent(donateConfig.upiId)}&pn=${encodeURIComponent(
        donateConfig.upiPayeeName || siteConfig.company.name
      )}&am=${selectedAmount}&cu=INR&tn=${encodeURIComponent("KraftDoc Support")}`
    : "";

  const handleCopy = (value, fieldKey, successMessage) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldKey);
    showToast(successMessage, "success");
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleShareKraftDoc = async () => {
    const shareData = {
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      text: "Check out KraftDoc: 23 free in-browser photo & PDF tools with zero cloud uploads!",
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }

    handleCopy(window.location.origin, "share", "KraftDoc link copied to clipboard!");
  };

  const reasons = [
    {
      icon: ShieldCheck,
      title: "100% FREE FOREVER",
      desc: "No paywalls, no file caps, and no account signups — every tool runs locally in browser RAM.",
    },
    {
      icon: Zap,
      title: "NEW OFFLINE TOOLS",
      desc: "Community support fuels faster canvas/WebAssembly optimization and new document utilities.",
    },
    {
      icon: Sparkles,
      title: "INDIE CRAFTED",
      desc: `Built independently by ${siteConfig.company.name} with zero VC lock-in or dark patterns.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in space-y-10 font-sans text-white">
      {/* Page Header */}
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
          <Heart className="w-8 h-8 text-[#FF3E18] fill-[#FF3E18]" />
          <h1 className="font-comic text-5xl sm:text-7xl text-white uppercase tracking-tight leading-none">
            SUPPORT <span className="text-[#FF3E18]">{siteConfig.name}</span>
          </h1>
        </div>
        <p className="mt-2 text-sm sm:text-base text-gray-300 font-medium max-w-2xl">
          Every photo resize and PDF edit on {siteConfig.name} happens privately inside your browser for free. If our toolkit saved you time, here is how you can support our indie studio.
        </p>
      </div>

      {/* Main Support Card */}
      <section className="relative p-6 sm:p-8 rounded-2xl bg-[#141414] border-2 border-white/15 shadow-2xl space-y-6">
        <ScotchTape className="-top-3 right-8" rotate="3deg" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] flex items-center justify-center shrink-0">
              <Coffee className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-comic text-2xl sm:text-3xl text-white uppercase tracking-wide leading-none">
                FUEL FUTURE UPDATES
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1">
                100% optional support for {siteConfig.company.name} open utilities
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] text-[10px] font-black uppercase tracking-wider">
            Zero Subscriptions
          </span>
        </div>

        {hasDirectPayment ? (
          <div className="space-y-5">
            {hasUpi && (
              <div className="p-5 rounded-xl bg-black border border-white/15 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Direct UPI Support (India)
                  </span>
                  <div className="flex items-center gap-2">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => setSelectedAmount(preset.amount)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          selectedAmount === preset.amount
                            ? "bg-[#FF3E18] text-white shadow-md"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {preset.label} &bull; {preset.caption}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-[#141414] border border-white/15 rounded-xl px-3.5 py-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {donateConfig.upiId}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(donateConfig.upiId, "upi", "UPI ID copied to clipboard!")
                      }
                      className="p-1 text-gray-400 hover:text-[#FF3E18] transition-colors cursor-pointer"
                      title="Copy UPI ID"
                    >
                      {copiedField === "upi" ? (
                        <Check className="w-4 h-4 text-[#FF3E18]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <a
                    href={upiLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF3E18] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Pay ₹{selectedAmount} via UPI App</span>
                  </a>
                </div>
              </div>
            )}

            {hasBuyMeACoffee && (
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={donateConfig.buyMeACoffeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF3E18] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Buy Me a Coffee</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-black border border-white/15 space-y-4">
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
              Direct payment links (UPI / Buy Me a Coffee) are not linked yet. Want to sponsor {siteConfig.name} directly, collaborate with {siteConfig.company.name}, or drop a kind note? Reach out via our support inbox or back us on GitHub!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="orange"
                size="sm"
                icon={MessageSquare}
                onClick={() => onNavigate?.("contact")}
              >
                Sponsor / Contact Team
              </Button>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    siteConfig.supportEmail,
                    "email",
                    "Studio email copied to clipboard!"
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] border border-white/20 hover:border-[#FF3E18] text-xs font-bold text-gray-200 hover:text-white transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF3E18]" />
                <span className="font-mono">{siteConfig.supportEmail}</span>
                {copiedField === "email" ? (
                  <Check className="w-3.5 h-3.5 text-[#FF3E18]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Free Ways to Help Strip */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={copiedField === "share" ? Check : Share2}
              onClick={handleShareKraftDoc}
            >
              {copiedField === "share" ? "Link Copied!" : "Share KraftDoc"}
            </Button>

            <a
              href={donateConfig.githubUrl || siteConfig.company.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black border border-white/15 hover:border-[#FF3E18] text-xs font-bold text-gray-200 hover:text-white transition-all"
            >
              <span>Follow @tagx-lab on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF3E18]" />
            </a>
          </div>

          <span className="text-[11px] font-bold text-gray-400">
            Sharing with friends helps just as much!
          </span>
        </div>
      </section>

      {/* Why Support Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {reasons.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-[#141414] border border-white/15 space-y-2 shadow-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF3E18]/15 border border-[#FF3E18]/30 text-[#FF3E18] flex items-center justify-center">
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-comic text-xl text-white uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
