from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.models import Claim, Investigation
from app.schemas.schemas import ClaimResponse, ClaimUpdate

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.patch("/{claim_id}", response_model=ClaimResponse)
def update_claim(
    claim_id: str,
    payload: ClaimUpdate,
    db: Session = Depends(get_db)
):
    """Allows user or analyst to correct a claim's text, verdict, or rationale."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found.")

    if payload.normalized_claim is not None:
        claim.normalized_claim = payload.normalized_claim
    if payload.verdict is not None:
        claim.verdict = payload.verdict
    if payload.verdict_rationale is not None:
        claim.verdict_rationale = payload.verdict_rationale

    db.commit()
    db.refresh(claim)
    return claim
