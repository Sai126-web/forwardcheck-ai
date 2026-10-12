"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  PlusCircle,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Network,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { InvestigationSummary } from "@/lib/types";
import { VerdictBadge } from "@/components/VerdictBadge";
import { ModeBadge } from "@/components/ModeBadge";

export default function HistoryPage() {
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Rename modal state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadData = () => {
    setLoading(true);
    api
      .listInvestigations({
        q: search || undefined,
        verdict: verdictFilter || undefined,
        mode: modeFilter || undefined,
      })
      .then((data) => setInvestigations(data))
      .catch((err) => console.error("Error loading investigations:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, verdictFilter, modeFilter]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investigation and its TruthGraph records?")) {
      try {
        await api.deleteInvestigation(id);
        setInvestigations((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        alert("Failed to delete investigation.");
      }
    }
  };

  const handleSaveRename = async () => {
    if (!editingId || !editTitle.trim()) return;
    try {
      await api.renameInvestigation(editingId, editTitle);
      setInvestigations((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, title: editTitle } : i))
      );
      setEditingId(null);
    } catch {
      alert("Failed to rename investigation.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283548] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F3F7]">Investigation History</h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Search, inspect, export, or manage your stored verification dossiers.
          </p>
        </div>

        <Link
          href="/investigations/new"
          className="inline-flex items-center gap-2 bg-[#6665E8] hover:bg-[#5756D1] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Investigation</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141B26] border border-[#283548] p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles or message contents..."
            className="w-full bg-[#0B0F17] border border-[#283548] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F1F3F7] placeholder-[#64748B] outline-none focus:border-[#6665E8]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded-lg px-3 py-2 text-xs outline-none"
          >
            <option value="">All Verdicts</option>
            <option value="Verified">Verified</option>
            <option value="False">False</option>
            <option value="Outdated">Outdated</option>
            <option value="Partially Supported">Partially Supported</option>
            <option value="Cannot Confirm">Cannot Confirm</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded-lg px-3 py-2 text-xs outline-none"
          >
            <option value="">All Modes</option>
            <option value="live">Live Analysis</option>
            <option value="sample">Sample Demonstrations</option>
            <option value="partial">Partial Analysis</option>
          </select>
        </div>
      </div>

      {/* List Content */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8] bg-[#141B26] border border-[#283548] rounded-xl">
          Loading investigation records...
        </div>
      ) : investigations.length === 0 ? (
        <div className="p-12 text-center bg-[#141B26] border border-[#283548] rounded-xl space-y-3">
          <Layers className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-semibold text-[#F1F3F7]">No Matching Investigations</h3>
          <p className="text-xs text-[#94A3B8]">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <div className="bg-[#141B26] border border-[#283548] rounded-xl overflow-hidden divide-y divide-[#283548]">
          {investigations.map((inv) => (
            <div
              key={inv.id}
              className="p-4 hover:bg-[#1B2331] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <ModeBadge mode={inv.execution_mode} />
                  <span className="text-[10px] text-[#94A3B8] font-mono capitalize">
                    {inv.input_type} Input
                  </span>
                  <span className="text-[10px] text-[#64748B]">•</span>
                  <span className="text-[10px] text-[#64748B]">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </span>
                </div>

                {editingId === inv.id ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-[#0B0F17] border border-[#6665E8] rounded px-2 py-1 text-xs text-[#F1F3F7] outline-none flex-1"
                    />
                    <button
                      onClick={handleSaveRename}
                      className="bg-[#35AA9E] text-slate-950 px-2.5 py-1 rounded text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-[#94A3B8] hover:text-[#F1F3F7] px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#F1F3F7] line-clamp-1">{inv.title}</h3>
                    <button
                      onClick={() => {
                        setEditingId(inv.id);
                        setEditTitle(inv.title);
                      }}
                      className="text-[#64748B] hover:text-[#94A3B8]"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                  <span>
                    Bait Index:{" "}
                    <strong className="text-[#9670D7] font-mono">{inv.bait_score}/100</strong>
                  </span>
                  <span>•</span>
                  <span>{inv.claims_count} atomic claims</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <VerdictBadge verdict={inv.overall_verdict} size="sm" />

                <Link
                  href={`/investigations/${inv.id}/graph`}
                  className="flex items-center gap-1.5 bg-[#0B0F17] hover:bg-[#242E40] text-[#6665E8] border border-[#283548] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>TruthGraph</span>
                </Link>

                <Link
                  href={`/investigations/${inv.id}/report`}
                  className="flex items-center gap-1.5 bg-[#0B0F17] hover:bg-[#242E40] text-[#94A3B8] hover:text-[#F1F3F7] border border-[#283548] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Report</span>
                </Link>

                <button
                  onClick={() => handleDelete(inv.id)}
                  className="text-[#64748B] hover:text-[#E56D68] p-1.5 rounded-md hover:bg-[#283548] transition-colors"
                  title="Delete Investigation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
