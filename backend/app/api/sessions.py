from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from uuid import UUID

from app.core.db import get_db
from app.core.config import get_settings
from app.services.session import SessionService, MessageService
from app.services.concern import ConcernService, ConcernDetector
from app.schemas.knowledge import (
    RetrievalQuery,
    EvidenceCardResponse,
    KnowledgeTopicEnum,
    GeographyLevelEnum,
)
from app.models.session import (
    SpeakerRoleEnum, ConsentKindEnum, ConsenterRoleEnum, ConsentMethodEnum,
    SessionStatusEnum, ConcernLabelEnum, ConcernStatusEnum, SafetyFlagEnum
)
from app.models import Session, Consent, Message, Concern
from app.models.session import (
    SessionStatusEnum, ConsentKindEnum, ConsenterRoleEnum, ConsentMethodEnum,
    SpeakerRoleEnum, SafetyFlagEnum, ConcernLabelEnum, ConcernStatusEnum
)
from app.core.db import get_db
from app.core.config import get_settings
from pydantic import BaseModel, Field
from datetime import date, datetime, timedelta
from typing import Optional, List
from uuid import UUID, uuid4


# Request/Response models
class SessionCreateRequest(BaseModel):
    language: str = Field(..., min_length=1)
    pilot_region: str = Field(..., min_length=1)
    trade_of_interest: Optional[str] = None
    district_code: Optional[str] = None


class SessionCreateResponse(BaseModel):
    session_id: UUID
    consent_text: dict


class ConsentGrantRequest(BaseModel):
    kind: str = "session"
    consenter_role: str = Field(..., pattern="^(parent|guardian)$")
    method: str = "typed_confirmation"


class ConsentGrantResponse(BaseModel):
    session_token: str
    expires_at: str


class MessageCreateRequest(BaseModel):
    speaker_role: str = Field(..., pattern="^(student|parent)$")
    text: str = Field(..., min_length=1)
    language: str = "en"


class MessageResponse(BaseModel):
    message_id: UUID
    safety: dict
    concerns: List[dict]
    reply: dict
    escalation: dict


class ConcernConfirmRequest(BaseModel):
    confirmed: bool
    corrected_label: Optional[str] = None


class ConcernStatusRequest(BaseModel):
    status: str = Field(..., pattern="^(open|partly_resolved|resolved)$")


# Session endpoints
router = APIRouter(prefix="/api/v1", tags=["sessions"])


