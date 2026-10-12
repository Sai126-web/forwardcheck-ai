from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any, Literal, Union
from datetime import datetime

# Enums as literals for clear typing
VerdictType = Literal["Verified", "False", "Outdated", "Partially Supported", "Cannot Confirm"]
StanceType = Literal["supports", "contradicts", "qualifies", "contextualizes", "insufficient"]
BaitCategoryType = Literal["artificial_urgency", "authority_appeals", "forwarding_pressure", "emotional_pressure", "scarcity_fear"]
InputType = Literal["text", "screenshot", "photograph", "audio", "pdf", "url"]
ExecutionModeType = Literal["live", "sample", "partial"]
JobStageType = Literal["queued", "extracting", "decomposing", "retrieving_evidence", "verifying", "analyzing_rhetoric", "generating_graph", "completed", "failed"]

# Evidence & Source Schemas
class SourceBase(BaseModel):
    url: str
    canonical_url: Optional[str] = None
    title: str
    publisher: Optional[str] = None
    publication_date: Optional[str] = None
    retrieval_date: Optional[str] = None
    extraction_status: str = "extracted"
    reliability_tier: str = "high"

class SourceResponse(SourceBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class EvidenceBase(BaseModel):
    citation_number: int = 1
    excerpt: str
    stance: StanceType
    relevance_explanation: str
    provenance: Optional[str] = None

class EvidenceResponse(EvidenceBase):
    id: str
    claim_id: str
    source_id: str
    source: Optional[SourceResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Claim Schemas
class ClaimBase(BaseModel):
    position: int = 1
    original_text: str
    normalized_claim: str
    entities: List[str] = Field(default_factory=list)
    dates_quantities: Dict[str, Any] = Field(default_factory=dict)
    category: str = "factual"
    verdict: VerdictType = "Cannot Confirm"
    verdict_rationale: str = ""
    confidence_notes: Optional[str] = None

class ClaimCreate(BaseModel):
    original_text: str
    normalized_claim: str
    position: int = 1

class ClaimUpdate(BaseModel):
    normalized_claim: Optional[str] = None
    verdict: Optional[VerdictType] = None
    verdict_rationale: Optional[str] = None

class ClaimResponse(ClaimBase):
    id: str
    investigation_id: str
    evidence_items: List[EvidenceResponse] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

# Bait Index Schemas
class BaitTagBase(BaseModel):
    category: BaitCategoryType
    phrase: str
    start_char: int
    end_char: int
    severity: Literal["low", "medium", "high"] = "medium"
    score_contribution: int = 10
    explanation: str

class BaitTagResponse(BaitTagBase):
    id: str
    investigation_id: str
    model_config = ConfigDict(from_attributes=True)

class BaitIndexCategoryBreakdown(BaseModel):
    category: BaitCategoryType
    category_name: str
    score: int = Field(ge=0, le=20)
    max_score: int = 20
    matched_phrases: List[str] = Field(default_factory=list)
    description: str

class BaitIndexSummary(BaseModel):
    total_score: int = Field(ge=0, le=100)
    risk_level: Literal["Low", "Moderate", "High", "Critical"]
    is_heuristic_indicator: bool = True
    disclaimer: str = "Heuristic rhetoric indicator, not a measure of factual accuracy or probability that a message is fake."
    categories: List[BaitIndexCategoryBreakdown] = Field(default_factory=list)
    tags: List[Union[BaitTagResponse, BaitTagBase]] = Field(default_factory=list)

# Graph Schemas
class GraphNodeSchema(BaseModel):
    id: str
    node_type: str
    label: str
    data: Dict[str, Any]
    x_pos: float = 0.0
    y_pos: float = 0.0
    model_config = ConfigDict(from_attributes=True)

class GraphEdgeSchema(BaseModel):
    id: str
    source_node_id: str
    target_node_id: str
    edge_type: str
    label: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class TruthGraphResponse(BaseModel):
    investigation_id: str
    nodes: List[GraphNodeSchema] = Field(default_factory=list)
    edges: List[GraphEdgeSchema] = Field(default_factory=list)
    summary: Dict[str, Any] = Field(default_factory=dict)

# Report Schemas
class GeneratedReportResponse(BaseModel):
    id: str
    investigation_id: str
    overall_conclusion: str
    plain_explanation_en: str
    plain_explanation_hi: Optional[str] = None
    plain_explanation_mr: Optional[str] = None
    whatsapp_rebuttal: str
    image_context_findings: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Job Schemas
class JobResponse(BaseModel):
    id: str
    investigation_id: str
    stage: JobStageType
    progress_percent: int
    current_task: str
    error_message: Optional[str] = None
    events_log: List[Dict[str, Any]] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Extraction Preview Schemas
class ExtractionRequest(BaseModel):
    content: Optional[str] = None
    input_type: InputType = "text"
    url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ExtractionResponse(BaseModel):
    input_type: InputType
    raw_text: str
    normalized_text: str
    confidence: float = 1.0
    detected_claims: List[ClaimCreate] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)

# Main Investigation Schemas
class InvestigationCreate(BaseModel):
    title: Optional[str] = None
    original_content: str
    input_type: InputType = "text"
    language: str = "en"
    source_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    guest_session_id: Optional[str] = None
    reviewed_claims: Optional[List[ClaimCreate]] = None

class InvestigationUpdate(BaseModel):
    title: Optional[str] = None

class InvestigationSummary(BaseModel):
    id: str
    title: str
    input_type: InputType
    execution_mode: ExecutionModeType
    status: str
    overall_verdict: Optional[VerdictType] = None
    bait_score: int
    language: str
    created_at: datetime
    claims_count: int = 0
    sources_count: int = 0
    model_config = ConfigDict(from_attributes=True)

class InvestigationDetailResponse(BaseModel):
    id: str
    title: str
    original_content: str
    normalized_content: Optional[str] = None
    input_type: InputType
    source_metadata: Dict[str, Any] = Field(default_factory=dict)
    execution_mode: ExecutionModeType
    status: str
    overall_verdict: Optional[VerdictType] = None
    bait_score: int
    language: str
    guest_session_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    claims: List[ClaimResponse] = Field(default_factory=list)
    bait_tags: List[BaitTagResponse] = Field(default_factory=list)
    bait_summary: Optional[BaitIndexSummary] = None
    report: Optional[GeneratedReportResponse] = None
    job: Optional[JobResponse] = None
    model_config = ConfigDict(from_attributes=True)

# Share Link Schemas
class ShareLinkCreate(BaseModel):
    expires_in_hours: Optional[int] = 168

class ShareLinkResponse(BaseModel):
    id: str
    investigation_id: str
    token: str
    share_url: str
    is_active: bool
    views_count: int
    created_at: datetime
    expires_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
