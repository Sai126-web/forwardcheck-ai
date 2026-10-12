"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Flame,
  FileText,
  Image as ImageIcon,
  Mic,
  Globe,
  FileUp,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationSummary } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";

export default function DashboardPage() {
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listInvestigations()
      .then((data) => setInvestigations(data))
      .catch((err) => console.error("Error loading investigations:", err))
      .finally(() => setLoading(false));
  }, []);

  // Compute metrics from actual saved records
  const totalCount = investigations.length;
  const verifiedCount = investigations.filter((i) => i.overall_verdict === "Verified").length;
  const falseCount = investigations.filter((i) => i.overall_verdict === "False").length;
  const outdatedCount = investigations.filter((i) => i.overall_verdict === "Outdated").length;
  const partialCount = investigations.filter((i) => i.overall_verdict === "Partially Supported").length;
  const cannotConfirmCount = investigations.filter((i) => i.overall_verdict === "Cannot Confirm").length;

  const avgBaitScore =
    totalCount > 0
      ? Math.round(investigations.reduce((acc, curr) => acc + (curr.bait_score || 0), 0) / totalCount)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header with Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283548] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F3F7]">Forensic Dashboard</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Overview of investigated forwards, claims decomposition, and evidence telemetry.
          </p>
        </div>

        <Link
          href="/investigations/new"
          className="inline-flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </Link>
      </div>

      {/* Real Computed Telemetry Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#141B26] border border-[#283548] p-4 rounded-xl">
          <span className="text-[10px] text-[#94A3B8] uppercase block">Total Analyzed</span>
          <span className="text-2xl font-extrabold text-[#F1F3F7] mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-[#64748B]">All modalities</span>
        </div>

        <div className="bg-[#141B26] border border-[#E56D68]/30 p-4 rounded-xl">
          <span className="text-[10px] text-[#E56D68] uppercase block">False Claims</span>
          <span className="text-2xl font-extrabold text-[#E56D68] mt-1 block">{falseCount}</span>
          <span className="text-[10px] text-[#94A3B8]">Directly debunked</span>
        </div>

        <div className="bg-[#141B26] border border-[#35AA9E]/30 p-4 rounded-xl">
          <span className="text-[10px] text-[#35AA9E] uppercase block">Verified</span>
          <span className="text-2xl font-extrabold text-[#35AA9E] mt-1 block">{verifiedCount}</span>
          <span className="text-[10px] text-[#94A3B8]">Primary corroborated</span>
        </div>

        <div className="bg-[#141B26] border border-[#DEA44C]/30 p-4 rounded-xl">
          <span className="text-[10px] text-[#DEA44C] uppercase block">Outdated</span>
          <span className="text-2xl font-extrabold text-[#DEA44C] mt-1 block">{outdatedCount}</span>
          <span className="text-[10px] text-[#94A3B8]">Expired parameters</span>
        </div>

        <div className="bg-[#141B26] border border-[#E28B57]/30 p-4 rounded-xl">
          <span className="text-[10px] text-[#E28B57] uppercase block">Partially True</span>
          <span className="text-2xl font-extrabold text-[#E28B57] mt-1 block">{partialCount}</span>
          <span className="text-[10px] text-[#94A3B8]">Missing context</span>
        </div>

        <div className="bg-[#141B26] border border-[#9670D7]/30 p-4 rounded-xl">
          <span className="text-[10px] text-[#9670D7] uppercase block">Avg Bait Score</span>
          <span className="text-2xl font-extrabold text-[#9670D7] mt-1 block">{avgBaitScore}/100</span>
          <span className="text-[10px] text-[#94A3B8]">Heuristic rhetoric</span>
        </div>
      </div>

      {/* Quick Input Modality Launchers */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-[#F1F3F7]">Quick Ingestion Launchers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Pasted Text", type: "text", icon: <FileText className="w-4 h-4 text-[#6665E8]" /> },
            { label: "Screenshot", type: "screenshot", icon: <ImageIcon className="w-4 h-4 text-[#35AA9E]" /> },
            { label: "PDF Notice", type: "pdf", icon: <FileUp className="w-4 h-4 text-[#DEA44C]" /> },
            { label: "Voice Note", type: "audio", icon: <Mic className="w-4 h-4 text-[#9670D7]" /> },
            { label: "Public URL", type: "url", icon: <Globe className="w-4 h-4 text-[#35AA9E]" /> },
            { label: "Image Poster", type: "photograph", icon: <ImageIcon className="w-4 h-4 text-[#E28B57]" /> },
          ].map((item) => (
            <Link
              key={item.type}
              href={`/investigations/new?type=${item.type}`}
              className="bg-[#141B26] hover:bg-[#1B2331] border border-[#283548] p-3 rounded-lg flex items-center gap-2.5 text-xs text-[#F1F3F7] transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Investigations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F1F3F7]">Recent Investigations</h2>
          <Link href="/investigations" className="text-xs text-[#6665E8] hover:underline font-medium">
            View Archive
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#94A3B8] bg-[#141B26] border border-[#283548] rounded-xl">
            Loading investigation records...
          </div>
        ) : investigations.length === 0 ? (
          <div className="p-12 text-center bg-[#141B26] border border-[#283548] rounded-xl space-y-3">
            <Layers className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F1F3F7]">No Investigations Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Start by submitting your first forwarded claim, poster, or voice note to generate a TruthGraph.
            </p>
            <Link
              href="/investigations/new"
              className="inline-flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-4 py-2 rounded-lg text-xs font-semibold mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Investigation</span>
            </Link>
          </div>
        ) : (
          <div className="bg-[#141B26] border border-[#283548] rounded-xl overflow-hidden divide-y divide-[#283548]">
            {investigations.slice(0, 8).map((inv) => (
              <div
                key={inv.id}
                className="p-4 hover:bg-[#1B2331] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ModeBadge mode={inv.execution_mode} />
                    <span className="text-[10px] text-[#94A3B8] font-mono capitalize">
                      {inv.input_type} input
                    </span>
                    <span className="text-[10px] text-[#64748B]">•</span>
                    <span className="text-[10px] text-[#64748B]">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#F1F3F7] line-clamp-1">{inv.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
                    <span>
                      Bait Index:{" "}
                      <strong className="text-[#9670D7] font-mono">{inv.bait_score}/100</strong>
                    </span>
                    <span>•</span>
                    <span>{inv.claims_count} atomic claims</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <VerdictBadge verdict={inv.overall_verdict} size="sm" />
                  <Link
                    href={`/investigations/${inv.id}/graph`}
                    className="bg-[#0B0F17] hover:bg-[#242E40] text-[#6665E8] border border-[#283548] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    TruthGraph
                  </Link>
                  <Link
                    href={`/investigations/${inv.id}/report`}
                    className="text-xs text-[#94A3B8] hover:text-[#F1F3F7] p-1.5"
                    title="Read Report"
                  >
                    Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
