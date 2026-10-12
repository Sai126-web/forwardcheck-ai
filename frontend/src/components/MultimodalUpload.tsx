"use client";

import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileUp,
  Mic,
  Globe,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { InputType, ExtractionResponse } from "@/lib/types";
import { PushPin } from "./common/PushPin";

interface MultimodalUploadProps {
  onExtractionSuccess: (extraction: ExtractionResponse) => void;
}

export const MultimodalUpload: React.FC<MultimodalUploadProps> = ({ onExtractionSuccess }) => {
  const [activeTab, setActiveTab] = useState<InputType>("text");
  const [textContent, setTextContent] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs: Array<{ id: InputType; label: string; icon: React.ReactNode }> = [
    { id: "text", label: "Pasted Text", icon: <FileText className="w-4 h-4 text-amber-400" /> },
    { id: "screenshot", label: "Screenshot / Image", icon: <ImageIcon className="w-4 h-4 text-emerald-400" /> },
    { id: "pdf", label: "PDF Notice", icon: <FileUp className="w-4 h-4 text-amber-500" /> },
    { id: "audio", label: "Voice Note", icon: <Mic className="w-4 h-4 text-purple-400" /> },
    { id: "url", label: "Public Webpage", icon: <Globe className="w-4 h-4 text-sky-400" /> },
  ];

  const handleExtract = async () => {
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "text") {
        if (!textContent.trim()) throw new Error("Please enter or paste the forwarded text.");
        const res = await api.extractContent({ content: textContent, input_type: "text" });
        onExtractionSuccess(res);
      } else if (activeTab === "url") {
        if (!urlInput.trim()) throw new Error("Please enter a public webpage URL.");
        const res = await api.extractContent({ url: urlInput, input_type: "url" });
        onExtractionSuccess(res);
      } else {
        if (!file) throw new Error("Please select or drop a file to upload.");
        const res = await api.uploadMultimodalFile(file, activeTab);
        onExtractionSuccess(res);
      }
    } catch (err: any) {
      setError(err.message || "Failed to extract content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-[#1A140E] border-2 border-[#382619] rounded-2xl p-6 shadow-evidence">
      {/* Top PushPin */}
      <div className="absolute -top-3 left-8 z-10">
        <PushPin color="yellow" size="md" />
      </div>

      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block">
            EVIDENCE INTAKE TERMINAL
          </span>
          <h2 className="text-base font-bold text-[#F1E8D9] font-mono">Submit Evidence for Forensic Analysis</h2>
        </div>
        <span className="text-[10px] font-mono text-[#8C7A68] hidden sm:block">
          ZERO-SURVEILLANCE • EXPLICIT SUBMISSION ONLY
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#342417] pb-3 mb-4 font-mono">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setError(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === t.id
                ? "bg-[#DC2626] text-white shadow-md font-bold"
                : "text-[#A3907C] hover:text-[#F1E8D9] hover:bg-[#251D16]"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panes */}
      <div className="space-y-4">
        {activeTab === "text" && (
          <div>
            <label className="text-xs font-mono font-medium text-[#A3907C] block mb-1.5">
              Paste Forwarded Message, Post, or Circular Text:
            </label>
            <textarea
              rows={5}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste WhatsApp forward, Twitter post, or circular content here..."
              className="w-full bg-[#100C08] border border-[#3D291A] focus:border-[#D97706] rounded-lg p-3 text-xs text-[#F1E8D9] placeholder-[#786452] outline-none font-mono"
            />
          </div>
        )}

        {activeTab === "url" && (
          <div>
            <label className="text-xs font-mono font-medium text-[#A3907C] block mb-1.5">
              Public Web Article or Social Link:
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://news-site.org/article..."
              className="w-full bg-[#100C08] border border-[#3D291A] focus:border-[#D97706] rounded-lg p-3 text-xs text-[#F1E8D9] placeholder-[#786452] outline-none font-mono"
            />
          </div>
        )}

        {(activeTab === "screenshot" || activeTab === "pdf" || activeTab === "audio") && (
          <div className="border-2 border-dashed border-[#3D291A] hover:border-[#D97706] rounded-xl p-6 text-center bg-[#100C08] transition-colors">
            <Upload className="w-8 h-8 text-[#A3907C] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#F1E8D9] font-mono mb-1">
              Drop your {activeTab.toUpperCase()} file here, or click to browse
            </p>
            <p className="text-[11px] text-[#8C7A68] font-mono mb-3">
              {activeTab === "screenshot" && "PNG, JPG, WEBP (Max 15MB)"}
              {activeTab === "pdf" && "PDF notices and circulars (Max 25MB)"}
              {activeTab === "audio" && "MP3, WAV, M4A voice notes (Max 20MB)"}
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={
                activeTab === "screenshot"
                  ? "image/*"
                  : activeTab === "pdf"
                  ? ".pdf"
                  : "audio/*"
              }
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-[#22170F] hover:bg-[#322316] text-[#F1E8D9] px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer border border-[#4A3220]"
            >
              Select File
            </label>
            {file && (
              <p className="text-xs text-[#35AA9E] mt-3 font-mono">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Extract Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#A3907C] font-mono">
            Step 1: Ingest & Preview Extracted Claims
          </span>
          <button
            onClick={handleExtract}
            disabled={loading}
            className="flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-mono font-bold shadow-md transition-all tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text & Claims...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Extract & Review Claims</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
