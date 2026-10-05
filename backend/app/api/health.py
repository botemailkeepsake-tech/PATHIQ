import redis.asyncio as redis
from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import get_settings
from app.core.db import get_db
from app.core.logging import get_privacy_logger

router = APIRouter(prefix="/api/v1", tags=["health"])
logger = get_privacy_logger(__name__)
settings = get_settings()


@router.get("/health")
async def health_check():
    db_status = "ok"
    redis_status = "ok"

    async for db in get_db():
        try:
            await db.execute(text("SELECT 1"))
        except Exception as e:
            logger.error("health_check_db_failed", error=str(e))
            db_status = "failed"

    try:
        redis_client = redis.from_url(settings.redis_url)
        await redis_client.ping()
        await redis_client.aclose()
    except Exception as e:
        logger.error("health_check_redis_failed", error=str(e))
        redis_status = "failed"

    overall_status = "ok" if db_status == "ok" and redis_status == "ok" else "degraded"

    return {
        "status": overall_status,
        "database": db_status,
        "redis": redis_status,
        "environment": settings.app_env,
    }
