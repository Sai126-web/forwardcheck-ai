export type VerdictType = "Verified" | "False" | "Outdated" | "Partially Supported" | "Cannot Confirm";

export type StanceType = "supports" | "contradicts" | "qualifies" | "contextualizes" | "insufficient";

export type BaitCategoryType = "artificial_urgency" | "authority_appeals" | "forwarding_pressure" | "emotional_pressure" | "scarcity_fear";

export type InputType = "text" | "screenshot" | "photograph" | "audio" | "pdf" | "url";

export type ExecutionModeType = "live" | "sample" | "partial";

export type JobStageType = "queued" | "extracting" | "decomposing" | "retrieving_evidence" | "verifying" | "analyzing_rhetoric" | "generating_graph" | "completed" | "failed";

export interface Source {
  id: string;
  url: string;
  canonical_url?: string;
  title: string;
  publisher?: string;
  publication_date?: string;
  retrieval_date?: string;
  extraction_status?: string;
  reliability_tier?: string;
}

export interface Evidence {
  id: string;
  claim_id: string;
  source_id: string;
  citation_number: number;
  excerpt: string;
  stance: StanceType;
  relevance_explanation: string;
  provenance?: string;
  source?: Source;
}

export interface Claim {
  id: string;
  investigation_id: string;
  position: number;
  original_text: string;
  normalized_claim: string;
  entities: string[];
  dates_quantities: Record<string, any>;
  category: string;
  verdict: VerdictType;
  verdict_rationale: string;
  confidence_notes?: string;
  evidence_items?: Evidence[];
}

export interface BaitTag {
  id: string;
  investigation_id?: string;
  category: BaitCategoryType;
  phrase: string;
  start_char: number;
  end_char: number;
  severity: "low" | "medium" | "high";
  score_contribution: number;
  explanation: string;
}

export interface BaitCategoryBreakdown {
  category: BaitCategoryType;
  category_name: string;
  score: number;
  max_score: number;
  matched_phrases: string[];
  description: string;
}

export interface BaitIndexSummary {
  total_score: number;
  risk_level: "Low" | "Moderate" | "High" | "Critical";
  is_heuristic_indicator: boolean;
  disclaimer: string;
  categories: BaitCategoryBreakdown[];
  tags: BaitTag[];
}

export interface GraphNode {
  id: string;
  node_type: "original_forward" | "atomic_claim" | "source" | "evidence" | "verdict" | "bait_analysis" | "context";
  label: string;
  data: Record<string, any>;
  x_pos: number;
  y_pos: number;
}

export interface GraphEdge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: string;
  label?: string;
}

export interface TruthGraphData {
  investigation_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: Record<string, any>;
}

export interface GeneratedReport {
  id: string;
  investigation_id: string;
  overall_conclusion: string;
  plain_explanation_en: string;
  plain_explanation_hi?: string;
  plain_explanation_mr?: string;
  whatsapp_rebuttal: string;
  image_context_findings?: string;
  created_at: string;
}

export interface JobEvent {
  timestamp: string;
  stage: string;
  message: string;
}

export interface Job {
  id: string;
  investigation_id: string;
  stage: JobStageType;
  progress_percent: number;
  current_task: string;
  error_message?: string;
  events_log: JobEvent[];
  created_at: string;
  updated_at: string;
}

export interface InvestigationSummary {
  id: string;
  title: string;
  input_type: InputType;
  execution_mode: ExecutionModeType;
  status: string;
  overall_verdict?: VerdictType;
  bait_score: number;
  language: string;
  created_at: string;
  claims_count: number;
  sources_count: number;
}

export interface InvestigationDetail {
  id: string;
  title: string;
  original_content: string;
  normalized_content?: string;
  input_type: InputType;
  source_metadata: Record<string, any>;
  execution_mode: ExecutionModeType;
  status: string;
  overall_verdict?: VerdictType;
  bait_score: number;
  language: string;
  guest_session_id?: string;
  created_at: string;
  updated_at: string;
  claims: Claim[];
  bait_tags: BaitTag[];
  bait_summary?: BaitIndexSummary;
  report?: GeneratedReport;
  job?: Job;
}

export interface ExtractionResponse {
  input_type: InputType;
  raw_text: string;
  normalized_text: string;
  confidence: number;
  detected_claims: Array<{
    position: number;
    original_text: string;
    normalized_claim: string;
  }>;
  metadata: Record<string, any>;
  warnings: string[];
}
