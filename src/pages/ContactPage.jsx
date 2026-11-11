import React, { useState } from "react";
import { Mail, Send, Check, Copy, ArrowLeft } from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastContext";

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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-3xl font-extrabold text-white">Contact & Support</h1>
        <p className="mt-2 text-sm text-slate-400">
          Have a suggestion, noticed an updated exam notification specification, or want to report a bug? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Support Card */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Direct Support</h3>
            <p className="text-xs text-slate-400 mt-1">
              You can write directly to our developer team:
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300 font-mono truncate">
              {siteConfig.supportEmail}
            </span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
              title="Copy Email"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/60">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-lg">Thank You!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your message has been received. Our support team will get back to you shortly.
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Ramesh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="ramesh@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. TNPSC Specification Update"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Describe your issue or suggestion..."
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
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
