from datetime import date
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import KnowledgeRecord, Source
from app.models.knowledge import GeographyLevelEnum, KnowledgeTopicEnum, RecordStatusEnum
from app.schemas.knowledge import EvidenceObject, RetrievalQuery, RetrievalResult, SourceTypeEnum


class RetrievalService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def retrieve(self, query: RetrievalQuery) -> RetrievalResult:
        """
        Retrieve verified evidence using geography fallback.

        Fallback order: district -> state -> national
        Only returns records with status = verified for family-facing answers.
        """
        # Build base query for verified records
        base_query = self._build_base_query(query)

        # Try district level first
        if query.district_code:
            result = await self._execute_query(base_query, query.district_code, GeographyLevelEnum.district, query.top_k, query.include_demo)
            if result.records:
                return result

        # Try state level
        if query.state_code:
            result = await self._execute_query(base_query, query.state_code, GeographyLevelEnum.state, query.top_k, query.include_demo)
            if result.records:
                return result

        # Try national level
        result = await self._execute_query(base_query, "IN", GeographyLevelEnum.national, query.top_k, query.include_demo)
        return result

    def _build_base_query(self, query: RetrievalQuery):
        """Build the base query with filters."""
        conditions = [
            KnowledgeRecord.topic == query.topic,
            KnowledgeRecord.status == RecordStatusEnum.verified,
            KnowledgeRecord.review_due >= date.today(),
        ]

        if not query.include_demo:
            conditions.append(KnowledgeRecord.is_demo == False)

        stmt = (
            select(KnowledgeRecord, Source)
            .join(Source, KnowledgeRecord.source_id == Source.id)
            .where(and_(*conditions))
        )

        if query.trade:
            stmt = stmt.where(KnowledgeRecord.trade == query.trade)

        return stmt

    async def _execute_query(
        self,
        base_query,
        geography_code: str,
        geography_level: GeographyLevelEnum,
        top_k: int,
        include_demo: bool
    ) -> RetrievalResult:
        """Execute query for a specific geography level."""
        stmt = base_query.where(
            and_(
                KnowledgeRecord.geography_level == geography_level,
                KnowledgeRecord.geography_code == geography_code,
            )
        ).order_by(
            # In a real implementation, this would use vector similarity
            # For now, we'll order by verified_date desc as a proxy
            KnowledgeRecord.verified_date.desc()
        ).limit(top_k)

        result = await self.db.execute(stmt)
        rows = result.all()

        records = []
        for kr, src in rows:
            # Safety net: ensure only verified, fresh records are returned
            if (
                kr.status != RecordStatusEnum.verified
                or kr.review_due < date.today()
                or (kr.is_demo and not include_demo)
            ):
                continue
            evidence = self._build_evidence_object(kr, src, geography_level)
            records.append(evidence)

        if records:
            return RetrievalResult(
                records=records,
                geography_used=geography_level,
                abstained=False,
            )

        return RetrievalResult(
            records=[],
            geography_used=None,
            abstained=True,
            reason=f"No verified evidence found at {geography_level.value} level ({geography_code})",
        )

    def _build_evidence_object(
        self,
        record: KnowledgeRecord,
        source: Source,
        geography_level: GeographyLevelEnum
    ) -> EvidenceObject:
        """Build an EvidenceObject from database records."""
        # Generate geography label
        if geography_level == GeographyLevelEnum.district:
            geography_label = "District-level figure"
        elif geography_level == GeographyLevelEnum.state:
            geography_label = "State-level figure; district-level data unavailable"
        else:
            geography_label = "National-level figure; district and state data unavailable"

        return EvidenceObject(
            id=record.id,
            claim=record.claim,
            value=record.value,
            source_title=source.title,
            source_authority=source.authority,
            source_type=SourceTypeEnum(source.source_type.value),
            published_date=source.published_date,
            verified_date=record.verified_date,
            geography_level=record.geography_level,
            geography_code=record.geography_code,
            geography_label=geography_label,
            applicability=record.applicability,
            status=RecordStatusEnum(record.status.value),
            is_demo=record.is_demo,
        )

    async def get_progression_edges(
        self,
        from_node: str,
        trade: Optional[str] = None
    ) -> List[dict]:
        """Get progression edges for a given node."""
        stmt = (
            select(KnowledgeRecord, Source)
            .join(Source, KnowledgeRecord.source_id == Source.id)
            .where(
                and_(
                    KnowledgeRecord.topic == KnowledgeTopicEnum.progression,
                    KnowledgeRecord.status == RecordStatusEnum.verified,
                    KnowledgeRecord.review_due >= date.today(),
                )
            )
        )

        if trade:
            stmt = stmt.where(KnowledgeRecord.trade == trade)

        result = await self.db.execute(stmt)
        rows = result.all()

        edges = []
        for kr, src in rows:
            edges.append({
                "from_node": kr.claim.split("→")[0].strip() if "→" in kr.claim else "unknown",
                "to_node": kr.claim.split("→")[1].strip() if "→" in kr.claim else "unknown",
                "eligibility": kr.applicability,
                "conditions": kr.value.get("conditions", "") if kr.value else "",
                "evidence": self._build_evidence_object(kr, src, kr.geography_level),
            })

        return edges