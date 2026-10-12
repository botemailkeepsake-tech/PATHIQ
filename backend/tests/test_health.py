import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.config import get_settings


@pytest.mark.asyncio
async def test_health_endpoint_redis_disabled():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data
        assert "redis" in data
        assert "environment" in data
        assert data["redis"] == "disabled"
        assert data["status"] in ("ok", "degraded")


@pytest.mark.asyncio
async def test_health_endpoint_redis_configured(monkeypatch):
    import redis.asyncio as redis
    from unittest.mock import AsyncMock, MagicMock

    mock_redis = AsyncMock()
    mock_redis.ping = AsyncMock(return_value=True)
    mock_redis.aclose = AsyncMock()
    monkeypatch.setattr(redis, "from_url", lambda url: mock_redis)

    settings = get_settings()
    original_redis_url = settings.redis_url
    settings.redis_url = "redis://localhost:6379/0"

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/health")
            assert response.status_code == 200
            data = response.json()
            assert data["redis"] == "ok"
    finally:
        settings.redis_url = original_redis_url


@pytest.mark.asyncio
async def test_health_endpoint_redis_failure(monkeypatch):
    import redis.asyncio as redis
    from unittest.mock import AsyncMock

    mock_redis = AsyncMock()
    mock_redis.ping = AsyncMock(side_effect=ConnectionError("Connection refused"))
    mock_redis.aclose = AsyncMock()
    monkeypatch.setattr(redis, "from_url", lambda url: mock_redis)

    settings = get_settings()
    original_redis_url = settings.redis_url
    settings.redis_url = "redis://localhost:6379/0"

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/health")
            assert response.status_code == 200
            data = response.json()
            assert data["redis"] == "failed"
            assert data["status"] == "degraded"
    finally:
        settings.redis_url = original_redis_url


@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "SaarthiAI API"
