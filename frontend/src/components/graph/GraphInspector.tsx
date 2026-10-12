"use client";

import React from "react";
import { X, ExternalLink, ShieldCheck, Target, Quote, Flame, Calendar, Tag } from "lucide-react";
import { VerdictBadge } from "../VerdictBadge";

interface GraphInspectorProps {
  selectedNode: any | null;
  onClose: () => void;
}

export const GraphInspector: React.FC<GraphInspectorProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-[#141B26] border-l border-[#283548] p-5 flex flex-col justify-center items-center text-center text-[#94A3B8]">
        <Target className="w-10 h-10 text-[#283548] mb-3" />
        <h4 className="text-sm font-semibold text-[#F1F3F7] mb-1">Inspector Panel</h4>
        <p className="text-xs max-w-[200px]">
          Click any node on the TruthGraph canvas to inspect verified citations, stances, and entities.
        </p>
      </div>
    );
  }

  const { node_type, label, data } = selectedNode;

  return (
    <div className="w-84 h-full bg-[#141B26] border-l border-[#283548] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#283548] flex items-center justify-between bg-[#1B2331]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block">
            {node_type.replace("_", " ")}
          </span>
          <h3 className="text-xs font-bold text-[#F1F3F7] truncate max-w-[200px]">{label}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#94A3B8] hover:text-[#F1F3F7] hover:bg-[#283548] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 text-xs">
        {/* Node Type: Original Forward */}
        {node_type === "original_forward" && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Full Ingested Text</span>
              <div className="bg-[#0B0F17] p-3 rounded-md border border-[#283548] text-[#F1F3F7] text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                {data.title}
              </div>
            </div>
            {data.overall_verdict && (
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Overall Finding</span>
                <VerdictBadge verdict={data.overall_verdict} size="md" />
              </div>
            )}
          </div>
        )}

        {/* Node Type: Atomic Claim */}
        {node_type === "atomic_claim" && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Normalized Proposition</span>
              <p className="bg-[#0B0F17] p-3 rounded-md border border-[#283548] text-[#F1F3F7] font-medium leading-relaxed">
                {data.normalized_claim}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Claim Verdict</span>
              <VerdictBadge verdict={data.verdict} size="md" />
            </div>
            {data.entities && data.entities.length > 0 && (
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase block mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Named Entities
                </span>
                <div className="flex flex-wrap gap-1">
                  {data.entities.map((ent: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#1B2331] text-[#94A3B8] px-2 py-0.5 rounded border border-[#283548]"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Node Type: Evidence */}
        {node_type === "evidence" && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[#94A3B8] uppercase">Evaluated Stance</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6665E8]">
                  Citation #{data.citation || 1}
                </span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#6665E8]/20 text-[#6665E8] border border-[#6665E8]/30">
                {data.stance}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Quoted Source Excerpt</span>
              <blockquote className="bg-[#0B0F17] p-3 rounded-md border border-[#283548] text-[#F1F3F7] text-[11px] italic leading-relaxed">
                &ldquo;{data.excerpt}&rdquo;
              </blockquote>
            </div>

            {data.relevance && (
              <div>
                <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Forensic Relevance</span>
                <p className="text-[#94A3B8] text-[11px] leading-relaxed">{data.relevance}</p>
              </div>
            )}

            {data.url && (
              <div className="pt-2 border-t border-[#283548]">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#6665E8] hover:underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Source: {data.publisher}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Node Type: Verdict */}
        {node_type === "verdict" && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Verdict Classification</span>
              <VerdictBadge verdict={data.verdict} size="lg" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] uppercase block mb-1">Grounded Rationale</span>
              <p className="bg-[#0B0F17] p-3 rounded-md border border-[#283548] text-[#F1F3F7] leading-relaxed">
                {data.rationale}
              </p>
            </div>
          </div>
        )}

        {/* Node Type: Bait Analysis */}
        {node_type === "bait_analysis" && (
          <div className="space-y-3">
            <div className="bg-[#0B0F17] p-4 rounded-lg border border-[#9670D7]/40 text-center">
              <span className="text-3xl font-extrabold text-[#9670D7]">{data.score}</span>
              <span className="text-xs text-[#94A3B8] block">/ 100 on Bait Index™</span>
            </div>
            <p className="text-[#94A3B8] text-[11px] leading-relaxed">
              Heuristic rhetoric metric detecting time constraints, authority claims, and viral forwarding pressure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
