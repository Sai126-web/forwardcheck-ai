# ForwardCheck AI — Security Specification

## 1. Threat Model & Defenses

### Server-Side Request Forgery (SSRF) Defense
When fetching public URLs provided by users:
- Prohibits internal IP ranges (`127.0.0.1`, `0.0.0.0`, `169.254.169.254`, `10.0.0.0/8`, `192.168.0.0/16`).
- Restricts protocols strictly to `http` and `https`.
- Enforces request timeouts and size limits (10s max, 4000 char excerpt limit).

### Prompt Injection Mitigation
- Claim extraction and verification pipelines use structured schema parsing (`Pydantic` and JSON response constraints).
- Input text is treated strictly as untrusted data wrapped in quote fences.
- Verifier models evaluate claims only against verified scraped passages, not instructions embedded within user submissions.

### Cross-Site Scripting (XSS) Defenses
- React automatically escapes rendered strings in both the DOM and TruthGraph node bodies.
- Content-Security-Policy headers in production disallow unauthorized third-party scripts.

### Secret Management
- API keys (`GEMINI_API_KEY`, `TAVILY_API_KEY`) are kept strictly on the backend and are never sent or exposed to the client bundle.
- `.env.example` contains placeholder tokens only.
