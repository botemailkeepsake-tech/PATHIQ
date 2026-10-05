import enum
import uuid
from datetime import date, datetime
from typing import Optional, List

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base


class SessionStatusEnum(str, enum.Enum):
    active = "active"
    summarised = "summarised"
    handed_off = "handed_off"
    closed = "closed"


class ConsentKindEnum(str, enum.Enum):
    session = "session"
    counsellor_handoff = "counsellor_handoff"
    anonymised_research = "anonymised_research"


class ConsenterRoleEnum(str, enum.Enum):
    parent = "parent"
    guardian = "guardian"


class ConsentMethodEnum(str, enum.Enum):
    typed_confirmation = "typed_confirmation"
    otp = "otp"
    counsellor_witnessed = "counsellor_witnessed"


class SpeakerRoleEnum(str, enum.Enum):
    student = "student"
    parent = "parent"
    system = "system"


class SafetyFlagEnum(str, enum.Enum):
    none = "none"
    distress = "distress"


class ConcernLabelEnum(str, enum.Enum):
    job_security = "job_security"
    income = "income"
    social_perception = "social_perception"
    safety = "safety"
    degree_foreclosure = "degree_foreclosure"


class ConcernStatusEnum(str, enum.Enum):
    open = "open"
    partly_resolved = "partly_resolved"
    resolved = "resolved"


class HandoffReasonEnum(str, enum.Enum):
    outside_knowledge = "outside_knowledge"
    repeated_confusion = "repeated_confusion"
    distress = "distress"
    unresolved_disagreement = "unresolved_disagreement"
    requested = "requested"
    evidence_conflict = "evidence_conflict"
    case_specific = "case_specific"


class HandoffStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    completed = "completed"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    language: Mapped[str] = mapped_column(Text, nullable=False)
    pilot_region: Mapped[str] = mapped_column(Text, nullable=False)
    trade_of_interest: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[SessionStatusEnum] = mapped_column(Enum(SessionStatusEnum, native_enum=False), nullable=False, default=SessionStatusEnum.active)
    retention_until: Mapped[date] = mapped_column(Date, nullable=False)

    consents = relationship("Consent", back_populates="session")
    messages = relationship("Message", back_populates="session")
    concerns = relationship("Concern", back_populates="session")
    preferences = relationship("Preference", back_populates="session")
    evidence_shown = relationship("EvidenceShown", back_populates="session")
    summaries = relationship("Summary", back_populates="session")
    handoffs = relationship("Handoff", back_populates="session")


class Consent(Base):
    __tablename__ = "consents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    kind: Mapped[ConsentKindEnum] = mapped_column(Enum(ConsentKindEnum, native_enum=False), nullable=False)
    granted: Mapped[bool] = mapped_column(nullable=False, default=False)
    consenter_role: Mapped[ConsenterRoleEnum] = mapped_column(Enum(ConsenterRoleEnum, native_enum=False), nullable=False)
    method: Mapped[ConsentMethodEnum] = mapped_column(Enum(ConsentMethodEnum, native_enum=False), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    language_shown: Mapped[str] = mapped_column(Text, nullable=False)
    version_of_text: Mapped[str] = mapped_column(Text, nullable=False)

    session = relationship("Session", back_populates="consents")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    speaker_role: Mapped[SpeakerRoleEnum] = mapped_column(Enum(SpeakerRoleEnum, native_enum=False), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    safety_flag: Mapped[SafetyFlagEnum] = mapped_column(Enum(SafetyFlagEnum, native_enum=False), nullable=False, default=SafetyFlagEnum.none)

    session = relationship("Session", back_populates="messages")
    concerns = relationship("Concern", back_populates="message")

    __table_args__ = (
        Index("ix_messages_session_created", "session_id", "created_at"),
    )


class Concern(Base):
    __tablename__ = "concerns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    message_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    label: Mapped[ConcernLabelEnum] = mapped_column(Enum(ConcernLabelEnum, native_enum=False), nullable=False)
    confidence: Mapped[float] = mapped_column(nullable=False)
    confirmed: Mapped[Optional[bool]] = mapped_column(nullable=True)
    status: Mapped[ConcernStatusEnum] = mapped_column(Enum(ConcernStatusEnum, native_enum=False), nullable=False, default=ConcernStatusEnum.open)
    resolved_by_evidence_ids: Mapped[List[uuid.UUID]] = mapped_column(ARRAY(UUID(as_uuid=True)), nullable=False, default=[])
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    session = relationship("Session", back_populates="concerns")
    message = relationship("Message", back_populates="concerns")
    corrections = relationship("ConcernCorrection", back_populates="concern")

    __table_args__ = (
        Index("ix_concerns_session_status", "session_id", "status"),
    )


class ConcernCorrection(Base):
    __tablename__ = "concern_corrections"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    concern_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("concerns.id", ondelete="CASCADE"), nullable=False)
    original_label: Mapped[ConcernLabelEnum] = mapped_column(Enum(ConcernLabelEnum, native_enum=False), nullable=False)
    corrected_label: Mapped[ConcernLabelEnum] = mapped_column(Enum(ConcernLabelEnum, native_enum=False), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    concern = relationship("Concern", back_populates="corrections")


class Preference(Base):
    __tablename__ = "preferences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[SpeakerRoleEnum] = mapped_column(Enum(SpeakerRoleEnum, native_enum=False), nullable=False)
    preferred_pathway: Mapped[str] = mapped_column(Text, nullable=False)
    priorities: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False, default=[])
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="preferences")


class EvidenceShown(Base):
    __tablename__ = "evidence_shown"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    record_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("knowledge_records.id", ondelete="RESTRICT"), nullable=False)
    shown_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    geography_level_shown: Mapped[str] = mapped_column(Text, nullable=False)
    helpful_feedback: Mapped[Optional[bool]] = mapped_column(nullable=True)

    session = relationship("Session", back_populates="evidence_shown")


class Summary(Base):
    __tablename__ = "summaries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    readiness: Mapped[dict] = mapped_column(JSONB, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="summaries")


class Counsellor(Base):
    __tablename__ = "counsellors"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    display_name: Mapped[str] = mapped_column(Text, nullable=False)
    languages: Mapped[List[str]] = mapped_column(ARRAY(Text), nullable=False, default=[])
    region: Mapped[str] = mapped_column(Text, nullable=False)
    active: Mapped[bool] = mapped_column(default=True, nullable=False)

    handoffs = relationship("Handoff", back_populates="counsellor")


class Handoff(Base):
    __tablename__ = "handoffs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    counsellor_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("counsellors.id", ondelete="SET NULL"), nullable=True)
    reason: Mapped[HandoffReasonEnum] = mapped_column(Enum(HandoffReasonEnum, native_enum=False), nullable=False)
    package: Mapped[dict] = mapped_column(JSONB, nullable=False)
    status: Mapped[HandoffStatusEnum] = mapped_column(Enum(HandoffStatusEnum, native_enum=False), nullable=False, default=HandoffStatusEnum.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    consent_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("consents.id", ondelete="SET NULL"), nullable=True)

    session = relationship("Session", back_populates="handoffs")
    counsellor = relationship("Counsellor", back_populates="handoffs")


class AuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    actor_role: Mapped[str] = mapped_column(Text, nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    entity: Mapped[str] = mapped_column(Text, nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())