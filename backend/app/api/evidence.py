from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.models import KnowledgeRecord, Source
from app.models.knowledge import GeographyLevelEnum, KnowledgeTopicEnum, RecordStatusEnum
from app.rag import RetrievalService, RetrievalQuery
from app.rag.evidence_card import build_evidence_card_from_retrieval
from app.schemas.knowledge import (
    EvidenceCard,
    EvidenceCardResponse,
    GeographyLevelEnum,
    KnowledgeTopicEnum,
)

router = APIRouter(prefix="/api/v1", tags=["evidence"])


@router.get("/sessions/{session_id}/evidence")
async def get_evidence(
    session_id: str,
    topic: KnowledgeTopicEnum = Query(...),
    trade: str | None = Query(None),
    district_code: str | None = Query(None),
    state_code: str | None = Query(None),
    top_k: int = Query(3, ge=1, le=10),
    include_demo: bool = Query(False),
    db: AsyncSession = Depends(get_db),
) -> EvidenceCardResponse:
    """
    Retrieve evidence cards for a given topic and geography.
    
    Uses geography fallback: district -> state -> national.
    Only returns verified evidence for family-facing responses.
    """
    retrieval_service = RetrievalService(db)
    
    # Build retrieval query
    query = RetrievalQuery(
        topic=topic,
        trade=trade,
        district_code=district_code,
        state_code=state_code,
        top_k=top_k,
        include_demo=include_demo,
    )
    
    # Execute retrieval
    result = await retrieval_service.retrieve(query)
    
    # Convert EvidenceObjects to EvidenceCards by fetching full records
    cards = []
    for evidence_obj in result.records:
        # Fetch the full KnowledgeRecord and Source to build the EvidenceCard
        stmt = select(KnowledgeRecord, Source).join(
            Source, KnowledgeRecord.source_id == Source.id
        ).where(KnowledgeRecord.id == evidence_obj.id)
        
        result_row = await db.execute(stmt)
        row = result_row.first()
        
        if row:
            record, source = row
            card = build_evidence_card_from_retrieval(record, source)
            cards.append(card)
    
    return EvidenceCardResponse(
        cards=cards,
        geography_used=result.geography_used,
        abstained=result.abstained,
    )