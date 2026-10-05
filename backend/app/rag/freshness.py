from datetime import date
from typing import List
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import KnowledgeRecord
from app.models.knowledge import RecordStatusEnum


class FreshnessFilter:
    """Handles freshness filtering for knowledge records."""

    def __init__(self, db: AsyncSession):
        self.db = db

    def is_fresh(self, record: KnowledgeRecord) -> bool:
        """Check if a record is fresh (not expired, not past review_due)."""
        today = date.today()

        # Expired records
        if record.status == RecordStatusEnum.expired:
            return False

        # Past review due date
        if record.review_due < today:
            return False

        # Withdrawn or conflicting
        if record.status in (RecordStatusEnum.withdrawn, RecordStatusEnum.conflicting):
            return False

        return True

    async def filter_fresh_records(
        self,
        record_ids: List[UUID],
        include_needs_review: bool = False
    ) -> List[KnowledgeRecord]:
        """Filter a list of record IDs to only fresh, verified records."""
        stmt = select(KnowledgeRecord).where(
            and_(
                KnowledgeRecord.id.in_(record_ids),
                KnowledgeRecord.status == RecordStatusEnum.verified,
                KnowledgeRecord.review_due >= date.today(),
            )
        )

        if include_needs_review:
            # For internal evaluation only
            stmt = stmt.where(
                KnowledgeRecord.status.in_([
                    RecordStatusEnum.verified,
                    RecordStatusEnum.needs_review,
                ])
            )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def mark_stale_records(self) -> int:
        """Mark records past review_due as needs_review. Returns count of updated records."""
        today = date.today()

        # Find records that are verified but past review_due
        stmt = select(KnowledgeRecord).where(
            and_(
                KnowledgeRecord.status == RecordStatusEnum.verified,
                KnowledgeRecord.review_due < today,
            )
        )

        result = await self.db.execute(stmt)
        records = list(result.scalars().all())

        count = 0
        for record in records:
            record.status = RecordStatusEnum.needs_review
            count += 1

        if count > 0:
            await self.db.commit()

        return count

    async def detect_conflicts(
        self,
        topic: str,
        trade: str,
        geography_level: str,
        geography_code: str
    ) -> List[KnowledgeRecord]:
        """Detect conflicting records for the same claim and geography."""
        stmt = select(KnowledgeRecord).where(
            and_(
                KnowledgeRecord.topic == topic,
                KnowledgeRecord.trade == trade,
                KnowledgeRecord.geography_level == geography_level,
                KnowledgeRecord.geography_code == geography_code,
                KnowledgeRecord.status.in_([
                    RecordStatusEnum.verified,
                    RecordStatusEnum.needs_review,
                ]),
            )
        )

        result = await self.db.execute(stmt)
        records = list(result.scalars().all())

        # If more than one verified record exists for same claim/geography, flag as conflict
        if len(records) > 1:
            for record in records:
                if record.status == RecordStatusEnum.verified:
                    record.status = RecordStatusEnum.conflicting
            await self.db.commit()

        return records