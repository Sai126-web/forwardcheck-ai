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
  FolderOpen,
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationSummary } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";
import { PushPin } from "@/components/common/PushPin";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D291A] pb-6">
        <div>
          <div className="inline-block mb-1 text-[10px] font-mono uppercase tracking-widest text-[#D97706] font-bold">
            DETECTIVE EVIDENCE ROOM • ACTIVE CASES
          </div>
          <h1 className="text-2xl font-bold text-[#F1E8D9] font-mono">Forensic Dashboard</h1>
          <p className="text-xs text-[#A3907C] mt-1">
            Overview of investigated forwards, claims decomposition, and evidence telemetry.
          </p>
        </div>

        <Link
          href="/investigations/new"
          className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold shadow-lg transition-all self-start sm:self-auto tracking-wider"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>New Investigation</span>
        </Link>
      </div>

      {/* Real Computed Telemetry Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="relative bg-[#1A140E] border-2 border-[#382619] p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#A3907C] font-mono uppercase block font-bold">Total Analyzed</span>
          <span className="text-2xl font-extrabold text-[#F1E8D9] font-mono mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-[#786452] font-mono">All modalities</span>
        </div>

        <div className="relative bg-[#1A140E] border-2 border-[#E56D68]/40 p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#E56D68] font-mono uppercase block font-bold">False Claims</span>
          <span className="text-2xl font-extrabold text-[#E56D68] font-mono mt-1 block">{falseCount}</span>
          <span className="text-[10px] text-[#A3907C] font-mono">Directly debunked</span>
        </div>

        <div className="relative bg-[#1A140E] border-2 border-[#35AA9E]/40 p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#35AA9E] font-mono uppercase block font-bold">Verified</span>
          <span className="text-2xl font-extrabold text-[#35AA9E] font-mono mt-1 block">{verifiedCount}</span>
          <span className="text-[10px] text-[#A3907C] font-mono">Primary corroborated</span>
        </div>

        <div className="relative bg-[#1A140E] border-2 border-[#DEA44C]/40 p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#DEA44C] font-mono uppercase block font-bold">Outdated</span>
          <span className="text-2xl font-extrabold text-[#DEA44C] font-mono mt-1 block">{outdatedCount}</span>
          <span className="text-[10px] text-[#A3907C] font-mono">Expired parameters</span>
        </div>

        <div className="relative bg-[#1A140E] border-2 border-[#E28B57]/40 p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#E28B57] font-mono uppercase block font-bold">Partially True</span>
          <span className="text-2xl font-extrabold text-[#E28B57] font-mono mt-1 block">{partialCount}</span>
          <span className="text-[10px] text-[#A3907C] font-mono">Missing context</span>
        </div>

        <div className="relative bg-[#1A140E] border-2 border-[#9670D7]/40 p-4 rounded-xl shadow-evidence">
          <span className="text-[10px] text-[#C084FC] font-mono uppercase block font-bold">Avg Bait Score</span>
          <span className="text-2xl font-extrabold text-[#C084FC] font-mono mt-1 block">{avgBaitScore}/100</span>
          <span className="text-[10px] text-[#A3907C] font-mono">Heuristic rhetoric</span>
        </div>
      </div>

      {/* Quick Input Modality Launchers */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D97706] font-bold">
            INTAKE TRAY
          </span>
          <h2 className="text-sm font-semibold text-[#F1E8D9]">Quick Ingestion Launchers</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Pasted Text", type: "text", icon: <FileText className="w-4 h-4 text-[#F59E0B]" /> },
            { label: "Screenshot", type: "screenshot", icon: <ImageIcon className="w-4 h-4 text-[#35AA9E]" /> },
            { label: "PDF Notice", type: "pdf", icon: <FileUp className="w-4 h-4 text-[#DEA44C]" /> },
            { label: "Voice Note", type: "audio", icon: <Mic className="w-4 h-4 text-[#C084FC]" /> },
            { label: "Public URL", type: "url", icon: <Globe className="w-4 h-4 text-[#35AA9E]" /> },
            { label: "Image Poster", type: "photograph", icon: <ImageIcon className="w-4 h-4 text-[#E28B57]" /> },
          ].map((item) => (
            <Link
              key={item.type}
              href={`/investigations/new?type=${item.type}`}
              className="bg-[#1C150F] hover:bg-[#251D16] border border-[#3D291A] hover:border-[#D97706] p-3 rounded-lg flex items-center gap-2.5 text-xs text-[#F1E8D9] transition-all shadow-sm font-mono"
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
          <h2 className="text-sm font-bold text-[#F1E8D9] font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            Recent Investigations
          </h2>
          <Link href="/investigations" className="text-xs text-[#DC2626] hover:underline font-mono font-bold">
            View Archive
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#A3907C] bg-[#1A140E] border-2 border-[#382619] rounded-xl font-mono">
            Loading investigation records...
          </div>
        ) : investigations.length === 0 ? (
          <div className="p-12 text-center bg-[#1A140E] border-2 border-[#382619] rounded-xl space-y-3">
            <Layers className="w-8 h-8 text-[#A3907C] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F1E8D9]">No Investigations Found</h3>
            <p className="text-xs text-[#A3907C] max-w-sm mx-auto">
              Start by submitting your first forwarded claim, poster, or voice note to generate a TruthGraph.
            </p>
            <Link
              href="/investigations/new"
              className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-4 py-2 rounded-lg text-xs font-mono font-bold mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Start Investigation</span>
            </Link>
          </div>
        ) : (
          <div className="bg-[#1A140E] border-2 border-[#382619] rounded-xl overflow-hidden divide-y divide-[#342417] shadow-evidence">
            {investigations.slice(0, 8).map((inv) => (
              <div
                key={inv.id}
                className="p-4 hover:bg-[#231A12] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ModeBadge mode={inv.execution_mode} />
                    <span className="text-[10px] text-[#A3907C] font-mono capitalize">
                      {inv.input_type} input
                    </span>
                    <span className="text-[10px] text-[#5C3F27]">•</span>
                    <span className="text-[10px] text-[#8C7A68] font-mono">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#F1E8D9] line-clamp-1 font-mono">{inv.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#A3907C] font-mono">
                    <span>
                      Bait Index:{" "}
                      <strong className="text-[#C084FC]">{inv.bait_score}/100</strong>
                    </span>
                    <span>•</span>
                    <span>{inv.claims_count} atomic claims</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <VerdictBadge verdict={inv.overall_verdict} size="sm" />
                  <Link
                    href={`/investigations/${inv.id}/graph`}
                    className="bg-[#120D08] hover:bg-[#2A1E14] text-[#DC2626] hover:text-[#EF4444] border border-[#3E291B] hover:border-[#DC2626] px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors shadow-sm"
                  >
                    TruthGraph
                  </Link>
                  <Link
                    href={`/investigations/${inv.id}/report`}
                    className="text-xs text-[#A3907C] hover:text-[#F1E8D9] p-1.5 font-mono"
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
