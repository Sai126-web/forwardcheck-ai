import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Network, Flame, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 text-xs text-[#94A3B8] leading-relaxed">
      <div className="border-b border-[#283548] pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">About ForwardCheck AI</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Building public trust through inspectable evidence and transparent verification.
        </p>
      </div>

      <div className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-[#F1F3F7]">Our Mission</h2>
        <p>
          In a media ecosystem flooded with forwarded chain messages, viral screenshots, and panic-inducing rumors, traditional fact-checking has struggled to keep pace. Black-box AI answers have created additional skepticism because users cannot tell where an AI model obtained its facts.
        </p>
        <p>
          ForwardCheck AI was created to provide a serious, forensic workspace where every claim can be traced back to its primary source quote. By combining TruthGraph topological navigation with explainable rhetoric analysis (the Bait Index), we empower readers to understand the truth behind the forward.
        </p>
      </div>

      <div className="bg-[#141B26] border border-[#283548] p-6 rounded-xl space-y-4">
        <h2 className="text-sm font-bold text-[#F1F3F7]">Key Architectural Commitments</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Hallucinated Confidences:</strong> We never output arbitrary percentages like &ldquo;73% true&rdquo;.</li>
          <li><strong>Inspectable Primary Sources:</strong> Every citation provides clickable canonical links and quoted passages.</li>
          <li><strong>Zero Surveillance:</strong> We do not monitor chats, harvest contact books, or auto-forward messages.</li>
          <li><strong>Open Standards:</strong> Built with Next.js, FastAPI, and Manifest V3 Chrome standards.</li>
        </ul>
      </div>
    </div>
  );
}
