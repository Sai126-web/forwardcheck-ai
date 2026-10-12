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
      .catch((err) => console.error("Error loading report:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const copyRebuttal = () => {
    if (investigation?.report?.whatsapp_rebuttal) {
      navigator.clipboard.writeText(investigation.report.whatsapp_rebuttal);
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
      <div className="h-[600px] flex items-center justify-center text-xs text-[#94A3B8]">
        Loading forensic verification report...
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="p-12 text-center text-xs text-[#94A3B8]">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283548] pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <Link
            href={`/investigations/${id}/graph`}
            className="flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline font-semibold"
          >
            <Network className="w-4 h-4" />
            <span>Open in TruthGraph Canvas</span>
          </Link>
          <span className="text-[#64748B]">•</span>
          <Link
            href="/investigations"
            className="text-xs text-[#94A3B8] hover:text-[#F1F3F7]"
          >
            History Archive
          </Link>
        </div>

        {/* Action Buttons: Export, Print, Share */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 bg-[#141B26] hover:bg-[#1B2331] text-[#94A3B8] hover:text-[#F1F3F7] px-3 py-1.5 rounded-lg text-xs border border-[#283548]"
            title="Export full investigation data as structured JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#141B26] hover:bg-[#1B2331] text-[#94A3B8] hover:text-[#F1F3F7] px-3 py-1.5 rounded-lg text-xs border border-[#283548]"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-[#1B2331] hover:bg-[#283548] text-[#F1F3F7] px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#283548]"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#35AA9E]" />
                <span className="text-[#35AA9E]">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#6665E8]" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Report Header */}
      <div className="bg-[#141B26] border border-[#283548] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <ModeBadge mode={investigation.execution_mode} />
          <span className="text-xs text-[#94A3B8] font-mono capitalize">
            {investigation.input_type} Input
          </span>
          <span className="text-xs text-[#64748B]">•</span>
          <span className="text-xs text-[#64748B]">
            ID: {investigation.id.slice(0, 8)}
          </span>
          <span className="text-xs text-[#64748B]">•</span>
          <span className="text-xs text-[#64748B]">
            {new Date(investigation.created_at).toLocaleString()}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F1F3F7] leading-snug">
          {investigation.title}
        </h1>

        {/* Overall Verdict Banner */}
        <div className="bg-[#0B0F17] border border-[#283548] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] block">
              Overall Forensic Conclusion
            </span>
            <p className="text-xs text-[#F1F3F7] leading-relaxed">
              {report?.overall_conclusion}
            </p>
          </div>
          <VerdictBadge verdict={investigation.overall_verdict} size="lg" className="self-start sm:self-auto shrink-0" />
        </div>

        {/* Original Content Snippet */}
        <div className="space-y-1 pt-2">
          <span className="text-[11px] font-semibold text-[#94A3B8] block">Ingested Artifact Text:</span>
          <p className="bg-[#0B0F17] p-3 rounded-lg border border-[#283548] text-xs text-[#F1F3F7] italic leading-relaxed max-h-36 overflow-y-auto">
            &ldquo;{investigation.original_content}&rdquo;
          </p>
        </div>
      </div>

      {/* Bait Index Breakdown */}
      <BaitIndexGauge baitSummary={bait_summary} rawText={investigation.original_content} />

      {/* Atomic Claims & Evidence Citations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#F1F3F7]">
            Discrete Atomic Claims ({claims.length})
          </h2>
          <span className="text-xs text-[#94A3B8]">
            Evaluated independently against primary sources
          </span>
        </div>

        <div className="space-y-4">
          {claims.map((claim, idx) => (
            <div
              key={claim.id}
              className="bg-[#141B26] border border-[#283548] rounded-xl p-5 space-y-4 shadow-md"
            >
              {/* Claim Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#283548] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#6665E8]">
                      Claim #{claim.position || idx + 1}
                    </span>
                    <span className="text-[10px] uppercase text-[#64748B] font-mono">
                      [{claim.category}]
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#F1F3F7]">
                    {claim.normalized_claim}
                  </h3>
                </div>
                <VerdictBadge verdict={claim.verdict} size="md" className="shrink-0" />
              </div>

              {/* Rationale */}
              <div className="text-xs text-[#94A3B8] leading-relaxed">
                <strong className="text-[#F1F3F7] block mb-1">Grounded Rationale:</strong>
                {claim.verdict_rationale || "No specific rationale recorded."}
              </div>

              {/* Evidence Items */}
              {claim.evidence_items && claim.evidence_items.length > 0 ? (
                <div className="space-y-2.5 pt-2 border-t border-[#283548]">
                  <span className="text-[11px] font-semibold text-[#F1F3F7] block">
                    Verified Corroborating Evidence ({claim.evidence_items.length}):
                  </span>
                  {claim.evidence_items.map((ev, evIdx) => (
                    <div
                      key={ev.id}
                      className="bg-[#0B0F17] border border-[#283548] rounded-lg p-3 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-[#6665E8]">
                          Citation #{ev.citation_number || evIdx + 1} • {ev.stance.toUpperCase()}
                        </span>
                        {ev.source?.url && (
                          <a
                            href={ev.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#6665E8] hover:underline font-medium"
                          >
                            <span>{ev.source.publisher || "Source Link"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <blockquote className="italic text-[#F1F3F7] text-[11px] leading-relaxed pl-2 border-l-2 border-[#6665E8]/60">
                        &ldquo;{ev.excerpt}&rdquo;
                      </blockquote>

                      <p className="text-[10px] text-[#94A3B8]">
                        <strong>Relevance:</strong> {ev.relevance_explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0B0F17] p-3 rounded-lg border border-[#283548] text-xs text-[#94A3B8] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#64748B] shrink-0" />
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
      <div className="bg-[#141B26] border border-[#283548] rounded-xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#283548] pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#6665E8]" />
            <h3 className="text-sm font-bold text-[#F1F3F7]">
              Plain-Language Investigative Explanation
            </h3>
          </div>

          {/* Language Switcher Tabs */}
          <div className="flex items-center bg-[#0B0F17] rounded-lg p-0.5 border border-[#283548] text-xs">
            <button
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "en" ? "bg-[#1B2331] text-[#F1F3F7] font-semibold" : "text-[#94A3B8]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang("hi")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "hi" ? "bg-[#1B2331] text-[#F1F3F7] font-semibold" : "text-[#94A3B8]"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setActiveLang("mr")}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeLang === "mr" ? "bg-[#1B2331] text-[#F1F3F7] font-semibold" : "text-[#94A3B8]"
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        <div className="bg-[#0B0F17] p-4 rounded-xl border border-[#283548] text-xs text-[#F1F3F7] whitespace-pre-line leading-relaxed font-sans">
          {explanationText}
        </div>
      </div>

      {/* Polite WhatsApp Rebuttal Generator */}
      {report?.whatsapp_rebuttal && (
        <div className="bg-gradient-to-br from-[#141B26] to-[#1B2331] border border-[#283548] rounded-xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F1F3F7]">
                Polite WhatsApp Factual Rebuttal
              </h3>
              <p className="text-xs text-[#94A3B8]">
                A respectful, link-backed correction ready to copy and share in group chats.
              </p>
            </div>
            <button
              onClick={copyRebuttal}
              className="flex items-center gap-1.5 bg-[#6665E8] hover:bg-[#5756D1] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all shrink-0"
            >
              {copiedRebuttal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Rebuttal</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-[#0B0F17] border border-[#283548] p-4 rounded-xl font-mono text-xs text-[#F1F3F7] whitespace-pre-line leading-relaxed">
            {report.whatsapp_rebuttal}
          </div>
          <p className="text-[11px] text-[#64748B]">
            ⚠️ User must deliberately review and copy. ForwardCheck AI never auto-sends messages.
          </p>
        </div>
      )}
    </div>
  );
}
