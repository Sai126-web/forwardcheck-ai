"use client";

import React, { useState } from "react";
import { BaitIndexSummary } from "@/lib/types";
import { AlertCircle, Flame, Info, ShieldAlert, Sparkles } from "lucide-react";

interface BaitIndexGaugeProps {
  baitSummary?: BaitIndexSummary;
  rawText?: string;
  className?: string;
}

export const BaitIndexGauge: React.FC<BaitIndexGaugeProps> = ({
  baitSummary,
  rawText = "",
  className = "",
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!baitSummary) {
    return null;
  }

  const score = baitSummary.total_score;

  // Determine meter color and risk
  let riskColor = "#35AA9E"; // Green/teal for low
  if (score >= 65) riskColor = "#E56D68"; // High/critical
  else if (score >= 40) riskColor = "#E28B57"; // Orange
  else if (score >= 20) riskColor = "#9670D7"; // Purple/moderate

  return (
    <div className={`bg-[#1B2331] border border-[#283548] rounded-xl p-5 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#283548] pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#9670D7]" />
            <h3 className="font-semibold text-base text-[#F1F3F7]">Bait Index™ Analysis</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-[#9670D7]/20 text-[#9670D7] border border-[#9670D7]/30 font-medium">
              Explainable Rhetoric
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-xl">
            A deterministic rubric (0–100) measuring psychological urgency, guilt, and forwarding pressure.
          </p>
        </div>

        {/* Big Score Display */}
        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-3xl font-extrabold" style={{ color: riskColor }}>
              {score}
            </span>
            <span className="text-sm font-medium text-[#94A3B8]">/ 100</span>
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
            style={{ backgroundColor: `${riskColor}22`, color: riskColor }}
          >
            {baitSummary.risk_level} Bait Risk
          </span>
        </div>
      </div>

      {/* Mandatory Honesty Disclaimer Alert */}
      <div className="flex items-start gap-2.5 bg-[#141B26] border border-[#283548] rounded-lg p-3 mb-5 text-xs text-[#94A3B8]">
        <Info className="w-4 h-4 text-[#9670D7] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F1F3F7] block mb-0.5">Rhetoric Indicator, Not Truth Probability:</strong>
          {baitSummary.disclaimer} Legitimate disaster warnings can score high on urgency, while completely false hoaxes written calmly may score low.
        </div>
      </div>

      {/* 5 Categories Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {baitSummary.categories.map((cat) => {
          const isSelected = activeCategory === cat.category;
          const percentage = (cat.score / cat.max_score) * 100;

          return (
            <div
              key={cat.category}
              onClick={() => setActiveCategory(isSelected ? null : cat.category)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#242E40] border-[#9670D7]"
                  : "bg-[#141B26]/60 border-[#283548] hover:border-[#3E4F68]"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#F1F3F7]">{cat.category_name}</span>
                <span className="font-mono text-[#9670D7]">
                  {cat.score} / {cat.max_score} pts
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#0B0F17] h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: cat.score > 10 ? "#9670D7" : "#35AA9E",
                  }}
                />
              </div>

              <p className="text-[11px] text-[#94A3B8] line-clamp-1">{cat.description}</p>

              {/* Matched phrases tags */}
              {cat.matched_phrases && cat.matched_phrases.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.matched_phrases.map((phrase, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] bg-[#9670D7]/15 text-[#C4B5FD] px-1.5 py-0.5 rounded border border-[#9670D7]/30 font-mono"
                    >
                      &quot;{phrase}&quot;
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Matched Phrase Inspector */}
      {baitSummary.tags && baitSummary.tags.length > 0 && (
        <div className="border-t border-[#283548] pt-4">
          <h4 className="text-xs font-semibold text-[#F1F3F7] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#9670D7]" />
            Detected Rhetorical Triggers ({baitSummary.tags.length})
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {baitSummary.tags.map((tag, tIdx) => (
              <div
                key={tIdx}
                className="flex items-center justify-between text-xs bg-[#141B26] px-3 py-1.5 rounded border border-[#283548]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#9670D7] font-mono font-medium">&quot;{tag.phrase}&quot;</span>
                  <span className="text-[10px] text-[#94A3B8]">({tag.explanation})</span>
                </div>
                <span className="text-[10px] text-[#DEA44C] font-mono shrink-0">
                  +{tag.score_contribution} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
