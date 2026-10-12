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
        stroke:
          e.edge_type === "contradicted_by"
            ? "#E56D68"
            : e.edge_type === "supported_by"
            ? "#35AA9E"
            : e.edge_type === "qualified_by"
            ? "#DEA44C"
            : "#6665E8",
        strokeWidth: 2,
      },
      labelStyle: { fill: "#94A3B8", fontSize: 10, fontWeight: 500 },
      labelBgStyle: { fill: "#0B0F17", fillOpacity: 0.8 },
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
    <div className="flex flex-col h-[750px] w-full bg-[#0B0F17] border border-[#283548] rounded-xl overflow-hidden shadow-2xl">
      {/* Top Interactive Workspace Toolbar */}
      <div className="bg-[#141B26] border-b border-[#283548] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View Mode Toggle & Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B0F17] rounded-lg p-0.5 border border-[#283548]">
            <button
              onClick={() => setViewMode("graph")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "graph" ? "bg-[#1B2331] text-[#F1F3F7] font-semibold" : "text-[#94A3B8]"
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#6665E8]" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                viewMode === "cards" ? "bg-[#1B2331] text-[#F1F3F7] font-semibold" : "text-[#94A3B8]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#6665E8]" />
              <span>List View</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims or evidence..."
              className="bg-[#0B0F17] border border-[#283548] rounded-md pl-8 pr-3 py-1 text-xs text-[#F1F3F7] placeholder-[#64748B] focus:border-[#6665E8] outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Right: Filters & Metrics */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[#94A3B8]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              aria-label="Filter claims by verdict"
              className="bg-[#0B0F17] border border-[#283548] text-[#F1F3F7] rounded px-2 py-1 text-xs outline-none"
            >
              <option value="all">All Verdicts</option>
              <option value="Verified">Verified</option>
              <option value="False">False</option>
              <option value="Outdated">Outdated</option>
              <option value="Partially Supported">Partially Supported</option>
              <option value="Cannot Confirm">Cannot Confirm</option>
            </select>
          </div>

          <div className="text-[11px] text-[#94A3B8] hidden sm:block">
            <span className="text-[#F1F3F7] font-semibold">{graphData.nodes.length}</span> nodes •{" "}
            <span className="text-[#F1F3F7] font-semibold">{graphData.edges.length}</span> relationships
          </div>
        </div>
      </div>

      {/* Main Canvas / List Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
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
              <Background color="#1B2331" gap={20} size={1} variant={BackgroundVariant.Dots} />
              <Controls className="!bg-[#141B26] !border-[#283548] !fill-[#F1F3F7] !rounded-lg" />
              <MiniMap
                className="!bg-[#0B0F17] !border-[#283548] !rounded-lg hidden md:block"
                nodeColor={(n) => {
                  if (n.type === "atomic_claim") return "#6665E8";
                  if (n.type === "verdict") return "#35AA9E";
                  if (n.type === "evidence") return "#DEA44C";
                  return "#1B2331";
                }}
              />
            </ReactFlow>
          </div>
        ) : (
          /* Responsive Card/List Fallback */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h4 className="text-sm font-semibold text-[#F1F3F7] mb-2">Claim & Evidence Index</h4>
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
                  className="bg-[#141B26] border border-[#283548] hover:border-[#6665E8] p-4 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#6665E8]">Claim #{c.data.position || 1}</span>
                    <VerdictBadge verdict={c.data.verdict} size="sm" />
                  </div>
                  <p className="text-xs font-medium text-[#F1F3F7] mb-2">{c.data.normalized_claim}</p>
                  <p className="text-[11px] text-[#94A3B8]">
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
