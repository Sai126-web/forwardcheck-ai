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
  Tag,
  Paperclip,
} from "lucide-react";
import { VerdictBadge } from "../VerdictBadge";
import { PushPin } from "../common/PushPin";

export const ForwardNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative bg-[#1A1F2C] border-2 border-[#D97706]/70 rounded-lg p-3.5 shadow-evidence w-72 text-left group transition-transform hover:-translate-y-0.5">
      {/* Top Pushpin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin color="brass" size="md" />
      </div>

      {/* Tape strip accent */}
      <div className="absolute -top-2 left-3 w-10 h-3 tape-strip rounded-sm rotate-[-4deg] opacity-80 pointer-events-none" />

      <Handle type="source" position={Position.Right} className="!bg-[#B45309] !w-3 !h-3 !border-amber-400" />
      
      <div className="flex items-center justify-between gap-2 mb-2 pt-1 border-b border-[#3A2F24] pb-1.5">
        <div className="flex items-center gap-1.5 text-[#D97706]">
          <FileText className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider">EXHIBIT A • DISPATCH</span>
        </div>
        <span className="text-[9px] font-mono text-[#94A3B8] bg-[#0B0E14] px-1.5 py-0.5 rounded border border-[#283548]">
          CASE ROOT
        </span>
      </div>

      <p className="text-xs font-semibold text-[#F1F3F7] line-clamp-3 leading-snug font-sans">
        {data.title}
      </p>

      {data.overall_verdict && (
        <div className="mt-2.5 pt-2 border-t border-[#3A2F24] flex items-center justify-between">
          <span className="text-[10px] text-[#A3907C] font-mono uppercase">VERDICT SEAL:</span>
          <VerdictBadge verdict={data.overall_verdict} size="sm" />
        </div>
      )}
    </div>
  );
});
ForwardNode.displayName = "ForwardNode";

