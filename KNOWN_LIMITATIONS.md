# ForwardCheck AI — Known Limitations & Future Enhancements

## 1. Known Limitations in Prototype

1. **Local Audio Transcription**:
   - Audio notes are parsed through the structured multimodal processor. For offline high-accuracy diarization and Whisper models, full local PyTorch and CUDA drivers are recommended in production.
2. **Reverse Image Search**:
   - In accordance with the prompt specification, ForwardCheck AI never claims to have performed reverse image search without a real image-matching provider. Reused image matching returns transparent disclosures when third-party visual indexers are unconfigured.
3. **External Commercial API Keys**:
   - Commercial LLM (Google Gemini) and Search (Tavily) API keys are optional. When keys are omitted, the system falls back to live DuckDuckGo querying and local heuristic claim decomposition, transparently labeled as `partial` or `zero_secret_operational`.

---

## 2. Production Roadmap
- Multi-user authentication via OAuth 2.0 / NextAuth with organizational workspaces.
- Celery / Redis durable background job queue for multi-worker scaling.
- S3 / Google Cloud Storage bucket integration for media uploads with auto-expiring lifecycles.
