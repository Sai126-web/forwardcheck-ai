"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./CustomNodes";
import { GraphInspector } from "./GraphInspector";
import { TruthGraphData } from "@/lib/types";
import {
  Search,
  Filter,
  Maximize2,
  RotateCcw,
  LayoutGrid,
  Network,
  Share2,
} from "lucide-react";
import { VerdictBadge } from "../VerdictBadge";
import { PushPin } from "../common/PushPin";

interface TruthGraphCanvasProps {
  graphData: TruthGraphData;
  onSavePositions?: (positions: Record<string, { x: number; y: number }>) => void;
}

export const TruthGraphCanvas: React.FC<TruthGraphCanvasProps> = ({
  graphData,
  onSavePositions,
}) => {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"graph" | "cards">("graph");

  // Transform raw backend graphData into ReactFlow format
  const initialNodes: Node[] = useMemo(() => {
    return graphData.nodes.map((n) => ({
      id: n.id,
      type: n.node_type,
      position: { x: n.x_pos, y: n.y_pos },
      data: {
        ...n.data,
        label: n.label,
      },
    }));
  }, [graphData]);

  const initialEdges: Edge[] = useMemo(() => {
    return graphData.edges.map((e) => ({
      id: e.id,
      source: e.source_node_id,
      target: e.target_node_id,
      label: e.label,
      animated: e.edge_type.includes("claim") || e.edge_type.includes("bait"),
      style: {
        stroke: "#DC2626", // Crime-board crimson red yarn
        strokeWidth: 2.5,
        filter: "drop-shadow(0 2px 4px rgba(220, 38, 38, 0.6))",
      },
      labelStyle: { fill: "#FEE2E2", fontSize: 10, fontWeight: 700, fontFamily: "monospace" },
      labelBgStyle: { fill: "#450A0A", fillOpacity: 0.9, rx: 4, ry: 4 },
    }));
  }, [graphData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      let isDimmed = false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const labelMatch = (node.data.label as string)?.toLowerCase().includes(query);
        const claimMatch = (node.data.normalized_claim as string)?.toLowerCase().includes(query);
        const excerptMatch = (node.data.excerpt as string)?.toLowerCase().includes(query);
        if (!labelMatch && !claimMatch && !excerptMatch) {
          isDimmed = true;
        }
      }
      if (verdictFilter !== "all" && node.data.verdict) {
        if (node.data.verdict !== verdictFilter) {
          isDimmed = true;
        }
      }
      return {
        ...node,
        style: {
          ...node.style,
          opacity: isDimmed ? 0.2 : 1,
          transition: "opacity 0.2s ease-in-out",
        },
      };
    });
  }, [nodes, searchQuery, verdictFilter]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode({
      id: node.id,
      node_type: node.type,
      label: (node.data.label as string) || node.id,
      data: node.data,
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col h-[750px] w-full bg-[#120E0A] border-4 border-[#2E1F14] rounded-2xl overflow-hidden shadow-2xl corkboard-frame">
      {/* Top Interactive Workspace Toolbar */}
      <div className="bg-[#1C150F] border-b border-[#3D291A] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View Mode Toggle & Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0F0B08] rounded-lg p-0.5 border border-[#3D291A]">
            <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "graph" ? "bg-[#2D1F13] text-[#F59E0B] font-semibold border border-[#5C3F27]" : "text-[#94A3B8]"
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "cards" ? "bg-[#2D1F13] text-[#F59E0B] font-semibold border border-[#5C3F27]" : "text-[#94A3B8]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>List View</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A3907C] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims or evidence..."
              className="bg-[#0F0B08] border border-[#3D291A] rounded-md pl-8 pr-3 py-1 text-xs text-[#F1E8D9] placeholder-[#786452] focus:border-[#D97706] outline-none w-48 sm:w-60 font-mono"
            />
          </div>
        </div>

        {/* Right: Filters & Metrics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#A3907C]">
            <Filter className="w-3.5 h-3.5 text-[#D97706]" />
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              aria-label="Filter claims by verdict"
              className="bg-[#0F0B08] border border-[#3D291A] text-[#F1E8D9] rounded px-2 py-1 text-xs outline-none font-mono"
            >
              <option value="all">All Verdicts</option>
              <option value="Verified">Verified</option>
              <option value="False">False</option>
              <option value="Outdated">Outdated</option>
              <option value="Partially Supported">Partially Supported</option>
              <option value="Cannot Confirm">Cannot Confirm</option>
            </select>
          </div>

          <div className="text-[11px] text-[#A3907C] font-mono hidden sm:block">
            <span className="text-[#F59E0B] font-semibold">{graphData.nodes.length}</span> pins •{" "}
            <span className="text-[#DC2626] font-semibold">{graphData.edges.length}</span> strings
          </div>
        </div>
      </div>

      {/* Main Canvas / List Content Area */}
      <div className="flex-1 flex relative overflow-hidden corkboard-bg">
        {/* Soft Desk Lamp Light Beam Overlay simulating detective desk lamp */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_10%,rgba(245,158,11,0.18)_0%,transparent_65%)] z-10" />

        {viewMode === "graph" ? (
          <div className="flex-1 h-full w-full relative">
            <ReactFlow
              nodes={filteredNodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.2}
              maxZoom={2}
            >
              <Background color="#382517" gap={24} size={1.5} variant={BackgroundVariant.Dots} />
              <Controls className="!bg-[#211A13] !border-[#4A3525] !fill-[#F1E8D9] !rounded-lg !shadow-evidence z-20" />
              <MiniMap
                className="!bg-[#15100B] !border-[#4A3525] !rounded-lg hidden md:block z-20"
                nodeColor={(n) => {
                  if (n.type === "atomic_claim") return "#D97706";
                  if (n.type === "verdict") return "#DC2626";
                  if (n.type === "evidence") return "#059669";
                  return "#4A3525";
                }}
              />
            </ReactFlow>
          </div>
        ) : (
          /* Responsive Card/List Fallback */
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-20">
            <h4 className="text-sm font-bold text-[#F1E8D9] font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              Claim & Evidence Index
            </h4>
            {graphData.nodes
              .filter((n) => n.node_type === "atomic_claim")
              .map((c) => (
                <div
                  key={c.id}
                  onClick={() =>
                    setSelectedNode({
                      id: c.id,
                      node_type: c.node_type,
                      label: c.label,
                      data: c.data,
                    })
                  }
                  className="relative bg-[#211C14] border border-[#5A4027] hover:border-[#D97706] p-4 rounded-xl cursor-pointer transition-all shadow-evidence hover:-translate-y-0.5"
                >
                  <div className="absolute -top-2 left-6">
                    <PushPin color="yellow" size="sm" />
                  </div>
                  <div className="flex items-center justify-between mb-2 pt-1">
                    <span className="text-xs font-bold text-[#F59E0B] font-mono">Claim #{c.data.position || 1}</span>
                    <VerdictBadge verdict={c.data.verdict} size="sm" />
                  </div>
                  <p className="text-xs font-medium text-[#F1E8D9] mb-2 font-mono">{c.data.normalized_claim}</p>
                  <p className="text-[11px] text-[#A89885]">
                    Click to inspect citations and evidence passages.
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Contextual Right Inspector Panel */}
        <GraphInspector selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
};
