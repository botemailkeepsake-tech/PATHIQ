import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import check_db_connection, get_db


@pytest.mark.asyncio
async def test_db_session_factory():
    async for session in get_db():
        assert isinstance(session, AsyncSession)
        break


@pytest.mark.asyncio
async def test_db_connection_check():
    result = await check_db_connection()
    assert isinstance(result, bool)
