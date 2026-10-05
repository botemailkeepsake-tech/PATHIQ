from datetime import date, datetime, timedelta
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.db import get_db_context
from app.models import Consent, Session
from app.models.session import ConsentKindEnum, ConsentMethodEnum, ConsenterRoleEnum, SessionStatusEnum
from app.schemas.knowledge import RetrievalQuery, KnowledgeTopicEnum


class SessionService:
    """Service for managing family sessions."""

    def __init__(self, db):
        self.db = db
        self.settings = get_settings()

    async def create_session(
        self,
        language: str,
        pilot_region: str,
        trade_of_interest: Optional[str] = None,
        district_code: Optional[str] = None,
    ):
        """Create a new family session."""
        # Calculate retention_until date
        retention_days = self.settings.session_retention_days
        retention_until = date.today() + timedelta(days=retention_days)

        session = Session(
            language=language,
            pilot_region=pilot_region,
            trade_of_interest=trade_of_interest,
            status=SessionStatusEnum.active,
            retention_until=retention_until,
        )
        self.db.add(session)
        await self.db.flush()
        return session

    async def get_session(self, session_id: str):
        """Get a session by ID."""
        from app.models import Session
        from uuid import UUID
        stmt = select(Session).where(Session.id == UUID(session_id))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def update_session_status(self, session_id: str, status: str):
        """Update session status."""
        from app.models import Session
        from uuid import UUID
        stmt = select(Session).where(Session.id == UUID(session_id))
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()
        if session:
            session.status = status
            await self.db.flush()
        return session

    async def record_consent(
        self,
        session_id: str,
        kind: str,
        consenter_role: str,
        method: str,
        language_shown: str,
        version_of_text: str,
        granted: bool = True,
    ):
        """Record consent for a session."""
        from app.models import Consent, Session
        from app.models.session import ConsentKindEnum, ConsentMethodEnum, ConsenterRoleEnum
        from uuid import UUID

        stmt = select(Session).where(Session.id == UUID(session_id))
        result = await self.db.execute(stmt)
        session = result.scalar_one_or_none()
        if not session:
            return None

        consent = Consent(
            session_id=UUID(session_id),
            kind=ConsentKindEnum(kind),
            granted=True,
            consenter_role=ConsenterRoleEnum(consenter_role),
            method=method,
            language_shown=language_shown,
            version_of_text=version_of_text,
        )
        self.db.add(consent)
        await self.db.flush()
        return consent

    async def get_consent_status(self, session_id: str, kind: str):
        """Check if consent of a given kind is granted for a session."""
        from app.models import Consent
        from uuid import UUID
        stmt = select(Consent).where(
            Consent.session_id == UUID(session_id),
            Consent.kind == kind,
        )
        result = await self.db.execute(stmt)
        consent = result.scalar_one_or_none()
        return consent.granted if consent else None


class MessageService:
    """Service for handling session messages."""

    def __init__(self, db):
        self.db = db

    async def add_message(
        self,
        session_id: str,
        speaker_role: str,
        text: str,
        language: str,
    ):
        """Add a message to a session."""
        from app.models import Message
        from app.models.session import SpeakerRoleEnum
        from uuid import UUID

        message = Message(
            session_id=UUID(session_id),
            speaker_role=speaker_role,
            text=text,
            language=language,
        )
        self.db.add(message)
        await self.db.flush()
        return message

    async def get_messages(self, session_id: str, limit: int = 50, offset: int = 0):
        """Get messages for a session."""
        from app.models import Message
        from uuid import UUID

        stmt = (
            select(Message)
            .where(Message.session_id == UUID(session_id))
            .order_by(Message.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_message(self, message_id: str):
        """Get a specific message."""
        from app.models import Message
        from uuid import UUID

        stmt = select(Message).where(Message.id == UUID(message_id))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def flag_distress(self, message_id: str):
        """Flag a message as containing distress signals."""
        from app.models import Message
        from app.models.session import SafetyFlagEnum
        from uuid import UUID

        stmt = select(Message).where(Message.id == UUID(message_id))
        result = await self.db.execute(stmt)
        message = result.scalar_one_or_none()
        if message:
            message.safety_flag = SafetyFlagEnum.distress
            await self.db.flush()
            return True
        return False