# ForwardCheck AI — Production Deployment Guide

## 1. Architecture Summary
- **Frontend Container**: Next.js 14 production standalone server (`port 3000`)
- **Backend Container**: Python 3.11/3.14 FastAPI server with Uvicorn (`port 8000`)
- **Storage**: SQLite for local single-node development; PostgreSQL connection via `DATABASE_URL` in production.
- **Reverse Proxy**: Nginx or Next.js internal rewrites proxying `/api/*` to the FastAPI backend.

---

## 2. Docker Compose Deployment
To run the full stack via Docker Compose:
```bash
docker compose build
docker compose up -d
```
Verify containers:
```bash
docker compose ps
curl http://localhost:8000/api/health
curl http://localhost:3000/
```

---

## 3. Production Environment Variables
Set the following in production environments or container secret stores:
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://forwardcheck.yourdomain.org
NEXT_PUBLIC_API_URL=https://forwardcheck.yourdomain.org/api

# Database
DATABASE_URL=postgresql://user:secure_password@postgres-db:5432/forwardcheck

# AI & Search Providers
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
TAVILY_API_KEY=your-tavily-api-key
GOOGLE_FACTCHECK_API_KEY=your-google-factcheck-key

# Security
ALLOWED_ORIGINS=https://forwardcheck.yourdomain.org
SECRET_KEY=generate-at-least-32-random-hex-characters
```

---

## 4. Production Hardening Checklist
- [x] Configure SSL/TLS certificates via Let's Encrypt / Cloudflare.
- [x] Set explicit Content-Security-Policy (CSP) and Strict-Transport-Security headers.
- [x] Enable persistent volume mounts for database and artifact caching.
- [x] Restrict database access to private internal VPC network.
- [x] Monitor background job completion metrics and API error rates.
