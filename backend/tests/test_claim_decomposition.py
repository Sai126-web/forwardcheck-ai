import pytest
from app.services.claim_decomposer import decompose_claims, extract_entities, extract_dates_and_quantities

def test_claim_decomposition_filters_rhetorical_forward():
    content = """
    URGENT ALERT: Government of India announced a new digital health ID requirement by 31st December 2026.
    Every citizen will receive 5000 rupees in their account.
    Forward this to 10 people in your contact list immediately or you will lose benefits!
    """
    claims = decompose_claims(content)
    # The pure forwarding command must NOT be treated as a factual claim
    for c in claims:
        assert "forward this to 10 people" not in c["normalized_claim"].lower()

def test_claim_decomposition_entities_and_dates():
    content = "NASA and ISRO launched a joint satellite on 15th August costing $500 million."
    claims = decompose_claims(content)
    assert len(claims) >= 1
    c = claims[0]
    assert any("NASA" in e or "ISRO" in e for e in c["entities"])
    assert len(c["dates_quantities"].get("dates", [])) > 0 or len(c["dates_quantities"].get("quantities", [])) > 0
