import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/health", tags=["Health & Status"])

@router.get("")
def health_check():
    """
    Returns system status, active database dialect, and configured AI/Search providers.
    """
    has_gemini = bool(os.getenv("GEMINI_API_KEY", "").strip())
    has_tavily = bool(os.getenv("TAVILY_API_KEY", "").strip())
    has_brave = bool(os.getenv("BRAVE_SEARCH_API_KEY", "").strip())
    has_factcheck = bool(os.getenv("GOOGLE_FACTCHECK_API_KEY", "").strip())

    return {
        "status": "healthy",
        "service": "ForwardCheck AI Forensic Verification Engine",
        "version": "1.0.0",
        "providers": {
            "gemini_llm": {"configured": has_gemini, "mode": "live" if has_gemini else "heuristic_fallback"},
            "tavily_search": {"configured": has_tavily, "mode": "live" if has_tavily else "duckduckgo_fallback"},
            "brave_search": {"configured": has_brave},
            "google_factcheck": {"configured": has_factcheck}
        },
        "mode": "live_ready" if (has_gemini or has_tavily) else "zero_secret_operational",
        "database": os.getenv("DATABASE_URL", "sqlite:///./forwardcheck.db").split(":")[0]
    }
