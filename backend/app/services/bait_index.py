import re
from typing import List, Dict, Any, Tuple
from app.schemas.schemas import BaitTagBase, BaitIndexSummary, BaitIndexCategoryBreakdown

# Category definitions and regex pattern suites with severity weights
CATEGORIES = {
    "artificial_urgency": {
        "name": "Artificial Urgency",
        "description": "Manufactured time constraints pressuring recipients to react before verifying.",
        "patterns": [
            (r"\b(urgent|urgently|immediately|right now|do not delay|act now|breaking news|alert|warning|attention please|critical notice)\b", "high", 8),
            (r"\b(before tonight|within 24 hours|deadline today|expires in \d+ hours|midnight tonight|last chance)\b", "high", 8),
            (r"\b(hurry|time is running out|don't wait|act fast|immediately check)\b", "medium", 6),
            (r"\b(emergency meeting|red alert|high alert)\b", "medium", 6),
        ]
    },
    "authority_appeals": {
        "name": "Authority Appeals",
        "description": "Vague, unverified, or fabricated appeals to official bodies, doctors, ministries, or military entities.",
        "patterns": [
            (r"\b(who announced|unicef reported|supreme court order|pm modi ordered|government declared|ministry of health|nasa confirmed|bbc confirmed|unesco declared)\b", "high", 8),
            (r"\b(official circular|as per intelligence sources|army advisory|doctor from aiims|top scientist reveals|confidential order)\b", "high", 8),
            (r"\b(leaked document|internal memo|gazette notification|verified by experts)\b", "medium", 6),
            (r"\b(cyber crime branch|police commissioner warning|rbi notice)\b", "medium", 6),
        ]
    },
    "forwarding_pressure": {
        "name": "Forwarding Pressure",
        "description": "Explicit instructions or emotional coercions demanding recipients resend or share the content widely.",
        "patterns": [
            (r"\b(forward this to (everyone|all your groups|at least \d+ people|10 people|5 groups|family))\b", "high", 8),
            (r"\b(share before it gets deleted|make this viral|repost immediately|don't break this chain|forward as received)\b", "high", 8),
            (r"\b(spread this message|every indian must know|share to save lives|pass it on|share with everyone)\b", "medium", 6),
            (r"\b(press forward|send to all contacts|share maximum)\b", "medium", 6),
        ]
    },
    "emotional_pressure": {
        "name": "Emotional Pressure",
        "description": "Appeals to moral duty, guilt, outrage, patriotism, or grief designed to bypass rational skepticism.",
        "patterns": [
            (r"\b(if you care about your (mother|child|family|nation|country)|shame on you if you don't share)\b", "high", 8),
            (r"\b(heartbreaking|shocking truth|they don't want you to know|crying tears|unforgivable betrayal)\b", "medium", 6),
            (r"\b(true patriot will share|prove you love your country|don't ignore this|if you have a heart)\b", "high", 8),
            (r"\b(wake up before it's too late|our enemies are celebrating|save our culture)\b", "medium", 6),
        ]
    },
    "scarcity_fear": {
        "name": "Scarcity & Fear",
        "description": "Stoking catastrophic outcomes, existential threats, financial ruin, or immediate physical danger.",
        "patterns": [
            (r"\b(poisonous|deadly virus|all accounts will be frozen|phone will be blocked|ban begins tomorrow)\b", "high", 8),
            (r"\b(secret radiation|causes instant cancer|toxic chemical injected|bank balance wiped out)\b", "high", 8),
            (r"\b(danger|fatal consequences|loss of all money|blacklisted forever)\b", "medium", 6),
            (r"\b(shutting down forever|no more free service|will charge money from tomorrow)\b", "medium", 6),
        ]
    }
}

def analyze_bait_index(text: str) -> BaitIndexSummary:
    """
    Deterministically computes the Bait Index (0-100) across 5 categories.
    Each category is capped at 20 points.
    Returns matched tags with exact character spans, category scores, and disclaimers.
    """
    if not text or not text.strip():
        categories_breakdown = [
            BaitIndexCategoryBreakdown(
                category=cat_key,
                category_name=cat_data["name"],
                score=0,
                max_score=20,
                matched_phrases=[],
                description=cat_data["description"]
            )
            for cat_key, cat_data in CATEGORIES.items()
        ]
        return BaitIndexSummary(
            total_score=0,
            risk_level="Low",
            is_heuristic_indicator=True,
            disclaimer="Heuristic rhetoric indicator, not a measure of factual accuracy or probability that a message is fake.",
            categories=categories_breakdown,
            tags=[]
        )

    all_tags: List[BaitTagBase] = []
    category_scores: Dict[str, int] = {k: 0 for k in CATEGORIES}
    category_matches: Dict[str, List[str]] = {k: [] for k in CATEGORIES}

    text_lower = text.lower()

    for cat_key, cat_data in CATEGORIES.items():
        cat_score = 0
        matched_spans: List[Tuple[int, int]] = []

        for pattern, severity, pts in cat_data["patterns"]:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                start, end = match.start(), match.end()
                phrase = text[start:end]

                # Prevent overlapping duplicate matches in the same category
                if any(s <= start < e or s < end <= e for s, e in matched_spans):
                    continue

                matched_spans.append((start, end))
                cat_score += pts
                category_matches[cat_key].append(phrase)

                explanation_text = f"Identified '{phrase}' as a marker of {cat_data['name'].lower()} ({severity} severity)."
                all_tags.append(
                    BaitTagBase(
                        category=cat_key,
                        phrase=phrase,
                        start_char=start,
                        end_char=end,
                        severity=severity,
                        score_contribution=pts,
                        explanation=explanation_text
                    )
                )

        # Cap score for this category at 20 points
        category_scores[cat_key] = min(20, cat_score)

    total_score = min(100, sum(category_scores.values()))

    # Determine risk level
    if total_score >= 65:
        risk_level = "Critical"
    elif total_score >= 40:
        risk_level = "High"
    elif total_score >= 20:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    categories_breakdown = [
        BaitIndexCategoryBreakdown(
            category=cat_key,
            category_name=CATEGORIES[cat_key]["name"],
            score=category_scores[cat_key],
            max_score=20,
            matched_phrases=list(set(category_matches[cat_key])),
            description=CATEGORIES[cat_key]["description"]
        )
        for cat_key in CATEGORIES
    ]

    return BaitIndexSummary(
        total_score=total_score,
        risk_level=risk_level,
        is_heuristic_indicator=True,
        disclaimer="Heuristic rhetoric indicator, not a measure of factual accuracy or probability that a message is fake.",
        categories=categories_breakdown,
        tags=all_tags
    )
