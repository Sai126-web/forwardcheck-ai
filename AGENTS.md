# ForwardCheck AI — Developer & Agent Guidelines

## Tech Stack Overview
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, `@xyflow/react` for TruthGraph.
- **Backend**: Python FastAPI, Pydantic V2 schemas, SQLAlchemy ORM (SQLite zero-config local, PostgreSQL ready).
- **Extension**: Chrome Manifest V3 in `extension/`.

## Key Rules for AI Agents
1. **Never invent confidence percentages**: The 5 canonical verdicts are strictly `Verified`, `False`, `Outdated`, `Partially Supported`, `Cannot Confirm`.
2. **Absence of evidence is not false**: When no records corroborate or contradict a claim, always return `Cannot Confirm`.
3. **Bait Index is separate from veracity**: The Bait Index evaluates rhetoric (0–100) using 5 capped categories (20 pts max each). It is not a truth probability.
4. **Honest mode disclosure**: Distinguish `live`, `sample`, and `partial` execution modes.
5. **No surveillance**: Never implement passive background web scraping, WhatsApp chat interception, or contact scraping.
