from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.database import get_db
from app.models.models import Evidence, Source, Claim, Investigation
from app.schemas.schemas import EvidenceResponse, SourceResponse

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.get("", response_model=List[EvidenceResponse])
def list_evidence_library(
    q: Optional[str] = Query(None, description="Search across excerpts, titles, publishers"),
    stance: Optional[str] = Query(None, description="Filter by stance: supports, contradicts, qualifies, contextualizes, insufficient"),
    tier: Optional[str] = Query(None, description="Filter by reliability tier"),
    investigation_id: Optional[str] = Query(None, description="Filter by investigation ID"),
    db: Session = Depends(get_db)
):
    """
    Returns verified evidence passages from authorized investigations with source attribution.
    """
    query = db.query(Evidence).join(Source).join(Claim)

    if investigation_id:
        query = query.filter(Claim.investigation_id == investigation_id)
    if stance:
        query = query.filter(Evidence.stance == stance)
    if tier:
        query = query.filter(Source.reliability_tier == tier)
    if q:
        query = query.filter(
            Evidence.excerpt.ilike(f"%{q}%") |
            Source.title.ilike(f"%{q}%") |
            Source.publisher.ilike(f"%{q}%") |
            Claim.normalized_claim.ilike(f"%{q}%")
        )

    evidence_records = query.order_by(desc(Evidence.id)).all()
    return evidence_records
