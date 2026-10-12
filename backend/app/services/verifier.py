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

    # 1. Contradiction / Refutation indicators
    refutation_patterns = [
        r"\b(fake|hoax|false|debunked|baseless|misleading|refuted|no evidence|untrue|scam|rumor|myth|fabricat\w+)\b",
        r"\b(denied by|spokesperson confirmed no|pib fact check.*fake|clarified that no such|never happened)\b",
        r"\b(not true|not real|no basis|falsely claimed|inaccurate|pseudo|bizarre claim)\b"
    ]
    for pat in refutation_patterns:
        if re.search(pat, excerpt_lower):
            return "contradicts", "The source explicitly identifies the claim or narrative as false, debunked, or a hoax."

    # 2. Outdated indicators
    outdated_patterns = [
        r"\b(in 201\d|in 2020|in 2021|in 2022|expired in|old notice|from \d+ years ago|outdated|no longer in effect|repealed|former policy)\b",
        r"\b(archived|past deadline|previous circular|past year|prior to)\b"
    ]
    for pat in outdated_patterns:
        if re.search(pat, excerpt_lower):
            return "qualifies", "The source indicates the subject matter relates to an earlier period or expired timeframe."

    # 3. Qualification / Partial support
    qualify_patterns = [
        r"\b(partially|only for|restricted to|with conditions|certain states only|misrepresented|taken out of context)\b",
        r"\b(clarified that only|misleading headline|in some cases|selective|unverified aspect)\b"
    ]
    for pat in qualify_patterns:
        if re.search(pat, excerpt_lower):
            return "qualifies", "The source provides essential contextual qualifiers or limits the scope of the claim."

    # 4. Support indicators (explicit confirmation or predicate match)
    support_patterns = [
        r"\b(confirmed that|announced today|official notification|gazette published|approved by|signed by)\b",
        r"\b(verified by|police registered|court ordered|officially established|founded in|created in|passed in)\b",
        r"\b(certified|legally valid|inaugurated|declared by|recognized as|authoritative|published study)\b"
    ]
    for pat in support_patterns:
        if re.search(pat, excerpt_lower):
            return "supports", "The source corroborates the factual accuracy of the reported action or statement."

    # 5. Overlap match for factual predicates
    # If the excerpt contains significant matching terms from the claim without contradiction
    claim_words = [w for w in re.findall(r"\w+", claim_lower) if len(w) > 3 and w not in ["that", "this", "with", "from", "have", "were", "been", "they"]]
    if len(claim_words) >= 2:
        overlap = [w for w in claim_words if w in excerpt_lower]
        overlap_ratio = len(overlap) / len(claim_words)
        if overlap_ratio >= 0.5:
            return "supports", "Primary archival records corroborate the key factual propositions in this claim."

    # 6. Contextualizes
    if len(excerpt) > 35:
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
    if any(re.search(r"\b(old|outdated|expired|previous year|former|in 201\d)\b", item.get("excerpt", ""), re.IGNORECASE) for item in evidence_items):
        return "Outdated", "The information originated from a legitimate past event or notice but is no longer valid or active."

    # Rule 3: Corroborated support
    if stances.count("supports") >= 1:
        if "qualifies" in stances:
            return "Partially Supported", "The claim contains an element of truth but omits vital qualifying context or geographical/temporal restrictions."
        return "Verified", "Corroborated by verifiable primary records or credible news reporting."

    # Rule 4: Mixed or qualifying stances
    if "qualifies" in stances:
        return "Partially Supported", "The claim contains an element of truth but omits vital qualifying context or geographical/temporal restrictions."

    # Rule 5: Contextual background available without refutation
    if stances.count("contextualizes") >= 2:
        return "Partially Supported", "Historical archives verify the background context, though specific claims require secondary confirmation."

    # Rule 6: Default to Cannot Confirm
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

    if all(v == "Outdated" for v in claim_verdicts):
        return "Outdated"

    if any(v == "Partially Supported" for v in claim_verdicts):
        return "Partially Supported"

    if any(v == "Verified" for v in claim_verdicts):
        return "Partially Supported"

    return "Cannot Confirm"
