import React from "react";
import { ExecutionModeType } from "@/lib/types";

interface ModeBadgeProps {
  mode: ExecutionModeType;
  className?: string;
}

export const ModeBadge: React.FC<ModeBadgeProps> = ({ mode, className = "" }) => {
  if (mode === "live") {
    return (
      <span
        title="Live verified analysis: Connected search providers and fact-checking engines were successfully queried."
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Live Analysis
      </span>
    );
  }

  if (mode === "sample") {
    return (
      <span
        title="Sample Demonstration: Pre-verified forensic reference dataset used to demonstrate system capabilities."
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/70 text-purple-300 border border-purple-500/30 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
        Sample Investigation
      </span>
    );
  }

  return (
    <span
      title="Partial Analysis: Claim decomposition & Bait Index ran locally, but external search had limited connectivity."
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/30 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      Partial Analysis
    </span>
  );
};
