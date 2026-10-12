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
    { id: "text", label: "Pasted Text", icon: <FileText className="w-4 h-4" /> },
    { id: "screenshot", label: "Screenshot / Image", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "pdf", label: "PDF Notice", icon: <FileUp className="w-4 h-4" /> },
    { id: "audio", label: "Voice Note", icon: <Mic className="w-4 h-4" /> },
    { id: "url", label: "Public Webpage", icon: <Globe className="w-4 h-4" /> },
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
    <div className="bg-[#141B26] border border-[#283548] rounded-xl p-5 shadow-lg">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-[#283548] pb-3 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setError(null);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === t.id
                ? "bg-[#6665E8] text-white shadow-sm"
                : "text-[#94A3B8] hover:text-[#F1F3F7] hover:bg-[#1B2331]"
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
            <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">
              Paste Forwarded Message, Post, or Circular Text:
            </label>
            <textarea
              rows={5}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste WhatsApp forward, Twitter post, or circular content here..."
              className="w-full bg-[#0B0F17] border border-[#283548] focus:border-[#6665E8] rounded-lg p-3 text-xs text-[#F1F3F7] placeholder-[#64748B] outline-none"
            />
          </div>
        )}

        {activeTab === "url" && (
          <div>
            <label className="text-xs font-medium text-[#94A3B8] block mb-1.5">
              Public Web Article or Social Link:
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://news-site.org/article..."
              className="w-full bg-[#0B0F17] border border-[#283548] focus:border-[#6665E8] rounded-lg p-3 text-xs text-[#F1F3F7] placeholder-[#64748B] outline-none"
            />
          </div>
        )}

        {(activeTab === "screenshot" || activeTab === "pdf" || activeTab === "audio") && (
          <div className="border-2 border-dashed border-[#283548] hover:border-[#6665E8] rounded-xl p-6 text-center bg-[#0B0F17]/50 transition-colors">
            <Upload className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#F1F3F7] mb-1">
              Drop your {activeTab.toUpperCase()} file here, or click to browse
            </p>
            <p className="text-[11px] text-[#94A3B8] mb-3">
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
              className="inline-block bg-[#1B2331] hover:bg-[#283548] text-[#F1F3F7] px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border border-[#283548]"
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
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Extract Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#94A3B8]">
            Step 1: Ingest & Preview Extracted Claims
          </span>
          <button
            onClick={handleExtract}
            disabled={loading}
            className="flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text & Claims...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Review Claims</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
