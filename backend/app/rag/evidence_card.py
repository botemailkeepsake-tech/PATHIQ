from typing import List, Optional
from uuid import UUID

from app.models import KnowledgeRecord, Source
from app.models.knowledge import GeographyLevelEnum, KnowledgeTopicEnum, RecordStatusEnum
from app.schemas.knowledge import (
    EvidenceCard,
    EvidenceObject,
    ValueObject,
    SourceObject,
    GeographyObject,
    GeographyLevelEnum,
    RecordStatusEnum,
    SourceTypeEnum,
)


class EvidenceCardBuilder:
    """Builds EvidenceCard objects from retrieval results for family-facing responses."""

    @staticmethod
    def build_evidence_card(
        record: KnowledgeRecord,
        source: Source,
        geography_level: GeographyLevelEnum,
    ) -> EvidenceCard:
        """
        Build an EvidenceCard from a KnowledgeRecord and Source.
        
        This is the main entry point for creating family-facing evidence cards.
        """
        # Generate geography label based on level
        geography_label = EvidenceCardBuilder._get_geography_label(geography_level)

        # Build value object from record's value field
        value_obj = EvidenceCardBuilder._build_value_object(record.value)

        # Build source object
        source_obj = SourceObject(
            title=source.title,
            authority=source.authority,
            type=SourceTypeEnum(source.source_type.value),
            published_date=source.published_date,
            reference=source.document_ref,
        )

        # Build geography object
        geography_obj = GeographyObject(
            level=geography_level,
            code=record.geography_code,
            label=geography_label,
        )

        return EvidenceCard(
            record_id=record.id,
            claim=record.claim,
            value=value_obj,
            source=source_obj,
            verified_date=record.verified_date,
            geography=geography_obj,
            applicability=record.applicability,
            status=RecordStatusEnum(record.status.value),
            is_demo=record.is_demo,
        )

    @staticmethod
    def _get_geography_label(geography_level: GeographyLevelEnum) -> str:
        """Generate human-readable geography label."""
        if geography_level == GeographyLevelEnum.district:
            return "District-level figure"
        elif geography_level == GeographyLevelEnum.state:
            return "State-level figure; district-level data unavailable"
        else:
            return "National-level figure; district and state data unavailable"

    @staticmethod
    def _build_value_object(value: Optional[dict]) -> "ValueObject":
        """Build ValueObject from record's value dict."""
        from app.schemas.knowledge import ValueObject
        
        if not value:
            return ValueObject(text="", numeric=None, unit=None)
        
        # Extract numeric value and unit if present
        numeric = None
        unit = None
        text = ""
        
        if isinstance(value, dict):
            # Try to extract numeric value
            if "numeric" in value and value["numeric"] is not None:
                numeric = float(value["numeric"])
            if "unit" in value:
                unit = str(value["unit"])
            if "text" in value:
                text = str(value["text"])
            elif numeric is not None:
                text = f"{numeric} {unit}" if unit else str(numeric)
        
        return ValueObject(text=text, numeric=numeric, unit=unit)


def build_evidence_card_from_retrieval(
    record: "KnowledgeRecord",
    source: "Source",
) -> "EvidenceCard":
    """
    Convenience function to build an EvidenceCard directly from a KnowledgeRecord and Source.
    """
    return EvidenceCardBuilder.build_evidence_card(record, source, record.geography_level)