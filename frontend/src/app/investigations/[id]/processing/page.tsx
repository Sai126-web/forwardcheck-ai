"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  RotateCcw,
  Network,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import { Job, JobStageType } from "@/lib/types";

export default function ProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let intervalId: any;

    const pollJob = async () => {
      try {
        const j = await api.getJob(id);
        setJob(j);

        if (j.stage === "completed") {
          clearInterval(intervalId);
          // Automatically transition to the TruthGraph workspace
          setTimeout(() => {
            router.push(`/investigations/${id}/graph`);
          }, 1200);
        } else if (j.stage === "failed") {
          clearInterval(intervalId);
          setError(j.error_message || "Investigation pipeline encountered an error.");
        }
      } catch (err: any) {
        console.error("Error polling job status:", err);
      }
    };

    pollJob();
    intervalId = setInterval(pollJob, 1000);

    return () => clearInterval(intervalId);
  }, [id, router]);

  const stages: Array<{ id: JobStageType; label: string }> = [
    { id: "queued", label: "Queued" },
    { id: "analyzing_rhetoric", label: "Bait Index & Rhetoric" },
    { id: "decomposing", label: "Claim Decomposition" },
    { id: "retrieving_evidence", label: "Evidence Discovery" },
    { id: "verifying", label: "Stance & Grounded Verification" },
    { id: "generating_graph", label: "TruthGraph Synthesis" },
  ];

  const getStageIndex = (stageName: JobStageType) => {
    const idx = stages.findIndex((s) => s.id === stageName);
    return idx >= 0 ? idx : 0;
  };

  const currentIdx = job ? getStageIndex(job.stage) : 0;

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8 text-center">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2331] border border-[#283548] text-xs text-[#94A3B8]">
          <Activity className="w-3.5 h-3.5 text-[#6665E8] animate-pulse" />
          <span>Real-time Pipeline Telemetry</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F1F3F7]">Investigating Claims...</h1>
        <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
          {job?.current_task || "Initializing verification pipeline and queries..."}
        </p>
      </div>

      {/* Progress Bar & Stage Indicator */}
      <div className="bg-[#141B26] border border-[#283548] rounded-2xl p-6 shadow-xl space-y-6 text-left">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#F1F3F7] capitalize">
              {job?.stage ? job.stage.replace("_", " ") : "Processing"}
            </span>
            <span className="font-mono text-[#6665E8] font-bold">
              {job?.progress_percent || 10}%
            </span>
          </div>
          <div className="w-full bg-[#0B0F17] h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6665E8] to-[#35AA9E] transition-all duration-300"
              style={{ width: `${job?.progress_percent || 10}%` }}
            />
          </div>
        </div>

        {/* Stages Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {stages.map((stg, idx) => {
            const isDone = currentIdx > idx || job?.stage === "completed";
            const isCurrent = currentIdx === idx && job?.stage !== "completed";

            return (
              <div
                key={stg.id}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? "bg-[#1B2331] border-[#6665E8] text-[#F1F3F7]"
                    : isDone
                    ? "bg-[#0B0F17] border-[#35AA9E]/40 text-[#35AA9E]"
                    : "bg-[#0B0F17]/40 border-[#283548] text-[#64748B]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#35AA9E] shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#6665E8] animate-spin shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-[#64748B] shrink-0" />
                )}
                <span className="font-medium">{stg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Real Events Log */}
        {job?.events_log && job.events_log.length > 0 && (
          <div className="border-t border-[#283548] pt-4 space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
              Pipeline Event Stream
            </h4>
            <div className="bg-[#0B0F17] rounded-lg p-3 font-mono text-[11px] max-h-40 overflow-y-auto space-y-1.5 border border-[#283548]">
              {job.events_log.map((ev, eIdx) => (
                <div key={eIdx} className="flex items-start gap-2 text-[#94A3B8]">
                  <span className="text-[#64748B] shrink-0">[{ev.timestamp}]</span>
                  <span className="text-[#F1F3F7]">{ev.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failure Handling */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => api.retryInvestigation(id).then((j) => setJob(j))}
              className="flex items-center gap-1 bg-[#1B2331] px-3 py-1.5 rounded text-white font-medium hover:bg-[#283548]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Manual Bypass if Completed */}
        {job?.stage === "completed" && (
          <div className="text-center pt-2">
            <button
              onClick={() => router.push(`/investigations/${id}/graph`)}
              className="inline-flex items-center gap-2 bg-[#35AA9E] text-slate-950 px-5 py-2.5 rounded-lg text-xs font-bold shadow-lg"
            >
              <Network className="w-4 h-4" />
              <span>Open TruthGraph Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
