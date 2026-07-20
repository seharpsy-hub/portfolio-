from pathlib import Path
from uuid import UUID, uuid4

import aiofiles
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth import require_admin
from app.database import get_db
from app.models import Media, Site
from app.schemas import MediaOut

router = APIRouter(prefix="/media", tags=["media-upload"])

ALLOWED_IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ALLOWED_IMAGE_MIME = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB


def _media_dir() -> Path:
    # Project root /media (sibling of backend/)
    root = Path(__file__).resolve().parents[3] / "media"
    root.mkdir(parents=True, exist_ok=True)
    (root / "uploads").mkdir(parents=True, exist_ok=True)
    return root


@router.post("/upload", response_model=MediaOut, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    site_id: UUID | None = Form(None),
    alt_text: str | None = Form(None),
    folder: str = Form("uploads"),
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    if site_id and not db.get(Site, site_id):
        raise HTTPException(404, "Site not found")

    original = file.filename or "upload.jpg"
    ext = Path(original).suffix.lower()
    mime = (file.content_type or "").lower()

    if ext not in ALLOWED_IMAGE_EXT and mime not in ALLOWED_IMAGE_MIME:
        raise HTTPException(
            400,
            "Only image uploads allowed: JPG, PNG, WebP, GIF, SVG",
        )
    if not ext and mime in ALLOWED_IMAGE_MIME:
        ext = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "image/svg+xml": ".svg",
        }.get(mime, ".jpg")
    if ext not in ALLOWED_IMAGE_EXT:
        ext = ".jpg"

    media_root = _media_dir()
    safe_folder = "".join(ch for ch in folder if ch.isalnum() or ch in "-_") or "uploads"
    folder_path = media_root / safe_folder
    folder_path.mkdir(parents=True, exist_ok=True)

    stored_name = f"{uuid4().hex}{ext}"
    dest = folder_path / stored_name

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(400, "Image too large (max 8 MB)")
    if not content:
        raise HTTPException(400, "Empty file")

    async with aiofiles.open(dest, "wb") as out:
        await out.write(content)

    url = f"/media/{safe_folder}/{stored_name}"
    row = Media(
        site_id=site_id,
        filename=stored_name,
        original_name=original,
        url=url,
        mime_type=mime or "image/jpeg",
        size_bytes=len(content),
        alt_text=alt_text,
        folder=safe_folder,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
