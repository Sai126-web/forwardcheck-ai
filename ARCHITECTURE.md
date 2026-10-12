# ForwardCheck AI — Architecture Specification

## 1. System Overview

ForwardCheck AI is an evidence-grounded investigative intelligence platform designed to help users decompose, verify, and trace forwarded claims, images, notices, and audio notes. Instead of offering an opaque single-number "truth probability" or an unexplained chatbot assertion, ForwardCheck AI emphasizes explainability, citation integrity, and rhetorical analysis.

The system is centered around two anchor paradigms:
1. **TruthGraph**: An interactive topological representation linking an ingested artifact to discrete atomic claims, verified primary and secondary sources, specific quoted evidence passages, categorical verdicts, contextual dates/locations, and rhetorical markers.
2. **Bait Index**: A deterministic, rule-and-span-based heuristic analysis measuring emotional manipulation, manufactured urgency, forwarding pressure, scarcity/fear tactics, and appeals to false authority.

---

## 2. Component Topology

```
+-----------------------------------------------------------------------------------+
|                                  USER CLIENTS                                     |
|  +---------------------------------------+  +----------------------------------+  |
|  | Modern Web Client (Next.js 14 App R.) |  | Chrome Manifest V3 Extension     |  |
|  | - TruthGraph Canvas (@xyflow/react)   |  | - Text / URL selection capture   |  |
|  | - Multimodal Submission Suite         |  | - Seamless Web App handoff       |  |
|  | - Responsive Card/List Fallbacks      |  +----------------------------------+  |
|  +---------------------------------------+                                        |
+------------------------------------------+----------------------------------------+
                                           | HTTP / SSE
                                           v
+-----------------------------------------------------------------------------------+
|                           BACKEND API (Python FastAPI)                            |
|  +-----------------------------------------------------------------------------+  |
|  | Endpoints: /api/investigations, /api/extract, /api/verify, /api/graph, ...  |  |
|  +-----------------------------------------------------------------------------+  |
|  | Core Pipeline Engines:                                                      |  |
|  |  1. Ingestion & Multimodal Extraction (Text, OCR, PDF, Audio, Public URL)   |  |
|  |  2. Atomic Claim Decomposer (Pydantic schema validation)                    |  |
|  |  3. Evidence Discovery & Scraper (DuckDuckGo/Tavily/Google Fact Check API)  |  |
|  |  4. Stance Classifier & Evidence-Grounded Verifier                          |  |
|  |  5. Deterministic Bait Index Engine (Exact span matches, 0-100 rubric)      |  |
|  |  6. Multilingual Report & WhatsApp Rebuttal Generator (EN, HI, MR)         |  |
|  |  7. TruthGraph Serializer (ELK-ready nodes & typed edges)                   |  |
|  +-----------------------------------------------------------------------------+  |
|  | Storage Layer:                                                              |  |
|  |  - SQLite (Local zero-config development) / PostgreSQL (Production)         |  |
|  |  - SQLAlchemy ORM with typed relationships                                  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Investigation Pipeline Lifecycle

1. **Ingestion & Normalization**: Content is received as pasted text, uploaded image/poster, audio file, PDF document, or public URL. Text is extracted, cleaned, and presented to the user for human-in-the-loop validation and correction before heavy verification is initiated.
2. **Atomic Claim Decomposition**: Complex, paragraph-length forwards are decomposed into discrete, testable atomic factual statements. Opinions, rhetorical instructions ("Forward this to 10 friends"), and uncheckable hyperbole are separated from testable factual propositions.
3. **Evidence Discovery**: For each atomic claim, targeted queries are constructed. Primary repositories, fact-checking databases, and verified web records are queried. Snippets and passages are scraped, deduplicated, and attributed with canonical URLs and timestamps.
4. **Stance Analysis & Grounded Verification**: Evidence passages are evaluated against each claim to assign stances: `supports`, `contradicts`, `qualifies`, `contextualizes`, or `insufficient`.
5. **Verdict Assignment**: Strictly constrained to the 5 standardized verdicts:
   - `Verified`: Backed by high-confidence, corroborated evidence.
   - `False`: Directly contradicted by reputable primary or authoritative sources.
   - `Outdated`: Previously true or applicable under past parameters, but invalid or expired now.
   - `Partially Supported`: Contains an element of fact mixed with distorted context, omissions, or unverified claims.
   - `Cannot Confirm`: Insufficient, ambiguous, or unverifiable public evidence. Never fabricates a confidence score.
6. **Bait Index Calculation**: Evaluates 5 rhetorical categories (0-20 points each, 100 max):
   - Artificial Urgency
   - Authority Appeals
   - Forwarding Pressure
   - Emotional Pressure
   - Scarcity / Fear
7. **Graph Synthesis**: Synthesizes nodes and directional edges connecting raw artifact to claims, evidence, verdicts, bait techniques, and context.
8. **Explanation & Export**: Generates plain-language verdicts, multilingual explanations in English, Hindi, and Marathi, and a respectful, WhatsApp-friendly factual rebuttal.

---

## 4. Mode Separation (Honesty Principle)

The system transparently displays its operating mode:
- **`live`**: Configured external search/LLM providers were successfully queried and verified.
- **`sample`**: Explicitly labeled sample investigation records seeded for testing and UI demonstration.
- **`partial`**: Input was decomposed and local heuristic engines (such as the Bait Index) ran, but external search or AI services were unavailable or encountered network errors.
