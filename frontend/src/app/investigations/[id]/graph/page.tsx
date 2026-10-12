"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Network,
  FileText,
  Share2,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  Check,
  Copy,
} from "lucide-react";
import { api } from "@/lib/api";
import { TruthGraphData, InvestigationDetail } from "@/lib/types";
import { TruthGraphCanvas } from "@/components/graph/TruthGraphCanvas";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";

export default function TruthGraphPage() {
  const { id } = useParams<{ id: string }>();

  const [graphData, setGraphData] = useState<TruthGraphData | null>(null);
  const [investigation, setInvestigation] = useState<InvestigationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    Promise.all([api.getGraph(id), api.getInvestigation(id)])
      .then(([g, inv]) => {
        setGraphData(g);
        setInvestigation(inv);
      })
      .catch((err) => console.error("Error loading graph:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    try {
      const res = await api.createShareLink(id);
      const fullUrl = `${window.location.origin}${res.share_url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Fallback copy current url
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-xs text-[#94A3B8]">
        Loading TruthGraph forensic topology...
      </div>
    );
  }

  if (!graphData || !investigation) {
    return (
      <div className="p-12 text-center text-xs text-[#94A3B8]">
        Investigation not found or graph records missing.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workspace Top Toolbar */}
      <div className="bg-[#18130E] border-2 border-[#3D291A] p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-evidence">
        {/* Left: Investigation Details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/investigations"
              className="text-[#A3907C] hover:text-[#F1E8D9] inline-flex items-center gap-1 text-xs font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>
            <span className="text-[#5C3F27]">•</span>
            <ModeBadge mode={investigation.execution_mode} />
            <VerdictBadge verdict={investigation.overall_verdict} size="sm" />
          </div>

          <h1 className="text-base font-bold text-[#F1E8D9] line-clamp-1 font-mono tracking-tight">{investigation.title}</h1>

          <div className="flex items-center gap-3 text-xs text-[#A3907C] font-mono">
            <span>
              Bait Index:{" "}
              <strong className="text-[#C084FC] font-mono">{investigation.bait_score}/100</strong>
            </span>
            <span>•</span>
            <span>{investigation.claims.length} Atomic Claims</span>
            <span>•</span>
            <span className="text-[#D97706]">Evidence Corkboard Active</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-[#241A12] hover:bg-[#342418] text-[#F1E8D9] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#4A3220] transition-colors font-mono"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#35AA9E]" />
                <span className="text-[#35AA9E]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Share Graph</span>
              </>
            )}
          </button>

          <Link
            href={`/investigations/${id}/report`}
            className="flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all font-mono"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Forensic Report</span>
          </Link>
        </div>
      </div>

      {/* Main TruthGraph Canvas */}
      <TruthGraphCanvas graphData={graphData} />
    </div>
  );
}
