import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs text-[#94A3B8] leading-relaxed">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Terms of Service</h1>
        <p className="text-xs text-[#94A3B8] mt-1">Acceptable use and factual verification guidelines.</p>
      </div>

      <div className="space-y-4 bg-[#141B26] border border-[#283548] p-6 rounded-xl">
        <h2 className="text-sm font-bold text-[#F1F3F7]">1. Purpose of Service</h2>
        <p>
          ForwardCheck AI is an evidentiary verification research platform designed to provide inspectable references for claims circulating in digital media. Information provided by the platform is based on available public evidence at the time of retrieval.
        </p>

        <h2 className="text-sm font-bold text-[#F1F3F7] pt-2">2. Prohibited Uses</h2>
        <p>
          Users may not use ForwardCheck AI to ingest malware, launch automated denial-of-service queries, attempt SSRF attacks against internal network endpoints, or generate fabricated fact checks.
        </p>

        <h2 className="text-sm font-bold text-[#F1F3F7] pt-2">3. Limitation of Liability</h2>
        <p>
          Verification verdicts represent evidence-grounded assessments derived from accessible third-party databases and news archives. Users should exercise independent judgment on legal, medical, and emergency matters.
        </p>
      </div>
    </div>
  );
}
