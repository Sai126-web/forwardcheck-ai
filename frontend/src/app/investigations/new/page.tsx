"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { MultimodalUpload } from "@/components/MultimodalUpload";
import { api } from "@/lib/api";
import { ExtractionResponse } from "@/lib/types";

function NewInvestigationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [extractedData, setExtractedData] = useState<ExtractionResponse | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("en");
  const [claimsList, setClaimsList] = useState<
    Array<{ position: number; original_text: string; normalized_claim: string }>
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill from URL params (e.g. extension handoff)
  useEffect(() => {
    const passedContent = searchParams.get("content");
    const passedUrl = searchParams.get("url");

    if (passedContent) {
      setContent(passedContent);
      setTitle(passedContent.slice(0, 50) + "...");
      api
        .extractContent({ content: passedContent, input_type: "text" })
        .then((res) => handleExtractionSuccess(res))
        .catch(() => {});
    } else if (passedUrl) {
      api
        .extractContent({ url: passedUrl, input_type: "url" })
        .then((res) => handleExtractionSuccess(res))
        .catch(() => {});
    }
  }, [searchParams]);

  const handleExtractionSuccess = (extraction: ExtractionResponse) => {
    setExtractedData(extraction);
    setContent(extraction.normalized_text);
    setTitle(
      (extraction.metadata.title as string) ||
        (extraction.normalized_text.slice(0, 50) + (extraction.normalized_text.length > 50 ? "..." : ""))
    );
    setClaimsList(extraction.detected_claims || []);
  };

  const handleClaimChange = (index: number, newClaimText: string) => {
    const updated = [...claimsList];
    updated[index].normalized_claim = newClaimText;
    setClaimsList(updated);
  };

  const handleRemoveClaim = (index: number) => {
    const updated = claimsList.filter((_, i) => i !== index);
    setClaimsList(updated);
  };

  const handleAddClaim = () => {
    setClaimsList([
      ...claimsList,
      {
        position: claimsList.length + 1,
        original_text: "Manual user proposition",
        normalized_claim: "New atomic factual claim to verify...",
      },
    ]);
  };

  const handleSubmitVerification = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newInv = await api.createInvestigation({
        title: title || content.slice(0, 50),
        original_content: content,
        input_type: extractedData?.input_type || "text",
        language: language,
        source_metadata: extractedData?.metadata || {},
        reviewed_claims: claimsList.length > 0 ? claimsList : undefined,
      });

      // Route immediately to processing screen
      router.push(`/investigations/${newInv.id}/processing`);
    } catch (err: any) {
      setError(err.message || "Failed to create investigation.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#F1F3F7]">New Forensic Investigation</h1>
        <p className="text-xs text-[#94A3B8] mt-1">
          Submit suspicious forwarded content, review extracted propositions, and initiate evidence discovery.
        </p>
      </div>

      {/* Step 1: Multimodal Ingestion Suite */}
      {!extractedData ? (
        <div className="space-y-4">
          <MultimodalUpload onExtractionSuccess={handleExtractionSuccess} />
        </div>
      ) : (
        /* Step 2: Extraction Preview & Claim Review */
        <div className="space-y-6 bg-[#1A140E] border-2 border-[#382619] rounded-2xl p-6 shadow-evidence">
          <div className="flex items-center justify-between border-b border-[#342417] pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#35AA9E]" />
              <div>
                <h3 className="text-sm font-bold text-[#F1E8D9] font-mono uppercase tracking-wider">
                  Ingestion Review & Claim Pre-Decomposition
                </h3>
                <p className="text-xs text-[#A3907C]">
                  Review extracted text and adjust claims before running the verification pipeline.
                </p>
              </div>
            </div>
            <button
              onClick={() => setExtractedData(null)}
              className="text-xs text-[#DC2626] hover:underline font-mono"
            >
              Re-upload or change input
            </button>
          </div>

          {/* Title and Language settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#A3907C] block mb-1">
                Investigation Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#100C08] border border-[#3D291A] focus:border-[#D97706] rounded-lg p-2.5 text-xs text-[#F1E8D9] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#A3907C] block mb-1">
                Report Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#100C08] border border-[#3D291A] focus:border-[#D97706] rounded-lg p-2.5 text-xs text-[#F1E8D9] outline-none"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </select>
            </div>
          </div>

          {/* Raw Text Review */}
          <div>
            <label className="text-xs font-mono font-medium text-[#A3907C] block mb-1">
              Extracted Raw Content:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#100C08] border border-[#3D291A] focus:border-[#D97706] rounded-lg p-3 text-xs text-[#F1E8D9] outline-none font-mono"
            />
          </div>

          {/* Detected Atomic Claims Review */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F1E8D9] font-mono uppercase tracking-wider">
                  Detected Atomic Claims ({claimsList.length})
                </h4>
                <p className="text-[11px] text-[#A3907C]">
                  Edit, add, or remove testable propositions. Pure opinions and forward commands have been separated.
                </p>
              </div>
              <button
                onClick={handleAddClaim}
                className="flex items-center gap-1 text-xs bg-[#241A12] hover:bg-[#342418] text-[#F59E0B] px-2.5 py-1 rounded-md border border-[#4D331E] font-mono font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Claim</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {claimsList.map((claim, idx) => (
                <div
                  key={idx}
                  className="bg-[#100C08] border border-[#3D291A] p-3 rounded-lg flex items-start gap-3"
                >
                  <span className="text-xs font-mono font-bold text-[#F59E0B] pt-1">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={claim.normalized_claim}
                      onChange={(e) => handleClaimChange(idx, e.target.value)}
                      className="w-full bg-transparent border-b border-[#3D291A] focus:border-[#D97706] text-xs text-[#F1E8D9] outline-none pb-1 font-mono"
                    />
                    <p className="text-[10px] text-[#786452] italic font-mono">
                      Source text: &quot;{claim.original_text.slice(0, 100)}...&quot;
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveClaim(idx)}
                    className="text-[#A3907C] hover:text-[#DC2626] p-1 transition-colors"
                    title="Remove Claim"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="flex items-start gap-2 bg-[#100C08] p-3 rounded-lg border border-[#3D291A] text-[11px] text-[#A3907C] font-mono">
            <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <span>
              <strong>Zero Surveillance Policy:</strong> Your submission is evaluated strictly for factual verification. No passive contact harvesting, chat monitoring, or automatic forwarding occurs.
            </span>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#342417]">
            <button
              onClick={() => setExtractedData(null)}
              className="text-xs text-[#A3907C] hover:text-[#F1E8D9] px-4 py-2 font-mono"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitVerification}
              disabled={submitting}
              className="flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-xs font-mono font-bold shadow-lg transition-all tracking-wider"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enqueuing Verification...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Start Evidence Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewInvestigationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-[#94A3B8]">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#6665E8] mb-2" />
          <span>Loading investigation laboratory...</span>
        </div>
      }
    >
      <NewInvestigationForm />
    </Suspense>
  );
}
