from fastapi import APIRouter
from pydantic import BaseModel
from app.services.bait_index import analyze_bait_index
from app.schemas.schemas import BaitIndexSummary

router = APIRouter(prefix="/bait", tags=["Bait Index"])

class BaitAnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze", response_model=BaitIndexSummary)
def analyze_text_bait(payload: BaitAnalyzeRequest):
    """
    Deterministic instant Bait Index calculation.
    Returns score (0-100), category breakdowns, and matched phrases with character spans.
    """
    return analyze_bait_index(payload.text)
