import asyncio
import uuid
import secrets
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.database import get_db
from app.models.models import (
    Investigation, Claim, Source, Evidence, BaitTag, GraphNode, GraphEdge, GeneratedReport, Job, ShareLink
)
from app.schemas.schemas import (
    InvestigationCreate, InvestigationUpdate, InvestigationSummary,
    InvestigationDetailResponse, ExtractionRequest, ExtractionResponse,
    JobResponse, ShareLinkCreate, ShareLinkResponse, ClaimCreate
)
from app.services.bait_index import analyze_bait_index
from app.services.claim_decomposer import decompose_claims
from app.services.job_runner import execute_investigation_pipeline
from app.services.multimodal import (
    extract_url_content, simulate_or_process_ocr, simulate_or_process_audio, simulate_or_process_pdf
)

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.post("/extract", response_model=ExtractionResponse)
async def extract_content_preview(payload: ExtractionRequest):
    """
    Step 1 Ingestion & Extraction preview.
    Allows user to inspect raw extracted text, warnings, and detected atomic claims
    before submitting for heavy verification.
    """
    raw_text = payload.content or ""
    warnings = []
    metadata = payload.metadata or {}
    confidence = 1.0

    if payload.input_type == "url" and payload.url:
        try:
            url_res = await extract_url_content(payload.url)
            raw_text = url_res["extracted_text"]
            metadata["title"] = url_res["title"]
            metadata["publisher"] = url_res["publisher"]
            metadata["url"] = url_res["url"]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to fetch public URL: {str(e)}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="No content or text could be extracted.")

    # Decompose detected claims for review
    detected_raw = decompose_claims(raw_text)
    detected_claims = [
        ClaimCreate(
            position=c["position"],
            original_text=c["original_text"],
            normalized_claim=c["normalized_claim"]
        )
        for c in detected_raw
    ]

    return ExtractionResponse(
        input_type=payload.input_type,
        raw_text=raw_text,
        normalized_text=raw_text.strip(),
        confidence=confidence,
        detected_claims=detected_claims,
        metadata=metadata,
        warnings=warnings
    )

@router.post("/upload-multimodal", response_model=ExtractionResponse)
async def upload_multimodal_file(
    file: UploadFile = File(...),
    input_type: str = Form("screenshot")
):
    """
    Upload and extract text from Screenshots, Audio, or PDF files.
    """
    content = await file.read()
    filename = file.filename or "upload"
    
    if input_type in ["screenshot", "photograph"]:
        res = simulate_or_process_ocr(content, filename)
    elif input_type == "audio":
        res = simulate_or_process_audio(content, filename)
    elif input_type == "pdf":
        res = simulate_or_process_pdf(content, filename)
    else:
        res = {"extracted_text": content.decode("utf-8", errors="ignore"), "confidence": 1.0, "warnings": []}

    raw_text = res["extracted_text"]
    detected_raw = decompose_claims(raw_text)
    detected_claims = [
        ClaimCreate(
            position=c["position"],
            original_text=c["original_text"],
            normalized_claim=c["normalized_claim"]
        )
        for c in detected_raw
    ]

    return ExtractionResponse(
        input_type=input_type,
        raw_text=raw_text,
        normalized_text=raw_text.strip(),
        confidence=res.get("confidence", 0.9),
        detected_claims=detected_claims,
        metadata={"filename": filename, "filesize": len(content)},
        warnings=res.get("warnings", [])
    )

