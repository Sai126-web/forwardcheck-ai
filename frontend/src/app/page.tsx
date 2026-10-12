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
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationSummary } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";

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
      icon: <FileText className="w-5 h-5 text-[#6665E8]" />,
      action: "/investigations/new?type=text",
    },
    {
      title: "Screenshots",
      desc: "Chat captures, viral tweets, and purported news headlines.",
      icon: <ImageIcon className="w-5 h-5 text-[#35AA9E]" />,
      action: "/investigations/new?type=screenshot",
    },
    {
      title: "Posters & Notices",
      desc: "Government advisories, hospital notices, and graphic circulars.",
      icon: <FileUp className="w-5 h-5 text-[#DEA44C]" />,
      action: "/investigations/new?type=photograph",
    },
    {
      title: "Voice Notes",
      desc: "Audio recordings and forwarded audio clips with speech transcription.",
      icon: <Mic className="w-5 h-5 text-[#9670D7]" />,
      action: "/investigations/new?type=audio",
    },
    {
      title: "PDF Documents",
      desc: "Gazette notifications, legal orders, and multipart circulars.",
      icon: <FileUp className="w-5 h-5 text-[#E28B57]" />,
      action: "/investigations/new?type=pdf",
    },
    {
      title: "Public URLs",
      desc: "Web articles, syndicated blog posts, and online claim pages.",
      icon: <Globe className="w-5 h-5 text-[#35AA9E]" />,
      action: "/investigations/new?type=url",
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B2331] border border-[#283548] text-xs font-medium text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#6665E8] animate-pulse"></span>
          <span>Forensic Verification Intelligence • No Hallucinated Percentages</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F1F3F7] tracking-tight leading-tight">
          Don’t just check the claim. <br />
          <span className="bg-gradient-to-r from-[#6665E8] via-[#818CF8] to-[#35AA9E] bg-clip-text text-transparent">
            Explore the truth behind it.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          ForwardCheck AI helps citizens and analysts investigate suspicious forwards, notices, and media using inspectable evidence passages, TruthGraph™ topology, and the explainable Bait Index™.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/investigations/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#6665E8]/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Investigate a Forward</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B2331] hover:bg-[#283548] text-[#F1F3F7] px-6 py-3 rounded-xl font-semibold text-sm border border-[#283548] transition-all"
          >
            <Layers className="w-4 h-4 text-[#94A3B8]" />
            <span>Open Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Six Supported Input Types */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-[#F1F3F7]">Multimodal Forensic Inputs</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Every format converges on our typed, atomic claim verification pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inputTypes.map((item, idx) => (
            <Link
              key={idx}
              href={item.action}
              className="bg-[#141B26] hover:bg-[#1B2331] border border-[#283548] hover:border-[#6665E8] p-5 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-lg bg-[#0B0F17] inline-block border border-[#283548] mb-3 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#F1F3F7] mb-1">{item.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#6665E8] font-semibold mt-4">
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
        <div className="bg-[#141B26] border border-[#283548] rounded-2xl p-7 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#6665E8]/20 text-[#6665E8]">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F1F3F7]">TruthGraph™ Canvas</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Explore the entire evidentiary network connecting original artifacts to decomposed atomic claims, corroborating sources, quoted excerpts, and definitive verdicts. Filter by stance, inspect citation URLs, and zoom through complex narratives.
            </p>
            <div className="bg-[#0B0F17] p-4 rounded-xl border border-[#283548] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Node Types:</span>
                <span className="text-[#F1F3F7] font-mono">Claims • Evidence • Sources • Verdicts</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Typed Edges:</span>
                <span className="text-[#F1F3F7] font-mono">Supports • Contradicts • Qualifies</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link
              href="/investigations/sample-plastic-rice-2026/graph"
              className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:text-[#818CF8] font-semibold"
            >
              <span>Explore Interactive Sample Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bait Index Card */}
        <div className="bg-[#141B26] border border-[#283548] rounded-2xl p-7 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#9670D7]/20 text-[#9670D7]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F1F3F7]">Explainable Bait Index™</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              A transparent, deterministic 0–100 rubric evaluating 5 psychological manipulation vectors: artificial urgency, authority appeals, forwarding pressure, emotional pressure, and scarcity/fear.
            </p>
            <div className="bg-[#0B0F17] p-4 rounded-xl border border-[#283548] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Rubric Scoring:</span>
                <span className="text-[#9670D7] font-mono">0 to 20 pts per category (100 Max)</span>
              </div>
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span>Span Detection:</span>
                <span className="text-[#F1F3F7] font-mono">Exact character highlights & triggers</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Link
              href="/investigations/sample-plastic-rice-2026/report"
              className="inline-flex items-center gap-1.5 text-xs text-[#9670D7] hover:text-[#C4B5FD] font-semibold"
            >
              <span>View Sample Bait Index Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Five Canonical Verdicts Section */}
      <section className="bg-[#141B26]/60 border border-[#283548] rounded-2xl p-8 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-[#F1F3F7]">Five Canonical Verdicts Only</h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            We never guess with ungrounded probability numbers. Every proposition receives one of five defensible classifications:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-[#0B0F17] border border-[#35AA9E]/30 p-3.5 rounded-xl space-y-1.5">
            <VerdictBadge verdict="Verified" />
            <p className="text-[11px] text-[#94A3B8]">Corroborated by verifiable primary records and official archives.</p>
          </div>
          <div className="bg-[#0B0F17] border border-[#E56D68]/30 p-3.5 rounded-xl space-y-1.5">
            <VerdictBadge verdict="False" />
            <p className="text-[11px] text-[#94A3B8]">Directly refuted or debunked by credible investigative facts.</p>
          </div>
          <div className="bg-[#0B0F17] border border-[#DEA44C]/30 p-3.5 rounded-xl space-y-1.5">
            <VerdictBadge verdict="Outdated" />
            <p className="text-[11px] text-[#94A3B8]">Originated from a valid past event or notice, but expired now.</p>
          </div>
          <div className="bg-[#0B0F17] border border-[#E28B57]/30 p-3.5 rounded-xl space-y-1.5">
            <VerdictBadge verdict="Partially Supported" />
            <p className="text-[11px] text-[#94A3B8]">Contains partial truth mixed with omissions or shifted context.</p>
          </div>
          <div className="bg-[#0B0F17] border border-[#64748B]/30 p-3.5 rounded-xl space-y-1.5">
            <VerdictBadge verdict="Cannot Confirm" />
            <p className="text-[11px] text-[#94A3B8]">Insufficient evidence in public record. Absence of evidence ≠ false.</p>
          </div>
        </div>
      </section>

      {/* Featured Sample Demonstrations */}
      {samples.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#F1F3F7]">Pre-Verified Sample Investigations</h2>
              <p className="text-xs text-[#94A3B8]">Explore live TruthGraphs and reports from verified reference datasets.</p>
            </div>
            <Link href="/investigations" className="text-xs text-[#6665E8] hover:underline font-semibold">
              View All History
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {samples.map((s) => (
              <div
                key={s.id}
                className="bg-[#141B26] border border-[#283548] rounded-xl p-5 flex flex-col justify-between hover:border-[#6665E8] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <ModeBadge mode={s.execution_mode} />
                    <VerdictBadge verdict={s.overall_verdict} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F1F3F7] line-clamp-2 mb-2">{s.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mb-4">
                    <span>Bait Index: <strong className="text-[#9670D7] font-mono">{s.bait_score}/100</strong></span>
                    <span>•</span>
                    <span className="capitalize">{s.input_type} Input</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#283548] flex items-center justify-between text-xs">
                  <Link
                    href={`/investigations/${s.id}/graph`}
                    className="text-[#6665E8] hover:underline font-semibold"
                  >
                    Open TruthGraph
                  </Link>
                  <Link
                    href={`/investigations/${s.id}/report`}
                    className="text-[#94A3B8] hover:text-[#F1F3F7]"
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
      <section className="text-center bg-gradient-to-b from-[#141B26] to-[#0B0F17] border border-[#283548] rounded-2xl p-10 space-y-4">
        <h2 className="text-2xl font-bold text-[#F1F3F7]">Ready to verify a forwarded claim?</h2>
        <p className="text-xs text-[#94A3B8] max-w-lg mx-auto">
          Paste text, drop a screenshot, upload an audio clip or PDF circular, and see the evidence topology immediately.
        </p>
        <div className="pt-2">
          <Link
            href="/investigations/new"
            className="inline-flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-7 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch New Investigation</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
