# ForwardCheck AI — Architectural Decision Records (ADR)

## ADR-001: Unified Next.js 14 App Router + Python FastAPI Architecture
- **Context**: The product requires an ultra-responsive, accessible, and high-polish investigative canvas (TruthGraph using `@xyflow/react`) alongside a robust Python-based scientific pipeline (deterministic regex span-matching, document parsing, Pydantic schemas, and AI/RAG integrations).
- **Decision**: Frontend is built with Next.js (App Router, Tailwind CSS, TypeScript, Lucide Icons, xyflow) running on port 3000. Backend is built with Python FastAPI running on port 8000. Next.js proxies or talks directly to FastAPI at `http://localhost:8000/api`.
- **Consequences**: Enables clean separation of concerns, native typing on both sides, independent testability with Pytest and Vitest/Playwright, and simple deployment into microservices or Docker containers.

## ADR-002: Deterministic Bait Index vs. Hallucinatory Scoring
- **Context**: Users and researchers often conflate emotional tone with factual accuracy. AI models frequently invent unjustified percentage scores (e.g., "78.4% true").
- **Decision**: The Bait Index is implemented as a deterministic scoring algorithm (0 to 100) based on 5 rigorous categories (Artificial Urgency, Authority Appeals, Forwarding Pressure, Emotional Pressure, Scarcity/Fear) with identifiable character spans and regular expressions. It is explicitly labeled as a rhetorical manipulation indicator, never a factual truth percentage.
- **Consequences**: Highly explainable, zero-hallucination, fast execution, and fully testable with counter-examples (e.g. an official genuine emergency alert will score high on urgency but be factual; a polite pseudoscientific forward will score low on urgency but be false).

## ADR-003: Strictly Categorical Verdict Schema
- **Context**: In fact-checking, nuances like outdated deadlines or partial truths are lost in binary True/False ratings.
- **Decision**: Enforce exactly five canonical verdicts: `Verified`, `False`, `Outdated`, `Partially Supported`, `Cannot Confirm`. No ungrounded continuous confidence values are displayed.
- **Consequences**: Forces evidence-grounded attribution. In the absence of corroboration, the system defaults to `Cannot Confirm` rather than guessing.

## ADR-004: Manifest V3 Chrome Extension Design
- **Context**: Users encounter claims on social media and news sites and need quick verification without leaving context.
- **Decision**: A lightweight Manifest V3 extension captures selected text or current tab URL and passes it via safe URL parameters / postMessage handoff to the web application's `/investigations/new` workspace, prompting the user for confirmation before analysis.
- **Consequences**: Complies with strict privacy standards; does not perform passive background surveillance or inject heavy intrusive DOM scripts.

## ADR-005: Honest Operational Mode Indicator
- **Context**: API keys for external search or commercial LLMs might not be supplied in local development environments.
- **Decision**: Every investigation response carries an `execution_mode`: `live`, `sample`, or `partial`. The UI renders clear banners distinguishing live verified intelligence from sample demonstrations and partial analyses.
- **Consequences**: Adheres strictly to the honesty principle, preventing deception of evaluators and users.
