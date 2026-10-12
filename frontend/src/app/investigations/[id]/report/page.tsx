"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Network,
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  Languages,
  ShieldCheck,
  ArrowLeft,
  Quote,
  Flame,
  AlertTriangle,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationDetail } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";
import { BaitIndexGauge } from "@/components/BaitIndexGauge";
import { PushPin } from "@/components/common/PushPin";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();

  const [investigation, setInvestigation] = useState<InvestigationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<"en" | "hi" | "mr">("en");
  const [copiedRebuttal, setCopiedRebuttal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    api
      .getInvestigation(id)
      .then((inv) => setInvestigation(inv))
      .catch((err) => console.error("Error loading investigation report:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const copyRebuttal = async () => {
    if (investigation?.report?.whatsapp_rebuttal) {
      await navigator.clipboard.writeText(investigation.report.whatsapp_rebuttal);
      setCopiedRebuttal(true);
      setTimeout(() => setCopiedRebuttal(false), 2500);
    }
  };

  const handleShare = async () => {
    try {
      const res = await api.createShareLink(id);
      const fullUrl = `${window.location.origin}${res.share_url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleExportJson = () => {
    if (!investigation) return;
    const blob = new Blob([JSON.stringify(investigation, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forwardcheck-${investigation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-xs text-[#A3907C] font-mono">
        Loading forensic verification dossier...
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="p-12 text-center text-xs text-[#A3907C] font-mono">
        Report record not found.
      </div>
    );
  }

  const { report, claims, bait_summary } = investigation;

  // Selected explanation text
  let explanationText = report?.plain_explanation_en || "";
  if (activeLang === "hi" && report?.plain_explanation_hi) {
    explanationText = report.plain_explanation_hi;
  } else if (activeLang === "mr" && report?.plain_explanation_mr) {
    explanationText = report.plain_explanation_mr;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 print:p-0">
      {/* Top Controls & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D291A] pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <Link
            href={`/investigations/${id}/graph`}
            className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:underline font-mono font-bold"
          >
            <Network className="w-4 h-4" />
            <span>Open in TruthGraph Canvas</span>
          </Link>
          <span className="text-[#5C3F27]">•</span>
          <Link
            href="/investigations"
            className="text-xs text-[#A3907C] hover:text-[#F1E8D9] font-mono"
          >
            History Archive
          </Link>
        </div>

        {/* Action Buttons: Export, Print, Share */}
        <div className="flex items-center gap-2 flex-wrap font-mono">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 bg-[#1C150F] hover:bg-[#251D16] text-[#A3907C] hover:text-[#F1E8D9] px-3 py-1.5 rounded-lg text-xs border border-[#3D291A]"
            title="Export full investigation data as structured JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#1C150F] hover:bg-[#251D16] text-[#A3907C] hover:text-[#F1E8D9] px-3 py-1.5 rounded-lg text-xs border border-[#3D291A]"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-[#241A12] hover:bg-[#342418] text-[#F1E8D9] px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#4D331E]"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#35AA9E]" />
                <span className="text-[#35AA9E]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Report Header - Manila Dossier Styling */}
      <div className="relative bg-[#1A140E] border-2 border-[#4A3220] rounded-2xl p-6 sm:p-8 space-y-4 shadow-evidence">
        {/* Top Center Brass PushPin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <PushPin color="brass" size="lg" />
        </div>

        {/* Top Manila Tab / Header */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-[10px] font-mono uppercase bg-[#100C08] text-[#D97706] px-2 py-0.5 rounded border border-[#3D291A] font-bold">
            CASE DOSSIER #{investigation.id.slice(0, 8).toUpperCase()}
          </span>
          <ModeBadge mode={investigation.execution_mode} />
          <span className="text-xs text-[#A3907C] font-mono capitalize">
            {investigation.input_type} Input
          </span>
          <span className="text-xs text-[#5C3F27]">•</span>
          <span className="text-xs text-[#8C7A68] font-mono">
            {new Date(investigation.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F1E8D9] font-mono leading-snug">
          {investigation.title}
        </h1>

        {/* Overall Verdict Banner */}
        <div className="bg-[#100C08] border-2 border-[#3D291A] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D97706] font-bold block">
              Overall Forensic Conclusion
            </span>
            <p className="text-xs text-[#F1E8D9] font-mono leading-relaxed">
              {report?.overall_conclusion}
            </p>
          </div>
          <VerdictBadge verdict={investigation.overall_verdict} size="lg" className="self-start sm:self-auto shrink-0" />
        </div>

        {/* Original Content Snippet */}
        <div className="space-y-1 pt-2">
          <span className="text-[11px] font-mono uppercase text-[#A3907C] font-bold block">
            Ingested Artifact Text:
          </span>
          <p className="bg-[#100C08] p-3 rounded-lg border border-[#3D291A] text-xs text-[#F1E8D9] italic font-mono leading-relaxed max-h-36 overflow-y-auto">
            &ldquo;{investigation.original_content}&rdquo;
          </p>
        </div>
      </div>

      {/* Bait Index Breakdown */}
      <BaitIndexGauge baitSummary={bait_summary} rawText={investigation.original_content} />

      {/* Atomic Claims & Evidence Citations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F1E8D9] font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
            Discrete Atomic Claims ({claims.length})
          </h2>
          <span className="text-xs text-[#A3907C] font-mono">
            Evaluated independently against primary sources
          </span>
        </div>

        <div className="space-y-4">
          {claims.map((claim, idx) => (
            <div
              key={claim.id}
              className="relative bg-[#1C150F] border-2 border-[#3D291A] rounded-xl p-5 space-y-4 shadow-evidence"
            >
              {/* Corner Pushpin */}
              <div className="absolute -top-2.5 left-6">
                <PushPin color="yellow" size="sm" />
              </div>

              {/* Claim Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#342417] pb-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F59E0B]">
                      Claim #{claim.position || idx + 1}
                    </span>
                    <span className="text-[10px] uppercase text-[#8C7A68] font-mono bg-[#110C07] px-1.5 py-0.5 rounded border border-[#342417]">
                      [{claim.category}]
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#F1E8D9] font-mono">
                    {claim.normalized_claim}
                  </h3>
                </div>
                <VerdictBadge verdict={claim.verdict} size="md" className="shrink-0" />
              </div>

              {/* Rationale */}
              <div className="text-xs text-[#A3907C] leading-relaxed font-mono">
                <strong className="text-[#F1E8D9] block mb-1">Grounded Rationale:</strong>
                {claim.verdict_rationale || "No specific rationale recorded."}
              </div>

              {/* Evidence Items */}
              {claim.evidence_items && claim.evidence_items.length > 0 ? (
                <div className="space-y-2.5 pt-2 border-t border-[#342417]">
                  <span className="text-[11px] font-mono font-bold text-[#F1E8D9] block">
                    Verified Corroborating Evidence ({claim.evidence_items.length}):
                  </span>
                  {claim.evidence_items.map((ev, evIdx) => (
                    <div
                      key={ev.id}
                      className="bg-[#120D08] border border-[#3D291A] rounded-lg p-3 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap font-mono">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-[#DC2626]">
                          Citation #{ev.citation_number || evIdx + 1} • {ev.stance.toUpperCase()}
                        </span>
                        {ev.source?.url && (
                          <a
                            href={ev.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#D97706] hover:underline font-medium"
                          >
                            <span>{ev.source.publisher || "Source Link"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <blockquote className="italic text-[#E2E8F0] text-[11px] leading-relaxed pl-2 border-l-2 border-[#DC2626]">
                        &ldquo;{ev.excerpt}&rdquo;
                      </blockquote>

                      <p className="text-[10px] text-[#8C7A68] font-mono">
                        <strong>Relevance:</strong> {ev.relevance_explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#120D08] p-3 rounded-lg border border-[#3D291A] text-xs text-[#A3907C] flex items-center gap-2 font-mono">
                  <Info className="w-4 h-4 text-[#786452] shrink-0" />
                  <span>
                    No independent corroborating public records could be discovered for this specific claim. Classified strictly as <strong>Cannot Confirm</strong>.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Plain Language Summary */}
      <div className="bg-[#1A140E] border-2 border-[#3D291A] rounded-xl p-6 space-y-4 shadow-evidence">
        <div className="flex items-center justify-between border-b border-[#342417] pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#D97706]" />
            <h3 className="text-sm font-bold text-[#F1E8D9] font-mono uppercase tracking-wider">
              Plain-Language Investigative Explanation
            </h3>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-[#100C08] rounded-lg p-0.5 border border-[#3D291A] text-xs font-mono">
            <button
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "en" ? "bg-[#251D16] text-[#F59E0B] font-semibold border border-[#4D331E]" : "text-[#A3907C]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang("hi")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "hi" ? "bg-[#251D16] text-[#F59E0B] font-semibold border border-[#4D331E]" : "text-[#A3907C]"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setActiveLang("mr")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "mr" ? "bg-[#251D16] text-[#F59E0B] font-semibold border border-[#4D331E]" : "text-[#A3907C]"
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        <div className="bg-[#100C08] p-4 rounded-xl border border-[#342417] text-xs text-[#F1E8D9] whitespace-pre-line leading-relaxed font-sans">
          {explanationText}
        </div>
      </div>

      {/* Polite WhatsApp Rebuttal Generator */}
      {report?.whatsapp_rebuttal && (
        <div className="bg-[#1C150F] border-2 border-[#4A3220] rounded-xl p-6 space-y-3 shadow-evidence">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block mb-1 text-[10px] font-mono text-[#D97706] uppercase tracking-wider font-bold">
                FIELD OPERATIVE DE-ESCALATION DISPATCH
              </div>
              <h3 className="text-sm font-bold text-[#F1E8D9] font-mono">
                Polite WhatsApp Factual Rebuttal
              </h3>
              <p className="text-xs text-[#A3907C]">
                A respectful, link-backed correction ready to copy and share in group chats.
              </p>
            </div>
            <button
              onClick={copyRebuttal}
              className="flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md transition-all shrink-0"
            >
              {copiedRebuttal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-200" />
                  <span>Copy Rebuttal</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#100C08] border border-[#3D291A] p-4 rounded-xl font-mono text-xs text-[#F1E8D9] whitespace-pre-line leading-relaxed">
            {report.whatsapp_rebuttal}
          </div>
          <p className="text-[11px] text-[#786452] font-mono">
            ⚠️ User must deliberately review and copy. ForwardCheck AI never auto-sends messages.
          </p>
        </div>
      )}
    </div>
  );
}
