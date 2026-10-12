import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.database import engine, Base, SessionLocal
from app.seed.sample_data import seed_database
from app.api.investigations import router as investigations_router
from app.api.claims import router as claims_router
from app.api.evidence import router as evidence_router
from app.api.graph import router as graph_router
from app.api.bait import router as bait_router
from app.api.health import router as health_router

# Ensure tables are created immediately
Base.metadata.create_all(bind=engine)
# Seed sample investigations
_db = SessionLocal()
try:
    seed_database(_db)
finally:
    _db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure fresh seed on app startup
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="ForwardCheck AI Forensic API",
    description="Evidence-grounded verification, atomic claim decomposition, TruthGraph synthesis, and Bait Index rhetorical analysis.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,*")
origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(investigations_router, prefix="/api")
app.include_router(claims_router, prefix="/api")
app.include_router(evidence_router, prefix="/api")
app.include_router(graph_router, prefix="/api")
app.include_router(bait_router, prefix="/api")
app.include_router(health_router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "ForwardCheck AI API",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
