import json
import uuid
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import KnowledgeRecord, ProgressionEdge, Source
from app.models.knowledge import (
    GeographyLevelEnum,
    KnowledgeTopicEnum,
    RecordStatusEnum,
    SourceTypeEnum,
)
from app.schemas.knowledge import (
    KnowledgeRecordCreate,
    ProgressionEdgeCreate,
    SourceCreate,
)


class IngestionError(Exception):
    """Raised when ingestion fails validation."""
    pass


class IngestionService:
    """Handles ingestion of knowledge records from JSON files."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.stats = {
            "sources_created": 0,
            "sources_updated": 0,
            "records_created": 0,
            "records_updated": 0,
            "records_rejected": 0,
            "edges_created": 0,
            "errors": [],
        }

    async def ingest_from_file(self, file_path: Path) -> Dict[str, Any]:
        """Ingest records from a JSON file."""
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, dict):
            data = [data]

        for record_data in data:
            try:
                await self._ingest_record(record_data)
            except IngestionError as e:
                self.stats["records_rejected"] += 1
                self.stats["errors"].append(str(e))

        return self.stats

    async def ingest_from_dir(self, dir_path: Path) -> Dict[str, Any]:
        """Ingest all JSON files from a directory."""
        for file_path in dir_path.glob("*.json"):
            if file_path.name.startswith("_"):
                continue  # Skip template files
            await self.ingest_from_file(file_path)
        return self.stats

    async def _ingest_record(self, record_data: Dict[str, Any]) -> None:
        """Ingest a single record with validation."""
        # Validate required fields
        self._validate_record(record_data)

        # Create or get source
        source = await self._get_or_create_source(record_data["source"])

        # Check if record already exists (by claim + geography + trade)
        existing = await self._find_existing_record(
            record_data["claim"],
            record_data["geography"]["level"],
            record_data["geography"]["code"],
            record_data.get("trade"),
        )

        # Create knowledge record
        kr_data = KnowledgeRecordCreate(
            topic=KnowledgeTopicEnum(record_data["topic"]),
            trade=record_data.get("trade"),
            claim=record_data["claim"],
            value=record_data.get("value"),
            source_id=source.id,
            geography_level=GeographyLevelEnum(record_data["geography"]["level"]),
            geography_code=record_data["geography"]["code"],
            applicability=record_data["applicability"],
            language_variants={
                k: {"claim": v.get("claim", ""), "applicability": v.get("applicability", ""), "reviewed": v.get("reviewed", False)}
                for k, v in record_data.get("language_variants", {}).items()
            },
            published_date=record_data.get("published_date"),
            verified_date=date.fromisoformat(record_data["verified_date"]),
            review_due=date.fromisoformat(record_data["review_due"]),
            status=RecordStatusEnum(record_data["status"]),
            is_demo=record_data.get("is_demo", False),
        )

        if existing:
            # Update existing record
            for key, value in kr_data.model_dump().items():
                if key != "source_id":
                    setattr(existing, key, value)
            existing.source_id = source.id
            self.stats["records_updated"] += 1
        else:
            # Create new record
            new_record = KnowledgeRecord(**kr_data.model_dump())
            self.db.add(new_record)
            self.stats["records_created"] += 1

        await self.db.flush()

        # Ingest progression edges if present
        if "progression_edges" in record_data:
            await self._ingest_progression_edges(record_data["progression_edges"], existing.id if existing else new_record.id)

    def _validate_record(self, record_data: Dict[str, Any]) -> None:
        """Validate a record against the schema requirements."""
        required_fields = ["topic", "claim", "source", "geography", "applicability", "verified_date", "review_due", "status"]
        for field in required_fields:
            if field not in record_data:
                raise IngestionError(f"Missing required field: {field}")

        # Validate source
        source = record_data["source"]
        source_required = ["title", "authority", "source_type", "retrieved_date"]
        for field in source_required:
            if field not in source:
                raise IngestionError(f"Missing required source field: {field}")

        # Validate geography
        geo = record_data["geography"]
        if "level" not in geo or "code" not in geo:
            raise IngestionError("Geography must have level and code")

        # Validate dates
        try:
            verified_date = date.fromisoformat(record_data["verified_date"])
            review_due = date.fromisoformat(record_data["review_due"])
        except ValueError:
            raise IngestionError("Invalid date format (expected YYYY-MM-DD)")

        # Validate verified_date <= review_due
        if verified_date > review_due:
            raise IngestionError("verified_date must be before or equal to review_due")

        # Validate status
        valid_statuses = [s.value for s in RecordStatusEnum]
        if record_data["status"] not in valid_statuses:
            raise IngestionError(f"Invalid status: {record_data['status']}. Must be one of {valid_statuses}")

        # Validate topic
        valid_topics = [t.value for t in KnowledgeTopicEnum]
        if record_data["topic"] not in valid_topics:
            raise IngestionError(f"Invalid topic: {record_data['topic']}. Must be one of {valid_topics}")

    async def _get_or_create_source(self, source_data: Dict[str, Any]) -> Source:
        """Get existing source or create new one."""
        # Try to find existing source by title + authority
        stmt = select(Source).where(
            Source.title == source_data["title"],
            Source.authority == source_data["authority"],
        )
        result = await self.db.execute(stmt)
        source = result.scalar_one_or_none()

        if source:
            self.stats["sources_updated"] += 1
            # Update fields
            source.source_type = SourceTypeEnum(source_data["source_type"])
            source.url = source_data.get("url")
            source.document_ref = source_data.get("document_ref")
            source.published_date = date.fromisoformat(source_data["published_date"]) if source_data.get("published_date") else None
            source.retrieved_date = date.fromisoformat(source_data["retrieved_date"])
        else:
            source = Source(
                title=source_data["title"],
                authority=source_data["authority"],
                source_type=SourceTypeEnum(source_data["source_type"]),
                url=source_data.get("url"),
                document_ref=source_data.get("document_ref"),
                published_date=date.fromisoformat(source_data["published_date"]) if source_data.get("published_date") else None,
                retrieved_date=date.fromisoformat(source_data["retrieved_date"]),
            )
            self.db.add(source)
            self.stats["sources_created"] += 1

        await self.db.flush()
        return source

    async def _find_existing_record(
        self,
        claim: str,
        geography_level: str,
        geography_code: str,
        trade: Optional[str] = None,
    ) -> Optional[KnowledgeRecord]:
        """Find an existing record by claim + geography + trade."""
        stmt = select(KnowledgeRecord).where(
            KnowledgeRecord.claim == claim,
            KnowledgeRecord.geography_level == GeographyLevelEnum(geography_level),
            KnowledgeRecord.geography_code == geography_code,
        )
        if trade:
            stmt = stmt.where(KnowledgeRecord.trade == trade)

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def _ingest_progression_edges(
        self,
        edges_data: List[Dict[str, Any]],
        record_id: UUID,
    ) -> None:
        """Ingest progression edges for a record."""
        for edge_data in edges_data:
            edge = ProgressionEdgeCreate(
                from_node=edge_data["from_node"],
                to_node=edge_data["to_node"],
                record_id=record_id,
                eligibility=edge_data["eligibility"],
                conditions=edge_data["conditions"],
            )
            new_edge = ProgressionEdge(**edge.model_dump())
            self.db.add(new_edge)
            self.stats["edges_created"] += 1

    def get_report(self) -> Dict[str, Any]:
        """Get ingestion report."""
        return self.stats.copy()