@router.post("", response_model=InvestigationDetailResponse)
async def create_investigation(
    payload: InvestigationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Creates an investigation, initializes the background job, and starts verification.
    """
    title = payload.title or (payload.original_content[:60] + "..." if len(payload.original_content) > 60 else payload.original_content)

    inv = Investigation(
        title=title,
        original_content=payload.original_content,
        normalized_content=payload.original_content.strip(),
        input_type=payload.input_type,
        source_metadata=payload.source_metadata or {},
        execution_mode="live",  # Will become 'live' or 'partial' depending on results
        status="processing",
        language=payload.language,
        guest_session_id=payload.guest_session_id
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    # Initialize Job
    job = Job(
        investigation_id=inv.id,
        stage="queued",
        progress_percent=5,
        current_task="Investigation queued for processing",
        events_log=[{
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "stage": "queued",
            "message": "Verification pipeline registered"
        }]
    )
    db.add(job)
    db.commit()

    # Convert reviewed claims if provided
    claims_payload = None
    if payload.reviewed_claims:
        claims_payload = [c.model_dump() for c in payload.reviewed_claims]

    # Run in background
    background_tasks.add_task(
        execute_investigation_pipeline,
        investigation_id=inv.id,
        db=db,
        user_claims=claims_payload
    )

    # Return initial detail
    inv_detail = get_investigation_detail(inv.id, db)
    return inv_detail

@router.get("", response_model=List[InvestigationSummary])
def list_investigations(
    q: Optional[str] = Query(None, description="Search term"),
    verdict: Optional[str] = Query(None, description="Filter by overall verdict"),
    mode: Optional[str] = Query(None, description="Filter by execution mode (live/sample/partial)"),
    guest_session_id: Optional[str] = Query(None, description="Guest session filter"),
    db: Session = Depends(get_db)
):
    """List investigations with optional search and filters."""
    query = db.query(Investigation)

    if guest_session_id:
        query = query.filter(
            (Investigation.guest_session_id == guest_session_id) | (Investigation.execution_mode == "sample")
        )
    if q:
        query = query.filter(Investigation.title.ilike(f"%{q}%") | Investigation.original_content.ilike(f"%{q}%"))
    if verdict:
        query = query.filter(Investigation.overall_verdict == verdict)
    if mode:
        query = query.filter(Investigation.execution_mode == mode)

    investigations = query.order_by(desc(Investigation.created_at)).all()

    results = []
    for inv in investigations:
        claims_cnt = db.query(Claim).filter(Claim.investigation_id == inv.id).count()
        results.append(
            InvestigationSummary(
                id=inv.id,
                title=inv.title,
                input_type=inv.input_type,
                execution_mode=inv.execution_mode,
                status=inv.status,
                overall_verdict=inv.overall_verdict,
                bait_score=inv.bait_score,
                language=inv.language,
                created_at=inv.created_at,
                claims_count=claims_cnt,
                sources_count=0
            )
        )
    return results

@router.get("/{investigation_id}", response_model=InvestigationDetailResponse)
def get_investigation(investigation_id: str, db: Session = Depends(get_db)):
    """Retrieve full investigation details with claims, evidence, bait tags, and report."""
    return get_investigation_detail(investigation_id, db)

def get_investigation_detail(investigation_id: str, db: Session) -> InvestigationDetailResponse:
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation record not found.")

    bait_summary = analyze_bait_index(inv.original_content)
    job = db.query(Job).filter(Job.investigation_id == inv.id).order_by(desc(Job.created_at)).first()

    return InvestigationDetailResponse(
        id=inv.id,
        title=inv.title,
        original_content=inv.original_content,
        normalized_content=inv.normalized_content,
        input_type=inv.input_type,
        source_metadata=inv.source_metadata or {},
        execution_mode=inv.execution_mode,
        status=inv.status,
        overall_verdict=inv.overall_verdict,
        bait_score=inv.bait_score,
        language=inv.language,
        guest_session_id=inv.guest_session_id,
        created_at=inv.created_at,
        updated_at=inv.updated_at,
        claims=inv.claims,
        bait_tags=inv.bait_tags,
        bait_summary=bait_summary,
        report=inv.report,
        job=job
    )

@router.patch("/{investigation_id}", response_model=InvestigationSummary)
def update_investigation(
    investigation_id: str,
    payload: InvestigationUpdate,
    db: Session = Depends(get_db)
):
    """Rename an investigation title."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    if payload.title:
        inv.title = payload.title
        db.commit()
        db.refresh(inv)

    return InvestigationSummary(
        id=inv.id,
        title=inv.title,
        input_type=inv.input_type,
        execution_mode=inv.execution_mode,
        status=inv.status,
        overall_verdict=inv.overall_verdict,
        bait_score=inv.bait_score,
        language=inv.language,
        created_at=inv.created_at,
        claims_count=len(inv.claims),
        sources_count=0
    )

@router.delete("/{investigation_id}")
def delete_investigation(investigation_id: str, db: Session = Depends(get_db)):
    """Delete an investigation and all cascade records."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    db.delete(inv)
    db.commit()
    return {"message": "Investigation successfully deleted.", "id": investigation_id}

@router.get("/{investigation_id}/job", response_model=JobResponse)
def get_investigation_job(investigation_id: str, db: Session = Depends(get_db)):
    """Retrieve genuine processing state, stage, progress %, and event logs."""
    job = db.query(Job).filter(Job.investigation_id == investigation_id).order_by(desc(Job.created_at)).first()
    if not job:
        raise HTTPException(status_code=404, detail="No active or past job for this investigation.")
    return job

@router.post("/{investigation_id}/retry", response_model=JobResponse)
async def retry_investigation(
    investigation_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Retry a failed or interrupted investigation."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    inv.status = "processing"
    job = db.query(Job).filter(Job.investigation_id == investigation_id).first()
    if not job:
        job = Job(investigation_id=investigation_id)
        db.add(job)
    
    job.stage = "queued"
    job.progress_percent = 10
    job.current_task = "Retrying investigation pipeline"
    job.error_message = None
    db.commit()

    background_tasks.add_task(
        execute_investigation_pipeline,
        investigation_id=inv.id,
        db=db
    )
    return job

@router.post("/{investigation_id}/share", response_model=ShareLinkResponse)
def create_share_link(
    investigation_id: str,
    payload: ShareLinkCreate,
    db: Session = Depends(get_db)
):
    """Generates an opt-in deliberate share link for an investigation."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found.")

    token = secrets.token_urlsafe(16)
    expires_at = datetime.utcnow() + timedelta(hours=payload.expires_in_hours or 168)

    sl = ShareLink(
        investigation_id=inv.id,
        token=token,
        is_active=True,
        expires_at=expires_at
    )
    db.add(sl)
    db.commit()
    db.refresh(sl)

    share_url = f"/investigations/{inv.id}?share={token}"
    return ShareLinkResponse(
        id=sl.id,
        investigation_id=sl.investigation_id,
        token=sl.token,
        share_url=share_url,
        is_active=sl.is_active,
        views_count=sl.views_count,
        created_at=sl.created_at,
        expires_at=sl.expires_at
    )
