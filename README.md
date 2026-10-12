# ForwardCheck AI

> **Don’t just check the claim. Explore the truth behind it.**

ForwardCheck AI is an evidentiary forensic investigation platform designed to help people investigate suspicious forwarded messages, screenshots, circulars, voice notes, and online claims using inspectable evidence passages rather than an unexplained AI True/False assertion.

---

## Defining Experiences

1. **TruthGraph™**: An interactive topological investigation network connecting the original content, decomposed atomic claims, sources, evidence excerpts, stances, verdicts, contextual dates, and rhetorical techniques.
2. **Bait Index™**: An explainable, deterministic heuristic analysis measuring emotional manipulation, manufactured urgency, forwarding pressure, scarcity/fear tactics, and false authority appeals (0 to 100).
3. **Multimodal Forensic Ingestion**: Text, screenshots, photographs/posters, voice notes, PDF circulars, and public URLs.
4. **Strictly 5 Canonical Verdicts**:
   - `Verified`
   - `False`
   - `Outdated`
   - `Partially Supported`
   - `Cannot Confirm`
5. **Polite WhatsApp Rebuttal**: One-click link-backed factual correction formatted for group chats.

---

## Local Startup Instructions

### Prerequisites
- Node.js 18+ (tested on Node v22.20)
- Python 3.10+ (tested on Python 3.14)
- Git

### 1. Start the Backend API
```powershell
# From project root
cd backend
$env:PYTHONPATH="."
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at `http://127.0.0.1:8000`.
- Interactive OpenAPI docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 2. Start the Web Frontend
```powershell
# In a new terminal, from project root
cd frontend
npm install
npm run dev
```
The web application is now running at `http://localhost:3000`.

---

## Testing & Quality Assurance

### Run Backend Test Suite (Pytest)
```powershell
$env:PYTHONPATH="backend"
python -m pytest backend/tests -v
```
All 16 unit & integration tests verify:
- 5 categorical verdict mappings
- Absence of evidence returning `Cannot Confirm`
- Counterexamples for the Bait Index (urgent genuine alerts vs calm falsehoods)
- 0 to 20 point rubric caps and 100 total score ceiling
- Atomic claim decomposition and rhetorical forward filtering
- Health check and seeded demonstration records

---

## Chrome Manifest V3 Extension
The companion browser extension allows users to highlight any claim or news text and transfer it directly to ForwardCheck AI:
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top right.
3. Click **Load unpacked** and select the `extension/` directory.
4. Highlight any suspicious claim on the web, click the extension icon, and click **Open in Investigation Lab**.

---

## Operating Modes (Honesty Principle)
Every investigation clearly labels its operational mode:
- **Live Analysis**: Real search engines and primary repositories were queried and corroborated.
- **Sample Investigation**: Explicitly labeled pre-verified forensic datasets for interface demonstration.
- **Partial Analysis**: Local decomposition and Bait Index ran, but search queries had network limits.
