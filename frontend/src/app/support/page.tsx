"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Check } from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs text-[#94A3B8] leading-relaxed">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Support & Discrepancy Reporting</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Report an evidence discrepancy, submit feedback, or contact our research engineers.
        </p>
      </div>

      <div className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-4">
        {submitted ? (
          <div className="text-center py-8 space-y-2">
            <Check className="w-8 h-8 text-[#35AA9E] mx-auto" />
            <h3 className="text-sm font-bold text-[#F1F3F7]">Report Received</h3>
            <p className="text-xs text-[#94A3B8]">
              Thank you for helping us maintain evidentiary integrity. Our research team will review the cited records.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#94A3B8] block mb-1">
                Your Email (optional, for follow-up):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@example.org"
                className="w-full bg-[#0B0F17] border border-[#283548] rounded-lg p-2.5 text-xs text-[#F1F3F7] outline-none focus:border-[#6665E8]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#94A3B8] block mb-1">
                Discrepancy Details or Additional Evidence Link:
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe the investigation ID and any official counter-evidence or gazette URL..."
                className="w-full bg-[#0B0F17] border border-[#283548] rounded-lg p-3 text-xs text-[#F1F3F7] outline-none focus:border-[#6665E8]"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
