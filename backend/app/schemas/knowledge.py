import enum
from datetime import date
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


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


class SourceBase(BaseModel):
    title: str = Field(..., min_length=1)
    authority: str = Field(..., min_length=1)
    source_type: SourceTypeEnum
    url: Optional[str] = None
    document_ref: Optional[str] = None
    published_date: Optional[date] = None
    retrieved_date: date


class SourceCreate(SourceBase):
    pass


class SourceRead(SourceBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: str
    updated_at: str


class LanguageVariant(BaseModel):
    claim: str = ""
    applicability: str = ""
    reviewed: bool = False


class KnowledgeRecordBase(BaseModel):
    topic: KnowledgeTopicEnum
    trade: Optional[str] = None
    claim: str = Field(..., min_length=1)
    value: Optional[Dict[str, Any]] = None
    source_id: UUID
    geography_level: GeographyLevelEnum
    geography_code: str = Field(..., min_length=1)
    applicability: str = Field(..., min_length=1)
    language_variants: Dict[str, LanguageVariant] = Field(default_factory=dict)
    published_date: Optional[date] = None
    verified_date: date
    review_due: date
    status: RecordStatusEnum = RecordStatusEnum.needs_review
    is_demo: bool = False

    @field_validator("verified_date")
    @classmethod
    def verified_before_review_due(cls, v: date, info) -> date:
        review_due = info.data.get("review_due")
        if review_due and v > review_due:
            raise ValueError("verified_date must be before or equal to review_due")
        return v


class KnowledgeRecordCreate(KnowledgeRecordBase):
    pass


class KnowledgeRecordRead(KnowledgeRecordBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    embedding: Optional[List[float]] = None
    created_at: str
    updated_at: str
    source: Optional["SourceRead"] = None


class KnowledgeRecordWithSource(KnowledgeRecordRead):
    source: "SourceRead"


class ProgressionEdgeBase(BaseModel):
    from_node: str = Field(..., min_length=1)
    to_node: str = Field(..., min_length=1)
    record_id: UUID
    eligibility: str = Field(..., min_length=1)
    conditions: str = Field(..., min_length=1)


class ProgressionEdgeCreate(ProgressionEdgeBase):
    pass


class ProgressionEdgeRead(ProgressionEdgeBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: str
    updated_at: str


class EvidenceObject(BaseModel):
    """Structured evidence object returned by retrieval layer."""
    id: UUID
    claim: str
    value: Optional[Dict[str, Any]] = None
    source_title: str
    source_authority: str
    source_type: SourceTypeEnum
    published_date: Optional[date] = None
    verified_date: date
    geography_level: GeographyLevelEnum
    geography_code: str
    geography_label: str
    applicability: str
    status: RecordStatusEnum
    is_demo: bool


class ValueObject(BaseModel):
    """Value object for EvidenceCard - structured value with text, numeric, unit."""
    text: str
    numeric: Optional[float] = None
    unit: Optional[str] = None


class SourceObject(BaseModel):
    """Source object for EvidenceCard - matches API spec."""
    title: str
    authority: str
    type: SourceTypeEnum
    published_date: Optional[date] = None
    reference: Optional[str] = None


class GeographyObject(BaseModel):
    """Geography object for EvidenceCard - matches API spec."""
    level: GeographyLevelEnum
    code: str
    label: str


class EvidenceCard(BaseModel):
    """Evidence Card for family-facing responses - matches API spec."""
    record_id: UUID
    claim: str
    value: ValueObject
    source: SourceObject
    verified_date: date
    geography: GeographyObject
    applicability: str
    status: RecordStatusEnum
    is_demo: bool


class RetrievalQuery(BaseModel):
    topic: KnowledgeTopicEnum
    trade: Optional[str] = None
    district_code: Optional[str] = None
    state_code: Optional[str] = None
    top_k: int = 3
    include_demo: bool = False


class RetrievalResult(BaseModel):
    records: List[EvidenceObject]
    geography_used: Optional[GeographyLevelEnum] = None
    abstained: bool = False
    reason: Optional[str] = None


class EvidenceCardResponse(BaseModel):
    """Response for evidence API endpoint."""
    cards: List[EvidenceCard]
    geography_used: Optional[GeographyLevelEnum] = None
    abstained: bool = False
    reason: Optional[str] = None


# Rebuild models to resolve forward references
SourceRead.model_rebuild()
KnowledgeRecordRead.model_rebuild()
KnowledgeRecordWithSource.model_rebuild()