@router.post("/consents/start")
async def start_consent(
    request: SessionCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a pending session and show consent text."""
    settings = get_settings()
    
    session_service = SessionService(db)
    session = await session_service.create_session(
        language=request.language,
        pilot_region=request.pilot_region,
        trade_of_interest=request.trade_of_interest,
        district_code=request.district_code,
    )
    
    consent_text = {
        "version": "v1",
        "text": f"I consent to this counselling session in {request.language}. "
                f"I understand that my data will be stored for {get_settings().session_retention_days} days. "
                f"I am the parent/guardian and I agree."
    }
    
    return {
        "session_id": str(session.id),
        "consent_text": consent_text
    }


@router.post("/consents/{session_id}/grant")
async def grant_consent(
    session_id: str,
    request: ConsentGrantRequest,
    db: AsyncSession = Depends(get_db),
):
    """Grant consent for a session."""
    from uuid import UUID
    from app.services.session import SessionService
    from app.models import Session, Consent
    import jwt
    from datetime import datetime, timedelta
    
    session_service = SessionService(db)
    
    # Check session exists
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Record consent
    consent = await SessionService(db).record_consent(
        session_id=session_id,
        kind=request.kind,
        consenter_role=request.consenter_role,
        method=request.method,
        language_shown="en",  # TODO: use session language
        version_of_text="v1",
        granted=True,
    )
    
    # Generate session token
    settings = get_settings()
    token = jwt.encode(
        {"session_id": session_id, "exp": datetime.utcnow() + timedelta(days=30)},
        settings.jwt_secret,
        algorithm="HS256"
    )
    
    return {
        "session_token": token,
        "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat()
    }


@router.post("/consents/{session_id}/handoff-consent")
async def grant_handoff_consent(
    session_id: str,
    granted: bool,
    db: AsyncSession = Depends(get_db),
):
    """Grant consent for counsellor handoff."""
    from app.models import Consent, ConsentKindEnum
    from uuid import UUID
    
    consent = Consent(
        session_id=UUID(session_id),
        kind=ConsentKindEnum.counsellor_handoff,
        granted=granted,
        consenter_role="parent",  # TODO: get from session
        method="typed_confirmation",
        language_shown="en",
        version_of_text="v1",
    )
    db.add(consent)
    await db.flush()
    
    return {"granted": granted}


# Message endpoints
@router.post("/sessions/{session_id}/messages")
async def add_message(
    session_id: str,
    request: MessageCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Add a message to a session and process concerns."""
    from uuid import UUID
    from app.models import Session, Message, Concern
    from app.models.session import SpeakerRoleEnum, SafetyFlagEnum
    from app.services.session import MessageService
    from app.services.concern import ConcernService, ConcernDetector
    from app.rag import RetrievalService, RetrievalQuery
    from app.rag.evidence_card import build_evidence_card_from_retrieval
    from app.rag.abstention import AbstentionEngine
    from app.rag.grounding import GroundingValidator
    from app.rag.llm import MockLLMProvider
    from app.models.session import SpeakerRoleEnum, SafetyFlagEnum
    from app.models import Concern, ConcernStatusEnum
    from app.schemas.knowledge import RetrievalQuery, KnowledgeTopicEnum
    from app.models.session import ConcernLabelEnum, ConcernStatusEnum
    from app.rag.evidence_card import build_evidence_card_from_retrieval
    from app.rag.abstention import AbstentionEngine
    from app.rag.grounding import GroundingValidator
    from app.rag.llm import MockLLMProvider
    from app.rag.validators import NumberValidator
    from app.services.concern import ConcernService, ConcernDetector
    from app.services.session import SessionService, MessageService
    from app.core.config import get_settings
    from uuid import uuid4
    import jwt
    from datetime import datetime, timedelta
    
    settings = get_settings()
    session_id_uuid = UUID(session_id)
    
    # Verify session exists
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check consent
    if not await SessionService(db).get_consent_status(session_id, "session"):
        raise HTTPException(status_code=403, detail="Session consent not granted")
    
    # Add message
    message_service = MessageService(db)
    message = await message_service.add_message(
        session_id=session_id,
        speaker_role=request.speaker_role,
        text=request.text,
        language=request.language,
    )
    
    # Initialize services
    concern_service = ConcernService(db)
    concern_detector = ConcernDetector()
    retrieval_service = RetrievalService(db)
    abstention_engine = AbstentionEngine()
    grounding_validator = GroundingValidator()
    number_validator = NumberValidator()
    llm_provider = MockLLMProvider()
    
    concerns_detected = []
    reply = {"kind": "answer", "text": "", "evidence_cards": []}
    escalation = {"suggested": False, "reason": None}
    safety = {"distress": False}
    
    # Detect distress
    distress_keywords = ["suicide", "kill myself", "kill me", "end my life", "hurt myself", 
                         "self harm", "suicide", "marna", "marna chahta", "marna chahti"]
    text_lower = request.text.lower()
    distress_detected = any(kw in request.text.lower() for kw in distress_keywords)
    
    if distress_detected:
        safety["distress"] = True
        await MessageService(db).flag_distress(str(message.id))
        
        # Check for handoff consent
        from app.models import Consent, ConsentKindEnum
        from uuid import UUID
        consent_stmt = select(Consent).where(
            Consent.session_id == UUID(session_id),
            Consent.kind == "counsellor_handoff"
        )
        consent_result = await db.execute(select(Consent).where(
            Consent.session_id == UUID(session_id),
            Consent.kind == "counsellor_handoff"
        ))
        handoff_consent = result.scalar_one_or_none()
        
        return {
            "message_id": str(message.id),
            "safety": safety,
            "concerns": [],
            "reply": {
                "kind": "distress",
                "text": "I'm concerned about what you shared. I'm connecting you with a person who can help, and here is a helpline you can contact now.",
                "evidence_cards": []
            },
            "escalation": {"suggested": True, "reason": "distress"}
        }
    
    # Only process parent messages for concern detection
    if request.speaker_role == "parent":
        # Detect concerns
        concerns_detected = concern_detector.detect(request.text, request.language)
        
        # Save concerns
        concern_service = ConcernService(db)
        concerns_response = []
        
        for concern_detected in concerns_detected:
            if concern_detected["concern"] == "none":
                continue
                
            concern = await ConcernService(db).create_concern(
                session_id=session_id,
                message_id=str(message.id),
                label=concern_detected["concern"],
                confidence=concern_detected["confidence"],
                confirmed=not concern_detected["needs_confirmation"],
            )
            
            concerns_response.append({
                "id": str(concern.id),
                "label": concern_detected["concern"],
                "confidence": concern_detected["confidence"],
                "needs_confirmation": concern_detected["needs_confirmation"],
            })
        
        # If concerns detected, retrieve evidence and generate response
        if concerns_response and any(c["confidence"] >= 0.70 for c in concerns_response):
            # Use the highest confidence concern for retrieval
            primary_concern = max(
                [c for c in concerns_detected if c["concern"] != "none"],
                key=lambda x: x["confidence"],
                default=None
            )
            
            if primary_concern:
                # Map concern to knowledge topic
                concern_to_topic = {
                    "job_security": "job_security",
                    "income": "income",
                    "social_perception": "social_perception",
                    "safety": "safety",
                    "degree_foreclosure": "degree_foreclosure",
                }
                
                topic = concern_to_topic.get(primary_concern["concern"], "job_security")
                
                # Build retrieval query
                retrieval_query = RetrievalQuery(
                    topic=topic,
                    trade=session.trade_of_interest,
                    district_code=None,  # TODO: get from session
                    state_code=None,  # TODO: get from session
                    top_k=3,
                    include_demo=False,
                )
                
                # Retrieve evidence
                retrieval_result = await RetrievalService(db).retrieve(RetrievalQuery(
                    topic=primary_concern["concern"],
                    trade=session.trade_of_interest,
                    top_k=3,
                    include_demo=False,
                ))
                
                # Build evidence cards
                evidence_cards = []
                for evidence_obj in retrieval_result.records:
                    # Build evidence card from retrieval result
                    pass  # Simplified for now
                
                # Check abstention
                from app.rag.abstention import AbstentionEngine
                abstention_engine = AbstentionEngine()
                abstention_result = AbstentionEngine().check_abstention(
                    question=request.text,
                    retrieval_result=None,  # Simplified
                    evidence_cards=[],
                )
                
                if abstention_result.should_abstain:
                    reply = {
                        "kind": "abstain",
                        "text": "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?",
                        "evidence_cards": []
                    }
                else:
                    # Generate answer using mock LLM
                    from app.rag.llm import MockLLMProvider
                    llm = MockLLMProvider()
                    
                    prompt = f"Question: {request.text}\n\nAnswer based on evidence."
                    llm_response = await MockLLMProvider().generate(prompt)
                    
                    # Validate grounding
                    from app.rag.grounding import GroundingValidator
                    validator = GroundingValidator()
                    
                    reply = {
                        "kind": "answer",
                        "text": llm_response.text,
                        "evidence_cards": []
                    }
    
    return {
        "message_id": str(message.id),
        "safety": safety,
        "concerns": concerns_response,
        "reply": reply,
        "escalation": escalation
    }


@router.post("/sessions/{session_id}/concerns/{concern_id}/confirm")
async def confirm_concern(
    session_id: str,
    concern_id: str,
    request: dict,
    db: AsyncSession = Depends(get_db),
):
    """Confirm or correct a detected concern."""
    from uuid import UUID
    from app.services.concern import ConcernService
    
    confirmed = request.get("confirmed", False)
    corrected_label = request.get("corrected_label")
    
    concern_service = ConcernService(db)
    concern = await ConcernService(db).confirm_concern(
        concern_id=concern_id,
        confirmed=request.get("confirmed", False),
        corrected_label=request.get("corrected_label"),
    )
    
    if not concern:
        raise HTTPException(status_code=404, detail="Concern not found")
    
    return {"concern_id": concern_id, "confirmed": confirmed}


@router.post("/sessions/{session_id}/concerns/{concern_id}/status")
async def update_concern_status(
    session_id: str,
    concern_id: str,
    status: str,
    db: AsyncSession = Depends(get_db),
):
    """Update concern status."""
    from app.services.concern import ConcernService
    
    concern = await ConcernService(db).update_concern_status(concern_id, status)
    
    if not concern:
        raise HTTPException(status_code=404, detail="Concern not found")
    
    return {"concern_id": concern_id, "status": status}