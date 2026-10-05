import enum
import uuid
from datetime import date, datetime
from typing import Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base


class SourceTypeEnum(str, enum.Enum):
    official_notification = "official_notification"
    government_report = "government_report"
    survey = "survey"
    institutional = "institutional"
    other = "other"


class KnowledgeTopicEnum(str, enum.Enum):
    job_security = "job_security"
    income = "income"
    social_perception = "social_perception"
    safety = "safety"
    degree_foreclosure = "degree_foreclosure"
    progression = "progression"
    scheme = "scheme"
    provider = "provider"
    trade_profile = "trade_profile"
    local_opportunity = "local_opportunity"


class GeographyLevelEnum(str, enum.Enum):
    district = "district"
    state = "state"
    national = "national"


class RecordStatusEnum(str, enum.Enum):
    verified = "verified"
    needs_review = "needs_review"
    expired = "expired"
    conflicting = "conflicting"
    withdrawn = "withdrawn"


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    authority: Mapped[str] = mapped_column(Text, nullable=False)
    source_type: Mapped[SourceTypeEnum] = mapped_column(Enum(SourceTypeEnum, native_enum=False), nullable=False)
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    document_ref: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    published_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    retrieved_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    records = relationship("KnowledgeRecord", back_populates="source")


class KnowledgeRecord(Base):
    __tablename__ = "knowledge_records"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic: Mapped[KnowledgeTopicEnum] = mapped_column(Enum(KnowledgeTopicEnum, native_enum=False), nullable=False)
    trade: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    claim: Mapped[str] = mapped_column(Text, nullable=False)
    value: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sources.id", ondelete="RESTRICT"), nullable=False)
    geography_level: Mapped[GeographyLevelEnum] = mapped_column(Enum(GeographyLevelEnum, native_enum=False), nullable=False)
    geography_code: Mapped[str] = mapped_column(Text, nullable=False)
    applicability: Mapped[str] = mapped_column(Text, nullable=False)
    language_variants: Mapped[dict] = mapped_column(JSONB, nullable=False, default={})
    published_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    verified_date: Mapped[date] = mapped_column(Date, nullable=False)
    review_due: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[RecordStatusEnum] = mapped_column(Enum(RecordStatusEnum, native_enum=False), nullable=False, default=RecordStatusEnum.needs_review)
    is_demo: Mapped[bool] = mapped_column(default=False, nullable=False)
    embedding: Mapped[Optional[list[float]]] = mapped_column(Vector(1536), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    source = relationship("Source", back_populates="records")
    progression_edges = relationship("ProgressionEdge", back_populates="record")

    __table_args__ = (
        Index("ix_knowledge_records_topic_trade_geo_status", "topic", "trade", "geography_level", "geography_code", "status"),
        CheckConstraint("verified_date <= review_due", name="ck_verified_before_review_due"),
        CheckConstraint("status IN ('verified', 'needs_review', 'expired', 'conflicting', 'withdrawn')", name="ck_valid_status"),
    )


class ProgressionEdge(Base):
    __tablename__ = "progression_edges"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    from_node: Mapped[str] = mapped_column(Text, nullable=False)
    to_node: Mapped[str] = mapped_column(Text, nullable=False)
    record_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("knowledge_records.id", ondelete="RESTRICT"), nullable=False)
    eligibility: Mapped[str] = mapped_column(Text, nullable=False)
    conditions: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    record = relationship("KnowledgeRecord", back_populates="progression_edges")

    __table_args__ = (
        UniqueConstraint("from_node", "to_node", "record_id", name="uq_progression_edge"),
        Index("ix_progression_edges_from_node", "from_node"),
        Index("ix_progression_edges_to_node", "to_node"),
    )