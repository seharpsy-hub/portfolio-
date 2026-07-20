from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.routers import router as api_router
from app.routers.media_upload import router as media_upload_router
from app.routers.cache import router as cache_router

settings = get_settings()

app = FastAPI(
    title="Universal Portfolio CMS API",
    version="0.1.0",
    description="Phase 1 MVP",
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

media_path = Path(__file__).resolve().parent.parent.parent / "media"
media_path.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(media_path)), name="media")

app.include_router(api_router, prefix="/api")
app.include_router(media_upload_router, prefix="/api")
app.include_router(cache_router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "Universal Portfolio CMS API is running", "version": "0.1.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
