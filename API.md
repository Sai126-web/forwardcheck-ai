# ForwardCheck AI — API Specification

The API is served at `http://localhost:8000/api` with interactive Swagger OpenAPI documentation available at `/docs`.

## 1. Investigations

### `POST /api/investigations/extract`
Step 1 Ingestion & Extraction preview.
- **Request Body**:
  ```json
  {
    "content": "Alert! WHO announced all plastic rice will be seized today...",
    "input_type": "text",
    "url": null,
    "metadata": {}
  }
  ```
- **Response**:
  ```json
  {
    "input_type": "text",
    "raw_text": "...",
    "normalized_text": "...",
    "confidence": 1.0,
    "detected_claims": [
      {
        "position": 1,
        "original_text": "...",
        "normalized_claim": "..."
      }
    ],
    "metadata": {},
    "warnings": []
  }
  ```

### `POST /api/investigations/upload-multimodal`
Upload binary files for OCR, speech transcription, or PDF text extraction.
- **Form Data**: `file` (multipart), `input_type` ("screenshot", "photograph", "audio", "pdf")
- **Response**: `ExtractionResponse`

### `POST /api/investigations`
Creates an investigation, registers the background pipeline job, and begins verification.
- **Request Body**:
  ```json
  {
    "title": "WHO Plastic Rice Ban",
    "original_content": "...",
    "input_type": "text",
    "language": "en",
    "reviewed_claims": [...]
  }
  ```
- **Response**: Full `InvestigationDetailResponse` with initial status `"processing"`

### `GET /api/investigations`
List stored investigations with optional filters.
- **Query Parameters**:
  - `q`: search keyword
  - `verdict`: filter by overall verdict (`Verified`, `False`, `Outdated`, `Partially Supported`, `Cannot Confirm`)
  - `mode`: filter by mode (`live`, `sample`, `partial`)
  - `guest_session_id`: scope by session

### `GET /api/investigations/{id}`
Returns complete investigation detail including claims, evidence, bait tags, report, and job status.

### `PATCH /api/investigations/{id}`
Rename investigation title.

### `DELETE /api/investigations/{id}`
Permanently delete an investigation and all cascade records.

### `GET /api/investigations/{id}/job`
Returns genuine job pipeline stage, progress percentage (0–100), current task, and events stream.

### `POST /api/investigations/{id}/retry`
Retries an interrupted or failed investigation.

### `POST /api/investigations/{id}/share`
Generates an unguessable opt-in share link token.

---

## 2. TruthGraph

### `GET /api/investigations/{id}/graph`
Returns nodes and edges formatted for `@xyflow/react` and ELK.js layout engines.
- **Node Types**: `original_forward`, `atomic_claim`, `source`, `evidence`, `verdict`, `bait_analysis`, `context`
- **Edge Types**: `contains_claim`, `supported_by`, `contradicted_by`, `qualified_by`, `extracted_from`, `associated_with_date`, `contains_bait_technique`, `image_appeared_in_source`, `has_unresolved_gap`

### `POST /api/investigations/{id}/graph/positions`
Persists user customized node coordinates.

---

## 3. Evidence Library

### `GET /api/evidence`
Search and filter across retrieved evidence excerpts, sources, and publishers.
- **Query Parameters**: `q`, `stance`, `tier`, `investigation_id`

---

## 4. Bait Index

### `POST /api/bait/analyze`
Standalone instant Bait Index analysis.
- **Request Body**: `{"text": "..."}`
- **Response**: `total_score` (0-100), `risk_level`, `categories` (5 categories with 0-20 score each), `tags` with exact character spans.

---

## 5. System Health

### `GET /api/health`
Returns provider readiness (Gemini, Tavily, DuckDuckGo fallback), execution mode, and database dialect.
