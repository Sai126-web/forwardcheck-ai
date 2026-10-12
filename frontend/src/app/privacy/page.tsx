import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs text-[#94A3B8] leading-relaxed">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Privacy & Data Governance</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Our technical commitment to privacy, data minimization, and zero passive surveillance.
        </p>
      </div>

      <div className="space-y-4 bg-[#141B26] border border-[#283548] p-6 rounded-xl">
        <h2 className="text-sm font-bold text-[#F1F3F7]">1. Zero Passive Surveillance</h2>
        <p>
          ForwardCheck AI does not passively intercept WhatsApp chats, scan user contacts, or track browsing behavior across websites. Verification is strictly user-initiated. When you highlight text in our Chrome extension or paste a message into the web workspace, only that approved snippet is analyzed.
        </p>

        <h2 className="text-sm font-bold text-[#F1F3F7] pt-2">2. Ephemeral Storage & Retention</h2>
        <p>
          Uploaded image screenshots, audio clips, and PDFs are processed in secure temporary memory and can be removed at any time. We do not sell user investigation queries or share private forwarded content with marketing networks.
        </p>

        <h2 className="text-sm font-bold text-[#F1F3F7] pt-2">3. Deliberate Sharing</h2>
        <p>
          Share links generated for TruthGraphs and reports are opt-in and unguessable. You retain full control over whether an investigation is shared publicly or kept private to your session.
        </p>
      </div>
    </div>
  );
}
