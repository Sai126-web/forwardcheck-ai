"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  FileUp,
  Mic,
  Globe,
  Network,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationSummary } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";
import { PushPin } from "@/components/common/PushPin";

export default function LandingPage() {
  const [samples, setSamples] = useState<InvestigationSummary[]>([]);

  useEffect(() => {
    api
      .listInvestigations({ mode: "sample" })
      .then((res) => setSamples(res.slice(0, 3)))
      .catch(() => {});
  }, []);

  const inputTypes = [
    {
      title: "Pasted Text",
      desc: "WhatsApp chain messages, SMS forwards, and social media text.",
      icon: <FileText className="w-5 h-5 text-[#F59E0B]" />,
      action: "/investigations/new?type=text",
      pin: "yellow" as const,
    },
    {
      title: "Screenshots",
      desc: "Chat captures, viral tweets, and purported news headlines.",
      icon: <ImageIcon className="w-5 h-5 text-[#35AA9E]" />,
      action: "/investigations/new?type=screenshot",
      pin: "blue" as const,
    },
    {
      title: "Posters & Notices",
      desc: "Government advisories, hospital notices, and graphic circulars.",
      icon: <FileUp className="w-5 h-5 text-[#DEA44C]" />,
      action: "/investigations/new?type=photograph",
      pin: "brass" as const,
    },
    {
      title: "Voice Notes",
      desc: "Audio recordings and forwarded audio clips with speech transcription.",
      icon: <Mic className="w-5 h-5 text-[#C084FC]" />,
      action: "/investigations/new?type=audio",
      pin: "purple" as const,
    },
    {
      title: "PDF Documents",
      desc: "Gazette notifications, legal orders, and multipart circulars.",
      icon: <FileUp className="w-5 h-5 text-[#E28B57]" />,
      action: "/investigations/new?type=pdf",
      pin: "red" as const,
    },
    {
      title: "Public URLs",
      desc: "Web articles, syndicated blog posts, and online claim pages.",
      icon: <Globe className="w-5 h-5 text-[#35AA9E]" />,
      action: "/investigations/new?type=url",
      pin: "green" as const,
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C150F] border border-[#3E291B] text-xs font-mono font-bold text-[#D97706] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
          <span>Forensic Verification Intelligence • No Hallucinated Percentages</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F1E8D9] tracking-tight leading-tight">
          Don’t just check the claim. <br />
          <span className="bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[#35AA9E] bg-clip-text text-transparent">
            Explore the truth behind it.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#A3907C] max-w-2xl mx-auto leading-relaxed">
          ForwardCheck AI helps citizens and analysts investigate suspicious forwards, notices, and media using inspectable evidence passages, TruthGraph™ topology, and the explainable Bait Index™.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/investigations/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-7 py-3 rounded-xl font-mono font-bold text-sm shadow-xl shadow-[#DC2626]/25 transition-all tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Investigate a Forward</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#22170F] hover:bg-[#322316] text-[#F1E8D9] px-6 py-3 rounded-xl font-mono text-sm border border-[#4A3220] transition-all"
          >
            <Layers className="w-4 h-4 text-[#D97706]" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Six Supported Input Types */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-block mb-1 text-[11px] font-mono font-bold uppercase tracking-widest text-[#D97706]">
            EXHIBIT INTAKE PORTAL
          </div>
          <h2 className="text-2xl font-bold text-[#F1E8D9]">Multimodal Forensic Inputs</h2>
          <p className="text-xs text-[#A3907C] mt-1">
            Every format converges on our typed, atomic claim verification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inputTypes.map((item, idx) => (
            <Link
              key={idx}
              href={item.action}
              className="relative bg-[#1A140E] hover:bg-[#241A12] border-2 border-[#3A2719] hover:border-[#D97706] p-5 rounded-xl transition-all group flex flex-col justify-between shadow-evidence hover:-translate-y-1"
            >
              {/* Corner Pushpin */}
              <div className="absolute -top-2.5 right-6 z-10">
                <PushPin color={item.pin} size="sm" />
              </div>

              <div>
                <div className="p-2.5 rounded-lg bg-[#110C07] inline-block border border-[#3A2719] mb-3 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-[#F1E8D9] mb-1 font-mono">{item.title}</h3>
                <p className="text-xs text-[#A3907C] leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#DC2626] font-mono font-bold mt-4">
                <span>Start Ingestion</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two Anchor Paradigms: TruthGraph & Bait Index */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* TruthGraph Card */}
        <div className="relative bg-[#1C150F] border-2 border-[#4A3220] rounded-2xl p-7 flex flex-col justify-between shadow-2xl corkboard-frame">
          <div className="absolute -top-3 left-8 z-10">
            <PushPin color="red" size="md" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pt-2">
              <div className="p-2 rounded-lg bg-[#DC2626]/20 text-[#EF4444] border border-[#DC2626]/30">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider block font-bold">
                  RED STRING INVESTIGATION BOARD
                </span>
                <h3 className="text-lg font-bold text-[#F1E8D9] font-mono">TruthGraph™ Canvas</h3>
              </div>
            </div>
            <p className="text-xs text-[#A3907C] leading-relaxed">
              Explore the entire evidentiary network connecting original artifacts to decomposed atomic claims, corroborating sources, quoted excerpts, and definitive verdicts. Filter by stance, inspect citation URLs, and zoom through complex narratives.
            </p>
            <div className="bg-[#120D08] p-4 rounded-xl border border-[#3A281A] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#A3907C]">
                <span>Node Types:</span>
                <span className="text-[#F1E8D9]">Claims • Evidence • Sources • Verdicts</span>
              </div>
              <div className="flex items-center justify-between text-[#A3907C]">
                <span>Typed Edges:</span>
                <span className="text-[#DC2626] font-bold">Red String Yarn • Stances</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link
              href="/investigations/sample-plastic-rice-2026/graph"
              className="inline-flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-[#EF4444] font-mono font-bold"
            >
              <span>Explore Interactive Sample Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bait Index Card */}
        <div className="relative bg-[#1C150F] border-2 border-[#4A3220] rounded-2xl p-7 flex flex-col justify-between shadow-2xl">
          <div className="absolute -top-3 right-8 z-10">
            <PushPin color="purple" size="md" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pt-2">
              <div className="p-2 rounded-lg bg-[#9670D7]/20 text-[#C084FC] border border-[#9670D7]/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#C084FC] uppercase tracking-wider block font-bold">
                  RHETORICAL DECEPTION DETECTOR
                </span>
                <h3 className="text-lg font-bold text-[#F1E8D9] font-mono">Explainable Bait Index™</h3>
              </div>
            </div>
            <p className="text-xs text-[#A3907C] leading-relaxed">
              A transparent, deterministic 0–100 rubric evaluating 5 psychological manipulation vectors: artificial urgency, authority appeals, forwarding pressure, emotional pressure, and scarcity/fear.
            </p>
            <div className="bg-[#120D08] p-4 rounded-xl border border-[#3A281A] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-[#A3907C]">
                <span>Rubric Scoring:</span>
                <span className="text-[#C084FC] font-bold">0 to 20 pts per category (100 Max)</span>
              </div>
              <div className="flex items-center justify-between text-[#A3907C]">
                <span>Span Detection:</span>
                <span className="text-[#F1E8D9]">Exact character highlights & triggers</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link
              href="/investigations/sample-plastic-rice-2026/report"
              className="inline-flex items-center gap-1.5 text-xs text-[#C084FC] hover:text-[#DDD6FE] font-mono font-bold"
            >
              <span>View Sample Bait Index Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Five Canonical Verdicts Section */}
      <section className="bg-[#17120D] border-2 border-[#382619] rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-block mb-1 text-[10px] font-mono uppercase tracking-widest text-[#D97706] font-bold">
            FORENSIC CLASSIFICATION STANDARDS
          </div>
          <h2 className="text-xl font-bold text-[#F1E8D9]">Five Canonical Verdicts Only</h2>
          <p className="text-xs text-[#A3907C] mt-1">
            We never guess with ungrounded probability numbers. Every proposition receives one of five defensible classifications:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-[#100C08] border border-[#35AA9E]/40 p-3.5 rounded-xl space-y-1.5 shadow-sm">
            <VerdictBadge verdict="Verified" />
            <p className="text-[11px] text-[#A3907C]">Corroborated by verifiable primary records and official archives.</p>
          </div>
          <div className="bg-[#100C08] border border-[#E56D68]/40 p-3.5 rounded-xl space-y-1.5 shadow-sm">
            <VerdictBadge verdict="False" />
            <p className="text-[11px] text-[#A3907C]">Directly refuted or debunked by credible investigative facts.</p>
          </div>
          <div className="bg-[#100C08] border border-[#DEA44C]/40 p-3.5 rounded-xl space-y-1.5 shadow-sm">
            <VerdictBadge verdict="Outdated" />
            <p className="text-[11px] text-[#A3907C]">Originated from a valid past event or notice, but expired now.</p>
          </div>
          <div className="bg-[#100C08] border border-[#E28B57]/40 p-3.5 rounded-xl space-y-1.5 shadow-sm">
            <VerdictBadge verdict="Partially Supported" />
            <p className="text-[11px] text-[#A3907C]">Contains partial truth mixed with omissions or shifted context.</p>
          </div>
          <div className="bg-[#100C08] border border-[#64748B]/40 p-3.5 rounded-xl space-y-1.5 shadow-sm">
            <VerdictBadge verdict="Cannot Confirm" />
            <p className="text-[11px] text-[#A3907C]">Insufficient evidence in public record. Absence of evidence ≠ false.</p>
          </div>
        </div>
      </section>

      {/* Featured Sample Demonstrations */}
      {samples.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-wider font-bold">
                FORENSIC CASE ARCHIVE
              </span>
              <h2 className="text-xl font-bold text-[#F1E8D9]">Pre-Verified Sample Investigations</h2>
              <p className="text-xs text-[#A3907C]">Explore live TruthGraphs and reports from verified reference datasets.</p>
            </div>
            <Link href="/investigations" className="text-xs text-[#DC2626] hover:underline font-mono font-bold">
              View All History
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {samples.map((s) => (
              <div
                key={s.id}
                className="relative bg-[#1A140E] border-2 border-[#382619] hover:border-[#D97706] rounded-xl p-5 flex flex-col justify-between transition-all shadow-evidence"
              >
                <div className="absolute -top-2 left-6">
                  <PushPin color="yellow" size="sm" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <ModeBadge mode={s.execution_mode} />
                    <VerdictBadge verdict={s.overall_verdict} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F1E8D9] line-clamp-2 mb-2 font-mono">{s.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#A3907C] mb-4 font-mono">
                    <span>Bait Index: <strong className="text-[#C084FC]">{s.bait_score}/100</strong></span>
                    <span>•</span>
                    <span className="capitalize">{s.input_type} Input</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#342417] flex items-center justify-between text-xs font-mono">
                  <Link
                    href={`/investigations/${s.id}/graph`}
                    className="text-[#DC2626] hover:underline font-bold"
                  >
                    Open TruthGraph
                  </Link>
                  <Link
                    href={`/investigations/${s.id}/report`}
                    className="text-[#A3907C] hover:text-[#F1E8D9]"
                  >
                    Read Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="text-center bg-gradient-to-b from-[#1C150F] to-[#110D08] border-2 border-[#3D291A] rounded-2xl p-10 space-y-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#F1E8D9] font-mono">Ready to verify a forwarded claim?</h2>
        <p className="text-xs text-[#A3907C] max-w-lg mx-auto">
          Paste text, drop a screenshot, upload an audio clip or PDF circular, and see the evidence topology immediately.
        </p>
        <div className="pt-2">
          <Link
            href="/investigations/new"
            className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-7 py-3 rounded-xl font-mono font-bold text-sm shadow-xl transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Launch New Investigation</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
