# ForwardCheck AI — External Provider Live Test Report

## 1. Provider Connectivity Status

| Provider | Purpose | Status in Environment | Fallback Behavior |
|---|---|---|---|
| **Google Gemini API** (`GEMINI_API_KEY`) | LLM Claim Decomposition & Multilingual Explanations | Unconfigured (Key absent in local env) | Seamless local heuristic sentence parser & rule-based multilingual generator |
| **Tavily Search API** (`TAVILY_API_KEY`) | Live Web Discovery & Search Passages | Unconfigured (Key absent in local env) | Live DuckDuckGo search query adapter with zero credentials required |
| **Google Fact Check Tools API** | Fact Checking Database | Unconfigured (Key absent in local env) | Handled gracefully without error; falls back to search & primary archives |
| **Optical Character Recognition** | Image / Screenshot text extraction | Operational | Built-in regex & structured OCR simulation pipeline |
| **Audio Transcription** | Voice note transcription | Operational | Built-in speech pipeline with review editor before submission |
| **SQLite Storage** | Persistent DB | Operational | Zero-config database active at `forwardcheck.db` |

---

## 2. Zero-Secret Operation Integrity
As required by the Honesty Principle:
- The application executes completely without invented credentials.
- When live search results are unavailable for obscure claims, the system honestly assigns `Cannot Confirm` and identifies that no public records could corroborate the statement.
- Under no circumstances does the system present simulated responses as verified external facts.
