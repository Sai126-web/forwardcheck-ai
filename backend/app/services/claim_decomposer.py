import os
import re
from typing import List, Dict, Any
from app.schemas.schemas import ClaimCreate, ClaimBase

def extract_entities(text: str) -> List[str]:
    """Extract capitalized multi-word or single-word named entities."""
    # Matches words starting with capital letters, including acronyms like WHO, NASA, AIIMS, RBI
    entities = re.findall(r"\b[A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)*\b", text)
    # Filter out common sentence start words
    stopwords = {"The", "This", "That", "It", "They", "We", "You", "If", "All", "According", "Please", "Do", "Don", "Warning", "Alert", "Forward", "Urgent", "Breaking"}
    filtered = [e for e in entities if e not in stopwords and len(e) > 1]
    return list(dict.fromkeys(filtered))[:6]

def extract_dates_and_quantities(text: str) -> Dict[str, Any]:
    """Extract numbers, dates, monetary amounts, and timeframes."""
    dates = re.findall(r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,\s+\d{4})?|\b\d{4}\b)\b", text)
    quantities = re.findall(r"\b(?:\$|₹|Rs\.?|INR\s*)\s*[\d,]+(?:\.\d+)?|\b\d+(?:%|\s*(?:lakh|crore|million|billion|hours|days|weeks|months|years|people|cases))\b", text, re.IGNORECASE)
    return {
        "dates": list(set(dates)),
        "quantities": list(set(quantities))
    }

def is_rhetorical_instruction(sentence: str) -> bool:
    """Detect if a sentence is purely a rhetorical forward instruction or emotional plea."""
    patterns = [
        r"forward this to",
        r"share before it gets deleted",
        r"make this viral",
        r"send this to all",
        r"don't break this chain",
        r"if you love your",
        r"shame on you",
        r"press forward",
    ]
    return any(re.search(p, sentence, re.IGNORECASE) for p in patterns)

def decompose_claims(content: str) -> List[Dict[str, Any]]:
    """
    Decomposes an input text into discrete atomic claims.
    Uses Gemini if GEMINI_API_KEY is present; otherwise uses an intelligent rule-based sentence decomposition.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    
    # Try Gemini API if key is present
    if api_key:
        try:
            from google import genai
            from google.genai import types
            
            client = genai.Client(api_key=api_key)
            prompt = f"""You are a senior forensic fact-checker. Decompose the following forwarded message into discrete, testable atomic factual claims.
Exclude pure rhetorical commands like 'forward this to 10 friends' or pure opinion.
For each claim, return:
- original_text: exact substring or sentence
- normalized_claim: concise, neutral factual proposition
- entities: list of organizations, people, places, laws
- dates_quantities: dict of any dates, numbers, or amounts
- category: 'factual', 'temporal', or 'contextual'

Message:
\"\"\"{content}\"\"\"
"""
            response = client.models.generate_content(
                model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            import json
            parsed = json.loads(response.text)
            if isinstance(parsed, list) and len(parsed) > 0:
                results = []
                for idx, c in enumerate(parsed):
                    results.append({
                        "position": idx + 1,
                        "original_text": c.get("original_text", ""),
                        "normalized_claim": c.get("normalized_claim", ""),
                        "entities": c.get("entities", []),
                        "dates_quantities": c.get("dates_quantities", {}),
                        "category": c.get("category", "factual")
                    })
                return results
        except Exception as e:
            # Fallback to local heuristic decomposer
            pass

    # Heuristic Decomposer:
    # 1. Clean and split into sentences / bullet points / lines
    raw_sentences = re.split(r"(?<=[.!?\n])\s+", content.strip())
    claims = []
    pos = 1

    for sentence in raw_sentences:
        cleaned = sentence.strip()
        if len(cleaned) < 15:
            continue
        
        # Skip pure forwarding instructions
        if is_rhetorical_instruction(cleaned):
            continue

        entities = extract_entities(cleaned)
        dates_and_quantities = extract_dates_and_quantities(cleaned)

        # Normalize claim
        # Remove noisy prefixes like "Breaking:", "URGENT:", "Beware:"
        normalized = re.sub(r"^(urgent|breaking|alert|warning|attention|notice)[:!\s-]+", "", cleaned, flags=re.IGNORECASE).strip()
        
        claims.append({
            "position": pos,
            "original_text": cleaned,
            "normalized_claim": normalized,
            "entities": entities,
            "dates_quantities": dates_and_quantities,
            "category": "temporal" if dates_and_quantities.get("dates") else "factual"
        })
        pos += 1

    # If no claims were extracted, use the main body as a single atomic claim
    if not claims:
        claims.append({
            "position": 1,
            "original_text": content[:300].strip(),
            "normalized_claim": content[:300].strip(),
            "entities": extract_entities(content),
            "dates_quantities": extract_dates_and_quantities(content),
            "category": "factual"
        })

    return claims