export const ClaimNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative bg-[#211C14] border border-[#785429]/60 hover:border-[#D97706] transition-all rounded-lg p-3.5 shadow-evidence w-72 text-left group hover:-translate-y-0.5">
      {/* Top Pushpin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin color="yellow" size="md" />
      </div>

      {/* Yellow sticky note top tape strip */}
      <div className="absolute -top-1.5 right-4 w-8 h-2.5 tape-strip rounded-sm rotate-[3deg] opacity-75 pointer-events-none" />

      <Handle type="target" position={Position.Left} className="!bg-[#94A3B8] !w-2.5 !h-2.5 !border-amber-500" />
      <Handle type="source" position={Position.Right} className="!bg-[#DC2626] !w-2.5 !h-2.5 !border-rose-400" />

      <div className="flex items-center justify-between mb-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B] font-mono">
          <Target className="w-3.5 h-3.5" />
          <span>Claim #{data.position || 1}</span>
        </div>
        <VerdictBadge verdict={data.verdict} size="sm" />
      </div>

      <p className="text-xs text-[#F1E8D9] font-medium line-clamp-3 mb-2 font-mono leading-relaxed">
        {data.normalized_claim}
      </p>

      {data.entities && data.entities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 border-t border-[#3D2D1B] pt-1.5">
          {data.entities.slice(0, 3).map((ent: string, idx: number) => (
            <span
              key={idx}
              className="text-[9px] font-mono bg-[#14100B] text-[#D4A373] px-1.5 py-0.5 rounded border border-[#523B22]"
            >
              #{ent}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
ClaimNode.displayName = "ClaimNode";

export const EvidenceNode = memo(({ data }: { data: any }) => {
  const stanceConfigs: Record<string, { bg: string; text: string; border: string; stamp: string; pin: "green" | "red" | "yellow" | "blue" }> = {
    supports: { bg: "bg-emerald-950/60", text: "text-emerald-300", border: "border-emerald-600/50", stamp: "CORROBORATED", pin: "green" },
    contradicts: { bg: "bg-rose-950/60", text: "text-rose-300", border: "border-rose-600/50", stamp: "REFUTED", pin: "red" },
    qualifies: { bg: "bg-amber-950/60", text: "text-amber-300", border: "border-amber-600/50", stamp: "QUALIFIED", pin: "yellow" },
    contextualizes: { bg: "bg-blue-950/60", text: "text-blue-300", border: "border-blue-600/50", stamp: "CONTEXT", pin: "blue" },
    insufficient: { bg: "bg-stone-900", text: "text-stone-300", border: "border-stone-700", stamp: "INCONCLUSIVE", pin: "blue" },
  };
  const sc = stanceConfigs[data.stance] || stanceConfigs.contextualizes;

  return (
    <div className={`relative bg-[#181C26] border ${sc.border} rounded-lg p-3 shadow-evidence w-72 text-left group hover:-translate-y-0.5 transition-transform`}>
      {/* Top Pushpin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin color={sc.pin} size="md" />
      </div>

      <Handle type="target" position={Position.Left} className="!bg-[#DC2626] !w-2.5 !h-2.5 !border-red-400" />
      <Handle type="source" position={Position.Right} className="!bg-[#DC2626] !w-2.5 !h-2.5 !border-red-400" />

      <div className="flex items-center justify-between mb-1.5 pt-1">
        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-current ${sc.bg} ${sc.text}`}>
          {sc.stamp}
        </span>
        <span className="text-[10px] font-mono text-[#94A3B8] truncate max-w-[120px] bg-[#0E121B] px-1.5 py-0.5 rounded border border-[#252E3E]">
          {data.publisher}
        </span>
      </div>

      <div className="bg-[#10141D] p-2 rounded border border-[#232B3B] mb-2">
        <p className="text-[11px] text-[#E2E8F0] line-clamp-3 italic leading-relaxed">
          &ldquo;{data.excerpt}&rdquo;
        </p>
      </div>

      {data.relevance && (
        <p className="text-[10px] text-[#7E8B9E] line-clamp-1 border-t border-[#232B3B] pt-1 font-mono">
          REF: {data.relevance}
        </p>
      )}
    </div>
  );
});
EvidenceNode.displayName = "EvidenceNode";

export const VerdictNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative bg-[#191520] border-2 border-[#E56D68]/60 rounded-lg p-3.5 shadow-evidence w-64 text-left group hover:-translate-y-0.5 transition-transform">
      {/* Top Red Pushpin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin color="red" size="md" />
      </div>

      <Handle type="target" position={Position.Left} className="!bg-[#DC2626] !w-3 !h-3 !border-red-400" />
      
      <div className="pt-1 mb-1 flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold text-[#E56D68] uppercase tracking-widest">
          CASE SEAL
        </span>
        <span className="text-[9px] font-mono text-[#94A3B8]">CANONICAL</span>
      </div>

      <VerdictBadge verdict={data.verdict} size="md" className="mb-2" />
      <div className="p-2 bg-[#100D15] rounded border border-[#332233]">
        <p className="text-[11px] text-[#C4B5FD] line-clamp-3 font-mono leading-relaxed">
          {data.rationale}
        </p>
      </div>
    </div>
  );
});
VerdictNode.displayName = "VerdictNode";

export const BaitNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative bg-[#231A26] border border-[#9670D7]/60 rounded-lg p-3 shadow-evidence w-64 text-left group hover:-translate-y-0.5 transition-transform">
      {/* Top Pushpin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
        <PushPin color="purple" size="md" />
      </div>

      <Handle type="target" position={Position.Left} className="!bg-[#9670D7] !w-2.5 !h-2.5 !border-purple-300" />

      <div className="flex items-center justify-between mb-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C084FC]">
          <Flame className="w-3.5 h-3.5" />
          <span className="font-mono">Bait Index™</span>
        </div>
        <span className="text-xs font-bold text-[#F1F3F7] font-mono bg-[#140D18] px-2 py-0.5 rounded border border-[#482855]">
          {data.score}/100
        </span>
      </div>

      <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#9670D7]/20 text-[#DDD6FE] border border-[#9670D7]/40 font-bold inline-block mb-1.5">
        {data.risk_level} Rhetoric Risk
      </span>
      <p className="text-[10px] text-[#A78BFA] font-sans leading-tight">
        Analyzed psychological urgency, guilt & fear markers.
      </p>
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
