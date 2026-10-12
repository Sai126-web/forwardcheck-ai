import pytest
from app.services.verifier import classify_evidence_stance, determine_claim_verdict, calculate_overall_verdict

def test_absence_of_evidence_returns_cannot_confirm():
    """
    Critical specification requirement:
    Absence of evidence does not prove a claim false.
    If evidence is insufficient, return 'Cannot Confirm'. Never invent a truth confidence percentage.
    """
    claim = "Local municipal office changed building permit fee to 3500 rupees."
    verdict, rationale = determine_claim_verdict(claim, [])
    assert verdict == "Cannot Confirm"
    assert "No independent corroborated public records" in rationale

def test_contradictory_evidence_returns_false():
    claim = "WHO declared emergency contamination in bottled water."
    evidence = [{
        "stance": "contradicts",
        "excerpt": "WHO clarified this is a viral hoax and no advisory has been released."
    }]
    verdict, _ = determine_claim_verdict(claim, evidence)
    assert verdict == "False"

def test_qualifying_evidence_returns_partially_supported():
    claim = "Writing on banknotes makes them completely invalid."
    evidence = [{
        "stance": "qualifies",
        "excerpt": "RBI Clean Note Policy discourages scribbling, but notes remain legal tender and can be deposited."
    }]
    verdict, _ = determine_claim_verdict(claim, evidence)
    assert verdict == "Partially Supported"

def test_outdated_evidence_returns_outdated():
    claim = "LPG subsidy registration closes today."
    evidence = [{
        "stance": "qualifies",
        "excerpt": "This was an old notice from 2023; the ministry has since clarified there is no rigid deadline."
    }]
    verdict, _ = determine_claim_verdict(claim, evidence)
    assert verdict == "Outdated"

def test_five_canonical_verdicts_only():
    allowed_verdicts = {"Verified", "False", "Outdated", "Partially Supported", "Cannot Confirm"}
    assert calculate_overall_verdict(["Verified", "Verified"]) in allowed_verdicts
    assert calculate_overall_verdict(["False"]) in allowed_verdicts
    assert calculate_overall_verdict(["Outdated"]) in allowed_verdicts
    assert calculate_overall_verdict([]) in allowed_verdicts
