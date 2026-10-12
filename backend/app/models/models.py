import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, default="Untitled Investigation")
    original_content = Column(Text, nullable=False)
    normalized_content = Column(Text, nullable=True)
    input_type = Column(String(50), nullable=False, default="text")  # text, screenshot, photograph, audio, pdf, url
    source_metadata = Column(JSON, nullable=True, default=dict)
    execution_mode = Column(String(20), nullable=False, default="sample")  # live, sample, partial
    status = Column(String(30), nullable=False, default="completed")  # queued, processing, completed, failed
    overall_verdict = Column(String(50), nullable=True)  # Verified, False, Outdated, Partially Supported, Cannot Confirm
    bait_score = Column(Integer, nullable=False, default=0)
    language = Column(String(10), nullable=False, default="en")
    guest_session_id = Column(String(100), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    claims = relationship("Claim", back_populates="investigation", cascade="all, delete-orphan", order_by="Claim.position")
    bait_tags = relationship("BaitTag", back_populates="investigation", cascade="all, delete-orphan")
    graph_nodes = relationship("GraphNode", back_populates="investigation", cascade="all, delete-orphan")
    graph_edges = relationship("GraphEdge", back_populates="investigation", cascade="all, delete-orphan")
    report = relationship("GeneratedReport", back_populates="investigation", uselist=False, cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="investigation", cascade="all, delete-orphan")
    share_links = relationship("ShareLink", back_populates="investigation", cascade="all, delete-orphan")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    position = Column(Integer, nullable=False, default=1)
    original_text = Column(Text, nullable=False)
    normalized_claim = Column(Text, nullable=False)
    entities = Column(JSON, nullable=True, default=list)
    dates_quantities = Column(JSON, nullable=True, default=dict)
    category = Column(String(50), nullable=False, default="factual")  # factual, contextual, temporal
    verdict = Column(String(50), nullable=False, default="Cannot Confirm")  # Verified, False, Outdated, Partially Supported, Cannot Confirm
    verdict_rationale = Column(Text, nullable=False, default="")
    confidence_notes = Column(Text, nullable=True)

    investigation = relationship("Investigation", back_populates="claims")
    evidence_items = relationship("Evidence", back_populates="claim", cascade="all, delete-orphan")


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    url = Column(Text, nullable=False)
    canonical_url = Column(Text, nullable=True)
    title = Column(String(500), nullable=False)
    publisher = Column(String(255), nullable=True)
    publication_date = Column(String(100), nullable=True)
    retrieval_date = Column(String(100), nullable=True)
    extraction_status = Column(String(50), default="extracted")
    reliability_tier = Column(String(50), default="high")  # primary_record, authoritative_factcheck, trusted_news, contextual

    evidence_passages = relationship("Evidence", back_populates="source", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True)
    source_id = Column(String(36), ForeignKey("sources.id", ondelete="CASCADE"), nullable=False, index=True)
    citation_number = Column(Integer, default=1)
    excerpt = Column(Text, nullable=False)
    stance = Column(String(50), nullable=False, default="supports")  # supports, contradicts, qualifies, contextualizes, insufficient
    relevance_explanation = Column(Text, nullable=False)
    provenance = Column(String(255), nullable=True)

    claim = relationship("Claim", back_populates="evidence_items")
    source = relationship("Source", back_populates="evidence_passages")


class BaitTag(Base):
    __tablename__ = "bait_tags"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)  # artificial_urgency, authority_appeals, forwarding_pressure, emotional_pressure, scarcity_fear
    phrase = Column(String(500), nullable=False)
    start_char = Column(Integer, nullable=False)
    end_char = Column(Integer, nullable=False)
    severity = Column(String(20), nullable=False, default="medium")  # low, medium, high
    score_contribution = Column(Integer, nullable=False, default=10)
    explanation = Column(Text, nullable=False)

    investigation = relationship("Investigation", back_populates="bait_tags")


class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(String(100), primary_key=True)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    node_type = Column(String(50), nullable=False)  # original_forward, atomic_claim, source, evidence, verdict, bait_analysis, context
    label = Column(String(255), nullable=False)
    data = Column(JSON, nullable=False, default=dict)
    x_pos = Column(Float, nullable=False, default=0.0)
    y_pos = Column(Float, nullable=False, default=0.0)

    investigation = relationship("Investigation", back_populates="graph_nodes")


class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id = Column(String(100), primary_key=True)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    source_node_id = Column(String(100), nullable=False)
    target_node_id = Column(String(100), nullable=False)
    edge_type = Column(String(50), nullable=False)  # contains_claim, supported_by, contradicted_by, qualified_by, extracted_from, associated_with_date, contains_bait_technique, image_appeared_in_source, has_unresolved_gap
    label = Column(String(100), nullable=True)

    investigation = relationship("Investigation", back_populates="graph_edges")


class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, unique=True)
    overall_conclusion = Column(Text, nullable=False)
    plain_explanation_en = Column(Text, nullable=False)
    plain_explanation_hi = Column(Text, nullable=True)
    plain_explanation_mr = Column(Text, nullable=True)
    whatsapp_rebuttal = Column(Text, nullable=False)
    image_context_findings = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    investigation = relationship("Investigation", back_populates="report")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    stage = Column(String(50), nullable=False, default="queued")  # queued, extracting, decomposing, retrieving_evidence, verifying, analyzing_rhetoric, generating_graph, completed, failed
    progress_percent = Column(Integer, nullable=False, default=0)
    current_task = Column(String(255), nullable=False, default="Initializing verification job")
    error_message = Column(Text, nullable=True)
    events_log = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    investigation = relationship("Investigation", back_populates="jobs")


class ShareLink(Base):
    __tablename__ = "share_links"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    investigation_id = Column(String(36), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(64), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    investigation = relationship("Investigation", back_populates="share_links")
