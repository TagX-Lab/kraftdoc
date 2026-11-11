import React, { useState } from "react";
import { Mail, Send, Check, Copy, ArrowLeft } from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import Button from "../components/common/Button";
import { useToast } from "../hooks/useToast";

export default function ContactPage({ onBack }) {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsSubmitted(true);
    showToast("Message sent! We'll reply within 24 hours.", "success");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.supportEmail);
    setCopied(true);
    showToast("Email address copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in space-y-8">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#1400C3] hover:text-[#FF4E02] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Home</span>
        </button>

        <h1 className="font-display text-4xl text-[#1400C3] uppercase">Contact &amp; Support</h1>
        <p className="mt-2 text-sm text-[#3B3355] font-semibold">
          Have a suggestion, noticed an updated exam notification specification, or want to report a bug? Reach out to {siteConfig.company.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Support Card */}
        <div className="p-6 rounded-3xl bg-white border-2 border-[#E5DCB8] space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FF4E02]/15 text-[#FF4E02] flex items-center justify-center">
            <Mail className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-black text-[#1400C3] text-base">Direct Support</h3>
            <p className="text-xs text-[#6B627F] font-semibold mt-1">
              You can write directly to our developer team:
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F2D8] border border-[#E5DCB8] flex items-center justify-between gap-2 shadow-inner">
            <span className="text-xs text-[#1400C3] font-mono font-bold truncate">
              {siteConfig.supportEmail}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1.5 text-[#1400C3] hover:text-[#FF4E02] transition-colors shrink-0 cursor-pointer"
              title="Copy Email"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#FF4E02]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E5DCB8] shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FF4E02]/15 text-[#FF4E02] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="font-black text-[#1400C3] text-xl">Thank You!</h3>
              <p className="text-xs text-[#3B3355] font-semibold max-w-sm mx-auto">
                Your message has been received. Our support team at {siteConfig.company.name} will get back to you shortly.
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setName("");
                  setEmail("");
                  setSubject("");
                  setMessage("");
                }}
                variant="outline"
                size="sm"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1400C3] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                    placeholder="e.g. Ramesh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1400C3] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                    placeholder="ramesh@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1400C3] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                  placeholder="e.g. TNPSC Specification Update"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1400C3] mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#F8F2D8]/60 border-2 border-[#E5DCB8] rounded-xl px-3.5 py-2.5 text-sm text-[#1400C3] font-bold focus:outline-none focus:border-[#1400C3]"
                  placeholder="Describe your issue or suggestion..."
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="orange"
                size="md"
                icon={Send}
                className="w-full sm:w-auto"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
