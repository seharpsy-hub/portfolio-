from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth import require_admin
from app.config import get_settings

router = APIRouter(prefix="/admin", tags=["admin"])


class CacheClearOut(BaseModel):
    ok: bool
    cleared_at: str
    redis: str
    message: str


@router.post("/cache/clear", response_model=CacheClearOut)
def clear_cache(_: dict = Depends(require_admin)):
    """Flush Redis (if reachable) and return a cache-bust timestamp for clients."""
    redis_status = "skipped"
    settings = get_settings()
    try:
        import redis

        client = redis.from_url(settings.redis_url, socket_connect_timeout=1)
        client.ping()
        client.flushdb()
        redis_status = "flushed"
    except Exception:
        redis_status = "unavailable"

    cleared_at = datetime.now(timezone.utc).isoformat()
    return CacheClearOut(
        ok=True,
        cleared_at=cleared_at,
        redis=redis_status,
        message="Cache cleared. Refresh the live site to see latest content.",
    )
