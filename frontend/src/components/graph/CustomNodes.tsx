"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FileText,
  Target,
  Globe,
  Quote,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { VerdictBadge } from "../VerdictBadge";

export const ForwardNode = memo(({ data }: { data: any }) => {
  return (
    <div className="bg-[#1B2331] border-2 border-[#6665E8] rounded-xl p-3.5 shadow-xl w-64 text-left">
      <Handle type="source" position={Position.Right} className="!bg-[#6665E8] !w-3 !h-3" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-md bg-[#6665E8]/20 text-[#6665E8]">
          <FileText className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">Original Forward</span>
      </div>
      <p className="text-xs font-semibold text-[#F1F3F7] line-clamp-3 leading-snug">{data.title}</p>
      {data.overall_verdict && (
        <div className="mt-2.5 pt-2 border-t border-[#283548] flex items-center justify-between">
          <span className="text-[10px] text-[#94A3B8]">Overall Result:</span>
          <VerdictBadge verdict={data.overall_verdict} size="sm" />
        </div>
      )}
    </div>
  );
});
ForwardNode.displayName = "ForwardNode";

export const ClaimNode = memo(({ data }: { data: any }) => {
  return (
    <div className="bg-[#141B26] border border-[#283548] hover:border-[#6665E8] transition-colors rounded-xl p-3.5 shadow-lg w-72 text-left">
      <Handle type="target" position={Position.Left} className="!bg-[#94A3B8] !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-[#6665E8] !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6665E8]">
          <Target className="w-3.5 h-3.5" />
          <span>Claim #{data.position || 1}</span>
        </div>
        <VerdictBadge verdict={data.verdict} size="sm" />
      </div>
      <p className="text-xs text-[#F1F3F7] font-medium line-clamp-3 mb-2">{data.normalized_claim}</p>
      {data.entities && data.entities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {data.entities.slice(0, 3).map((ent: string, idx: number) => (
            <span
              key={idx}
              className="text-[10px] bg-[#1B2331] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#283548]"
            >
              {ent}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
ClaimNode.displayName = "ClaimNode";

export const EvidenceNode = memo(({ data }: { data: any }) => {
  const stanceColors: Record<string, { bg: string; text: string; border: string }> = {
    supports: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-500/40" },
    contradicts: { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-500/40" },
    qualifies: { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-500/40" },
    contextualizes: { bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-500/40" },
    insufficient: { bg: "bg-slate-900", text: "text-slate-400", border: "border-slate-700" },
  };
  const sc = stanceColors[data.stance] || stanceColors.contextualizes;

  return (
    <div className={`bg-[#1B2331] border ${sc.border} rounded-xl p-3 shadow-lg w-72 text-left`}>
      <Handle type="target" position={Position.Left} className="!bg-[#94A3B8] !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-[#94A3B8] !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
          {data.stance}
        </span>
        <span className="text-[10px] text-[#94A3B8] truncate max-w-[120px]">{data.publisher}</span>
      </div>
      <p className="text-[11px] text-[#F1F3F7] line-clamp-3 italic mb-2 leading-relaxed">
        &ldquo;{data.excerpt}&rdquo;
      </p>
      {data.relevance && (
        <p className="text-[10px] text-[#94A3B8] line-clamp-1 border-t border-[#283548] pt-1">
          {data.relevance}
        </p>
      )}
    </div>
  );
});
EvidenceNode.displayName = "EvidenceNode";

export const VerdictNode = memo(({ data }: { data: any }) => {
  return (
    <div className="bg-[#141B26] border-2 border-[#283548] rounded-xl p-3.5 shadow-xl w-60 text-left">
      <Handle type="target" position={Position.Left} className="!bg-[#94A3B8] !w-3 !h-3" />
      <span className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Final Finding</span>
      <VerdictBadge verdict={data.verdict} size="md" className="mb-2" />
      <p className="text-[11px] text-[#94A3B8] line-clamp-3">{data.rationale}</p>
    </div>
  );
});
VerdictNode.displayName = "VerdictNode";

export const BaitNode = memo(({ data }: { data: any }) => {
  return (
    <div className="bg-[#1B2331] border border-[#9670D7]/50 rounded-xl p-3 shadow-lg w-64 text-left">
      <Handle type="target" position={Position.Left} className="!bg-[#9670D7] !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9670D7]">
          <Flame className="w-3.5 h-3.5" />
          <span>Bait Index™</span>
        </div>
        <span className="text-xs font-bold text-[#F1F3F7] font-mono">{data.score}/100</span>
      </div>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#9670D7]/20 text-[#C4B5FD] font-medium inline-block mb-1">
        {data.risk_level} Rhetoric Risk
      </span>
      <p className="text-[10px] text-[#94A3B8]">Analyzed psychological urgency, guilt & fear markers.</p>
    </div>
  );
});
BaitNode.displayName = "BaitNode";

export const nodeTypes = {
  original_forward: ForwardNode,
  atomic_claim: ClaimNode,
  evidence: EvidenceNode,
  verdict: VerdictNode,
  bait_analysis: BaitNode,
};
