import os
import re
from typing import List, Dict, Any, Tuple
from app.schemas.schemas import VerdictType, StanceType

def classify_evidence_stance(claim_text: str, excerpt: str) -> Tuple[StanceType, str]:
    """
    Evaluates evidence excerpt against claim to classify stance:
    supports, contradicts, qualifies, contextualizes, or insufficient.
    """
    excerpt_lower = excerpt.lower()
    claim_lower = claim_text.lower()

    # Contradiction indicators
    refutation_patterns = [
        r"\b(fake|hoax|false|debunked|baseless|misleading|refuted|no evidence|fact check.*false|untrue|scam)\b",
        r"\b(denied by|spokesperson confirmed no|pib fact check.*fake|clarified that no such)\b",
        r"\b(not true|never happened|fabricated|morphed)\b"
    ]
    for pat in refutation_patterns:
        if re.search(pat, excerpt_lower):
            return "contradicts", "The source explicitly identifies the claim or narrative as false, debunked, or a hoax."

    # Outdated indicators
    outdated_patterns = [
        r"\b(in 20\d\d|expired in|old notice|from \d+ years ago|outdated|no longer in effect|repealed|former policy)\b",
        r"\b(archived|past deadline|previous circular)\b"
    ]
    for pat in outdated_patterns:
        if re.search(pat, excerpt_lower):
            return "qualifies", "The source indicates the subject matter relates to an earlier period or expired timeframe."

    # Qualification / Partial support
    qualify_patterns = [
        r"\b(partially|only for|restricted to|with conditions|certain states only|misrepresented|taken out of context)\b",
        r"\b(clarified that only|misleading headline)\b"
    ]
    for pat in qualify_patterns:
        if re.search(pat, excerpt_lower):
            return "qualifies", "The source provides essential contextual qualifiers or limits the scope of the claim."

    # Support indicators
    support_patterns = [
        r"\b(confirmed that|announced today|official notification issued|gazette published|approved by)\b",
        r"\b(true|verified by|police registered|court ordered)\b"
    ]
    for pat in support_patterns:
        if re.search(pat, excerpt_lower):
            return "supports", "The source corroborates the factual accuracy of the reported action or statement."

    # Contextualizes
    if len(excerpt) > 40:
        return "contextualizes", "The source provides background context regarding the mentioned entities or subject."

    return "insufficient", "The excerpt contains insufficient detail to corroborate or refute the claim."

def determine_claim_verdict(claim_text: str, evidence_items: List[Dict[str, Any]]) -> Tuple[VerdictType, str]:
    """
    Assigns one of the 5 canonical verdicts based strictly on evaluated evidence:
    Verified, False, Outdated, Partially Supported, Cannot Confirm.
    """
    if not evidence_items:
        return "Cannot Confirm", "No independent corroborated public records or fact checks could be retrieved for this claim."

    stances = [item.get("stance") for item in evidence_items]

    # Rule 1: Contradictions from authoritative/fact check sources
    if "contradicts" in stances:
        return "False", "Authoritative sources and fact-checking records directly contradict this claim."

    # Rule 2: Outdated qualifiers
    if any(re.search(r"\b(old|outdated|expired|previous year|former)\b", item.get("excerpt", ""), re.IGNORECASE) for item in evidence_items):
        return "Outdated", "The information originated from a legitimate past event or notice but is no longer valid or active."

    # Rule 3: Mixed or qualifying stances
    if "qualifies" in stances or ("supports" in stances and "contextualizes" in stances):
        return "Partially Supported", "The claim contains an element of truth but omits vital qualifying context or geographical/temporal restrictions."

    # Rule 4: Corroborated support
    if stances.count("supports") >= 1:
        return "Verified", "Corroborated by verifiable primary records or credible news reporting."

    # Rule 5: Default to Cannot Confirm
    return "Cannot Confirm", "Public evidence is currently inconclusive or insufficient to definitively substantiate this claim."

def calculate_overall_verdict(claim_verdicts: List[VerdictType]) -> VerdictType:
    """
    Computes an honest summary verdict across all decomposed claims.
    """
    if not claim_verdicts:
        return "Cannot Confirm"

    if all(v == "Verified" for v in claim_verdicts):
        return "Verified"

    if any(v == "False" for v in claim_verdicts):
        if any(v == "Verified" for v in claim_verdicts) or any(v == "Partially Supported" for v in claim_verdicts):
            return "Partially Supported"
        return "False"

    if any(v == "Outdated" for v in claim_verdicts):
        return "Outdated"

    if any(v == "Partially Supported" for v in claim_verdicts):
        return "Partially Supported"

    return "Cannot Confirm"
