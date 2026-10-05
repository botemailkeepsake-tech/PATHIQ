from datetime import date
from typing import Any, Dict, List, Optional, Callable, Tuple
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.knowledge import (
    GeographyLevelEnum,
    KnowledgeTopicEnum,
    RecordStatusEnum,
    SourceTypeEnum,
)


class ColumnMapping(BaseModel):
    """Maps external dataset columns to PATHIQ internal fields."""
    topic: str
    trade: Optional[str] = None
    claim: str
    value: Optional[str] = None
    source_title: str
    source_authority: str
    source_type: str
    source_url: Optional[str] = None
    source_document_ref: Optional[str] = None
    source_published_date: Optional[str] = None
    source_retrieved_date: str
    geography_level: str
    geography_code: str
    applicability: str
    language_variants: Optional[str] = None
    verified_date: str
    review_due: str
    status: str = "needs_review"
    is_demo: bool = True


class MappingRule(BaseModel):
    """A single mapping rule for transforming external data."""
    internal_field: str
    external_column: Optional[str] = None
    transform: Optional[Callable[[Any], Any]] = None
    default: Optional[Any] = None
    required: bool = False


class ExternalDatasetMapper:
    """
    Maps external dataset records to PATHIQ internal schema.

    This allows organisers to provide their own CSV/JSON datasets
    without changing PATHIQ's internal structure.
    """

    def __init__(self, mapping_rules: List[MappingRule]):
        self.mapping_rules = {rule.internal_field: rule for rule in mapping_rules}

    def map_record(self, external_row: Dict[str, Any]) -> Dict[str, Any]:
        """Map a single external row to PATHIQ internal format."""
        mapped = {}
        self._missing_required = []

        for internal_field, rule in self.mapping_rules.items():
            value = None

            if rule.external_column and rule.external_column in external_row:
                value = external_row[rule.external_column]
            elif rule.default is not None:
                value = rule.default
            elif rule.required:
                self._missing_required.append(internal_field)
                continue

            if value is not None and rule.transform:
                try:
                    value = rule.transform(value)
                except Exception as e:
                    raise ValueError(f"Transform failed for field '{internal_field}': {e}")

            if value is not None:
                mapped[internal_field] = value

        return mapped

    def validate_mapped_record(self, mapped: Dict[str, Any]) -> List[str]:
        """Validate a mapped record against PATHIQ requirements. Returns list of errors."""
        errors = []

        # Add missing required fields as errors
        if hasattr(self, '_missing_required') and self._missing_required:
            for field in self._missing_required:
                errors.append(f"Missing required field: {field}")

        # Required fields check
        required = ["topic", "claim", "source_title", "source_authority", "source_type",
                    "source_retrieved_date", "geography_level", "geography_code",
                    "applicability", "verified_date", "review_due", "status"]
        for field in required:
            if field not in mapped:
                errors.append(f"Missing required field: {field}")

        # Validate enums
        if "topic" in mapped and mapped["topic"] not in [t.value for t in KnowledgeTopicEnum]:
            errors.append(f"Invalid topic: {mapped['topic']}")

        if "geography_level" in mapped and mapped["geography_level"] not in [g.value for g in GeographyLevelEnum]:
            errors.append(f"Invalid geography_level: {mapped['geography_level']}")

        if "status" in mapped and mapped["status"] not in [s.value for s in RecordStatusEnum]:
            errors.append(f"Invalid status: {mapped['status']}")

        if "source_type" in mapped and mapped["source_type"] not in [s.value for s in SourceTypeEnum]:
            errors.append(f"Invalid source_type: {mapped['source_type']}")

        # Validate dates
        for date_field in ["source_published_date", "source_retrieved_date", "verified_date", "review_due"]:
            if date_field in mapped and mapped[date_field]:
                try:
                    date.fromisoformat(str(mapped[date_field]))
                except ValueError:
                    errors.append(f"Invalid date format for {date_field}: {mapped[date_field]} (expected YYYY-MM-DD)")

        return errors

    def map_and_validate(self, external_row: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
        """Map and validate a single external row."""
        mapped = self.map_record(external_row)
        errors = self.validate_mapped_record(mapped)
        return mapped, errors


def create_default_mapper() -> ExternalDatasetMapper:
    """Create a mapper with default column mappings for common CSV formats."""
    rules = [
        MappingRule(internal_field="topic", external_column="topic", required=True,
                    transform=lambda x: x.lower().replace(" ", "_")),
        MappingRule(internal_field="trade", external_column="trade"),
        MappingRule(internal_field="claim", external_column="claim", required=True),
        MappingRule(internal_field="value", external_column="value",
                    transform=lambda x: json.loads(x) if isinstance(x, str) and x.startswith("{") else None),
        MappingRule(internal_field="source_title", external_column="source_title", required=True),
        MappingRule(internal_field="source_authority", external_column="source_authority", required=True),
        MappingRule(internal_field="source_type", external_column="source_type", required=True,
                    transform=lambda x: x.lower().replace(" ", "_")),
        MappingRule(internal_field="source_url", external_column="source_url"),
        MappingRule(internal_field="source_document_ref", external_column="source_document_ref"),
        MappingRule(internal_field="source_published_date", external_column="source_published_date"),
        MappingRule(internal_field="source_retrieved_date", external_column="source_retrieved_date", required=True),
        MappingRule(internal_field="geography_level", external_column="geography_level", required=True,
                    transform=lambda x: x.lower()),
        MappingRule(internal_field="geography_code", external_column="geography_code", required=True),
        MappingRule(internal_field="applicability", external_column="applicability", required=True),
        MappingRule(internal_field="language_variants", external_column="language_variants"),
        MappingRule(internal_field="verified_date", external_column="verified_date", required=True),
        MappingRule(internal_field="review_due", external_column="review_due", required=True),
        MappingRule(internal_field="status", external_column="status",
                    transform=lambda x: x.lower().replace(" ", "_"), default="needs_review"),
        MappingRule(internal_field="is_demo", external_column="is_demo",
                    transform=lambda x: str(x).lower() in ("true", "1", "yes"), default=True),
    ]
    return ExternalDatasetMapper(rules)


import json