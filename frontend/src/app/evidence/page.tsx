"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Quote,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Evidence } from "@/lib/types";

export default function EvidenceLibraryPage() {
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [search, setSearch] = useState("");
  const [stanceFilter, setStanceFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .listEvidence({
        q: search || undefined,
        stance: stanceFilter || undefined,
        tier: tierFilter || undefined,
      })
      .then((data) => setEvidenceList(data))
      .catch((err) => console.error("Error loading evidence library:", err))
      .finally(() => setLoading(false));
  }, [search, stanceFilter, tierFilter]);

  const stanceBadges: Record<string, { bg: string; text: string; border: string }> = {
    supports: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-500/40" },
    contradicts: { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-500/40" },
    qualifies: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-500/40" },
    contextualizes: { bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-500/40" },
    insufficient: { bg: "bg-slate-900", text: "text-slate-400", border: "border-slate-700" },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-[#283548] pb-6">
        <h1 className="text-2xl font-bold text-[#F1F3F7]">Evidence & Source Repository</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Inspect corroborated quotes, official gazettes, and fact-checking records retrieved across all investigations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141B26] border border-[#283548] p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across quoted excerpts, sources, publishers..."
            className="w-full bg-[#0B0F17] border border-[#283548] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F1F3F7] placeholder-[#64748B] outline-none focus:border-[#6665E8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={stanceFilter}
            onChange={(e) => setStanceFilter(e.target.value)}
            className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded-lg px-3 py-2 text-xs outline-none"
          >
            <option value="">All Stances</option>
            <option value="supports">Supports Claim</option>
            <option value="contradicts">Contradicts / Debunks</option>
            <option value="qualifies">Qualifies / Contextualizes</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded-lg px-3 py-2 text-xs outline-none"
          >
            <option value="">All Source Tiers</option>
            <option value="primary_record">Primary Government / Lab Records</option>
            <option value="authoritative_factcheck">Authoritative Fact-Checkers</option>
            <option value="trusted_news">Trusted News Outlets</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8] bg-[#141B26] border border-[#283548] rounded-xl">
          Loading evidence library passages...
        </div>
      ) : evidenceList.length === 0 ? (
        <div className="p-12 text-center bg-[#141B26] border border-[#283548] rounded-xl space-y-3">
          <BookOpen className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-semibold text-[#F1F3F7]">No Matching Citations</h3>
          <p className="text-xs text-[#94A3B8]">Try broadening your search query or removing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceList.map((ev) => {
            const sb = stanceBadges[ev.stance] || stanceBadges.contextualizes;
            return (
              <div
                key={ev.id}
                className="bg-[#141B26] border border-[#283548] hover:border-[#6665E8] p-5 rounded-xl space-y-3 shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${sb.bg} ${sb.text} ${sb.border}`}
                    >
                      {ev.stance}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      Citation #{ev.citation_number}
                    </span>
                  </div>

                  <blockquote className="italic text-xs text-[#F1F3F7] leading-relaxed pl-2.5 border-l-2 border-[#6665E8]/60">
                    &ldquo;{ev.excerpt}&rdquo;
                  </blockquote>

                  <p className="text-[11px] text-[#94A3B8]">
                    <strong>Relevance:</strong> {ev.relevance_explanation}
                  </p>
                </div>

                {ev.source && (
                  <div className="pt-3 border-t border-[#283548] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#64748B] block">Publisher / Repository</span>
                      <strong className="text-[#F1F3F7]">{ev.source.publisher || "Official Source"}</strong>
                    </div>

                    {ev.source.url && (
                      <a
                        href={ev.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#6665E8] hover:underline font-medium"
                      >
                        <span>Inspect Primary Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
