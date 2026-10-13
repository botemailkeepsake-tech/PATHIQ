from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from pydantic import BaseModel, Field

from app.core.db import get_db
from app.core.config import get_settings
from app.services.session import SessionService, MessageService
from app.services.concern import ConcernService, ConcernDetector
from app.rag import RetrievalService, RetrievalQuery
from app.rag.evidence_card import EvidenceCardBuilder, build_evidence_card_from_retrieval
from app.rag.abstention import AbstentionEngine, AbstentionReason
from app.rag.grounding import GroundingValidator
from app.rag.validators import NumberValidator
from app.rag.llm import MockLLMProvider, create_llm_provider
from app.models import Session, Consent, Message, Concern, KnowledgeRecord, Source
from app.models.session import (
    SpeakerRoleEnum, ConsentKindEnum, ConsenterRoleEnum, ConsentMethodEnum,
    SessionStatusEnum, ConcernLabelEnum, ConcernStatusEnum, SafetyFlagEnum
)
from app.models.knowledge import KnowledgeTopicEnum, GeographyLevelEnum, RecordStatusEnum
from app.schemas.knowledge import (
    RetrievalQuery,
    EvidenceCardResponse,
    KnowledgeTopicEnum,
    GeographyLevelEnum,
)


router = APIRouter(prefix="/api/v1/family-chat", tags=["family-chat"])


# Request/Response models
class FamilyChatSessionCreateRequest(BaseModel):
    language: str = Field(..., pattern="^(en|hi|mr)$")
    pilot_region: str = Field(..., min_length=1)
    trade_of_interest: Optional[str] = None
    district_code: Optional[str] = None
    state_code: Optional[str] = None


class FamilyChatSessionCreateResponse(BaseModel):
    session_id: UUID
    consent_text: dict
    suggested_questions: List[dict]


class FamilyChatConsentGrantRequest(BaseModel):
    kind: str = "session"
    consenter_role: str = Field(..., pattern="^(parent|guardian)$")
    method: str = "typed_confirmation"


class FamilyChatConsentGrantResponse(BaseModel):
    session_token: str
    expires_at: str


class FamilyChatMessageRequest(BaseModel):
    text: str = Field(..., min_length=1)
    language: str = Field(..., pattern="^(en|hi|mr)$")
    speaker_role: str = "parent"


class FamilyChatMessageResponse(BaseModel):
    message_id: UUID
    safety: dict
    concerns: List[dict]
    reply: dict
    evidence_cards: List[dict]
    escalation: dict
    abstention: Optional[dict] = None


class FamilyChatEvidenceRequest(BaseModel):
    topic: str
    trade: Optional[str] = None
    district_code: Optional[str] = None
    state_code: Optional[str] = None
    include_demo: bool = False


class FamilyChatHandoffConsentRequest(BaseModel):
    granted: bool


class FamilyChatHandoffConsentResponse(BaseModel):
    granted: bool


class FamilyChatEndRequest(BaseModel):
    reason: Optional[str] = None


class FamilyChatEndResponse(BaseModel):
    summary: dict


# Suggested questions for parents
SUGGESTED_QUESTIONS = {
    "en": [
        {"id": "job_security", "text": "Will my child get a stable job after ITI?", "topic": "job_security"},
        {"id": "income", "text": "What is the starting salary for ITI graduates?", "topic": "income"},
        {"id": "safety", "text": "Is the workplace safe for electrical trades?", "topic": "safety"},
        {"id": "social_perception", "text": "What will relatives think about ITI vs degree?", "topic": "social_perception"},
        {"id": "degree_foreclosure", "text": "Can my child still do a diploma/degree after ITI?", "topic": "degree_foreclosure"},
    ],
    "hi": [
        {"id": "job_security", "text": "ITI ke baad job milegi kya?", "topic": "job_security"},
        {"id": "income", "text": "ITI ke baad salary kitni hoti hai?", "topic": "income"},
        {"id": "safety", "text": "Electrical trade mein safety kaise hoti hai?", "topic": "safety"},
        {"id": "social_perception", "text": "Log kya kahenge ITI ke baare mein?", "topic": "social_perception"},
        {"id": "degree_foreclosure", "text": "ITI ke baad degree kar sakte hain kya?", "topic": "degree_foreclosure"},
    ],
    "mr": [
        {"id": "job_security", "text": "ITI नंतर नोकरी मिळेल का?", "topic": "job_security"},
        {"id": "income", "text": "ITI नंतर पगार किती असेल?", "topic": "income"},
        {"id": "safety", "text": "इलेक्ट्रिकल ट्रेडमध्ये सुरक्षा कशी आहे?", "topic": "safety"},
        {"id": "social_perception", "text": "लोक ITI बद्दल काय म्हणतील?", "topic": "social_perception"},
        {"id": "degree_foreclosure", "text": "ITI नंतर डिप्लोमा/पदवी शक्य आहे का?", "topic": "degree_foreclosure"},
    ],
}


def get_llm_provider():
    """Create LLM provider based on configuration."""
    settings = get_settings()
    if settings.llm_provider and settings.llm_api_key:
        return create_llm_provider(settings.llm_provider, api_key=settings.llm_api_key, model=settings.llm_model)
    return MockLLMProvider()


@router.post("/consents/start", response_model=FamilyChatSessionCreateResponse)
async def start_family_chat_consent(
    request: FamilyChatSessionCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a pending session and show consent text for family chat."""
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
        "language": request.language,
        "text": get_consent_text(request.language),
        "retention_days": settings.session_retention_days,
    }
    
    return {
        "session_id": str(session.id),
        "consent_text": consent_text,
        "suggested_questions": SUGGESTED_QUESTIONS.get(request.language, SUGGESTED_QUESTIONS["en"]),
    }


def get_consent_text(language: str) -> str:
    """Get consent text in the specified language."""
    texts = {
        "en": "I consent to this AI career guidance chat session. I understand that:\n"
              "• My conversation will be stored for up to 30 days\n"
              "• PATHIQ is an AI assistant, not a human counsellor\n"
              "• Only verified, sourced evidence will be shared\n"
              "• I can withdraw consent and delete my data at any time\n"
              "• Counsellor handoff requires separate consent\n\n"
              "I am the parent/guardian and I agree to proceed.",
        "hi": "मैं इस AI करियर मार्गदर्शन चैट सत्र के लिए सहमति देता/देती हूँ। मुझे समझ है कि:\n"
              "• मेरी बातचीत 30 दिनों तक संग्रहीत की जाएगी\n"
              "• PATHIQ एक AI सहायक है, मानव काउंसलर नहीं\n"
              "• केवल सत्यापित, स्रोत-आधारित साक्ष्य साझा किए जाएंगे\n"
              "• मैं किसी भी समय सहमति वापस ले सकता/सकती हूँ और डेटा हटा सकता/सकती हूँ\n"
              "• काउंसलर हैंडऑफ के लिए अलग सहमति आवश्यक है\n\n"
              "मैं माता-पिता/अभिभावक हूँ और मैं आगे बढ़ने के लिए सहमत हूँ।",
        "mr": "मी हा AI करीयर मार्गदर्शन चॅट सत्र सुरू करण्यासाठी संमती देतो/देते. मला समजते की:\n"
              "• माझी बोलणी 30 दिवसाठे संग्रहित केली जाईल\n"
              "• PATHIQ हा AI सहाय्यक आहे, मानवी काउंसलर नाही\n"
              "• फक्त सत्यापित, स्रोत-आधारित पुरावे शेअर केले जातील\n"
              "• मी कोणत्याही वेळी संमती मागवू शकतो/शकते आणि डेटा डिलीट करू शकतो/शकते\n"
              "• काउंसलर हँडऑफसाठी वेगळी संमती लागेल\n\n"
              "मी पालक/अभिभावक आहे आणि मी प्रगती करण्यासाठी सहमत आहे.",
    }
    return texts.get(language, texts["en"])


@router.post("/consents/{session_id}/grant", response_model=FamilyChatConsentGrantResponse)
async def grant_family_chat_consent(
    session_id: str,
    request: FamilyChatConsentGrantRequest,
    db: AsyncSession = Depends(get_db),
):
    """Grant consent for a family chat session."""
    from app.models import Session, Consent
    import jwt
    from datetime import datetime, timedelta
    
    session_service = SessionService(db)
    
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    consent = await SessionService(db).record_consent(
        session_id=session_id,
        kind=request.kind,
        consenter_role=request.consenter_role,
        method=request.method,
        language_shown=session.language,
        version_of_text="v1",
        granted=True,
    )
    
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


@router.post("/consents/{session_id}/handoff-consent", response_model=FamilyChatHandoffConsentResponse)
async def grant_handoff_consent(
    session_id: str,
    request: FamilyChatHandoffConsentRequest,
    db: AsyncSession = Depends(get_db),
):
    """Grant consent for counsellor handoff."""
    from app.models import Consent, ConsentKindEnum
    from uuid import UUID
    
    consent = Consent(
        session_id=UUID(session_id),
        kind=ConsentKindEnum.counsellor_handoff,
        granted=request.granted,
        consenter_role="parent",
        method="typed_confirmation",
        language_shown="en",
        version_of_text="v1",
    )
    db.add(consent)
    await db.flush()
    
    return {"granted": request.granted}


@router.post("/sessions/{session_id}/messages", response_model=FamilyChatMessageResponse)
async def add_family_chat_message(
    session_id: str,
    request: FamilyChatMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    """Add a message to a family chat session and generate AI response."""
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
    
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not await SessionService(db).get_consent_status(session_id, "session"):
        raise HTTPException(status_code=403, detail="Session consent not granted")
    
    message_service = MessageService(db)
    message = await message_service.add_message(
        session_id=session_id,
        speaker_role=request.speaker_role,
        text=request.text,
        language=request.language,
    )
    
    concern_service = ConcernService(db)
    concern_detector = ConcernDetector()
    retrieval_service = RetrievalService(db)
    abstention_engine = AbstentionEngine()
    grounding_validator = GroundingValidator()
    number_validator = NumberValidator()
    llm_provider = get_llm_provider()
    
    concerns_detected = []
    reply = {"kind": "answer", "text": "", "evidence_cards": []}
    escalation = {"suggested": False, "reason": None}
    safety = {"distress": False}
    abstention = None
    evidence_cards = []
    
    distress_keywords = [
        "suicide", "kill myself", "kill me", "end my life", "hurt myself",
        "self harm", "suicide", "marna", "marna chahta", "marna chahti",
        "आत्महत्या", "मारू इच्छा", "जीव संपवायचा",
    ]
    text_lower = request.text.lower()
    distress_detected = any(kw in text_lower for kw in distress_keywords)
    
    if distress_detected:
        safety["distress"] = True
        await MessageService(db).flag_distress(str(message.id))
        
        return {
            "message_id": str(message.id),
            "safety": safety,
            "concerns": [],
            "reply": {
                "kind": "distress",
                "text": get_distress_message(request.language),
                "evidence_cards": []
            },
            "escalation": {"suggested": True, "reason": "distress"},
            "evidence_cards": [],
            "abstention": None
        }
    
    if request.speaker_role == "parent":
        concerns_detected = concern_detector.detect(request.text, request.language)
        
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
        
        if concerns_response and any(c["confidence"] >= 0.70 for c in concerns_response):
            primary_concern = max(
                [c for c in concerns_detected if c["concern"] != "none"],
                key=lambda x: x["confidence"],
                default=None
            )
            
            if primary_concern:
                concern_to_topic = {
                    "job_security": "job_security",
                    "income": "income",
                    "social_perception": "social_perception",
                    "safety": "safety",
                    "degree_foreclosure": "degree_foreclosure",
                }
                
                topic = concern_to_topic.get(primary_concern["concern"], "job_security")
                
                retrieval_query = RetrievalQuery(
                    topic=topic,
                    trade=session.trade_of_interest,
                    district_code=session.district_code if hasattr(session, 'district_code') else None,
                    state_code=session.state_code if hasattr(session, 'state_code') else None,
                    top_k=3,
                    include_demo=False,
                )
                
                retrieval_result = await retrieval_service.retrieve(retrieval_query)
                
                evidence_cards = []
                for record_obj in retrieval_result.records:
                    source_obj = Source(
                        id=record_obj.source_id if hasattr(record_obj, 'source_id') else uuid4(),
                        title=record_obj.source_title,
                        authority=record_obj.source_authority,
                        source_type=record_obj.source_type,
                        published_date=record_obj.published_date,
                    )
                    evidence_card = EvidenceCardBuilder.build_evidence_card(
                        record=KnowledgeRecord(
                            id=record_obj.id,
                            claim=record_obj.claim,
                            value=record_obj.value,
                            source_id=source_obj.id,
                            geography_level=record_obj.geography_level,
                            geography_code=record_obj.geography_code,
                            applicability=record_obj.applicability,
                            verified_date=record_obj.verified_date,
                            status=record_obj.status,
                            is_demo=record_obj.is_demo,
                        ),
                        source=source_obj,
                        geography_level=record_obj.geography_level,
                    )
                    evidence_cards.append(evidence_card)
                
                abstention_result = AbstentionEngine().check_abstention(
                    question=request.text,
                    retrieval_result=retrieval_result,
                    evidence_cards=evidence_cards,
                )
                
                if abstention_result.should_abstain:
                    abstention = {
                        "reason": abstention_result.reason.value,
                        "details": abstention_result.details,
                        "next_action": abstention_result.next_action,
                    }
                    reply = {
                        "kind": "abstain",
                        "text": abstention_result._get_abstention_message(abstention_result.reason, abstention_result.details) if hasattr(abstention_result, '_get_abstention_message') else "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?",
                        "evidence_cards": [card.model_dump() if hasattr(card, 'model_dump') else card for card in evidence_cards]
                    }
                    escalation = {"suggested": True, "reason": abstention_result.reason.value}
                else:
                    prompt = build_llm_prompt(request.text, evidence_cards, request.language)
                    llm_response = await llm_provider.generate(prompt)
                    
                    grounding_result = grounding_validator.validate(llm_response.text, evidence_cards)
                    number_result = number_validator.validate(llm_response.text, evidence_cards)
                    
                    if not grounding_result.valid or not number_result.valid:
                        reply = {
                            "kind": "abstain",
                            "text": "I couldn't verify the answer against the evidence. Would you like to talk to a counsellor?",
                            "evidence_cards": [card.model_dump() if hasattr(card, 'model_dump') else card for card in evidence_cards]
                        }
                        escalation = {"suggested": True, "reason": "grounding_failed"}
                    else:
                        evidence_cards_dict = [card.model_dump() if hasattr(card, 'model_dump') else card for card in evidence_cards]
                        reply = {
                            "kind": "answer",
                            "text": llm_response.text,
                            "evidence_cards": evidence_cards_dict
                        }
    
    return {
        "message_id": str(message.id),
        "safety": safety,
        "concerns": concerns_response,
        "reply": reply,
        "evidence_cards": evidence_cards if 'evidence_cards' in locals() else [],
        "escalation": escalation,
        "abstention": abstention
    }


def get_distress_message(language: str) -> str:
    """Get distress response message in the specified language."""
    messages = {
        "en": "I'm concerned about what you shared. I'm connecting you with a person who can help, and here is a helpline you can contact now.",
        "hi": "मुझे आपकी बात से चिंता हुई है। मैं आपको किसी ऐसे व्यक्ति से जोड़ रहा हूँ जो मदद कर सकता है, और यहाँ एक हेल्पलाइन है जिससे आप अभी संपर्क कर सकते हैं।",
        "mr": "तुम्ही सांगितल्याने मला चिंता झाली आहे. मी तुम्हाला कोणत्याही मदतीसाठी एक व्यक्तीशी जोडत आहे, आणि यथे एक हेल्पलाइन आहे ज्याशी तुम्ही आता संपर्क करू शकता.",
    }
    return messages.get(language, messages["en"])


def build_llm_prompt(question: str, evidence_cards: list, language: str) -> str:
    """Build prompt for LLM with evidence cards."""
    language_names = {"en": "English", "hi": "Hindi", "mr": "Marathi"}
    lang_name = language_names.get(language, "English")
    
    evidence_text = ""
    for card in evidence_cards:
        if hasattr(card, 'record_id'):
            evidence_text += f"[rec:{card.record_id}] {card.claim}\n"
        elif isinstance(card, dict) and 'record_id' in card:
            evidence_text += f"[rec:{card['record_id']}] {card.get('claim', '')}\n"
    
    return f"""Question: {question}
Language: {lang_name}

Evidence:
{evidence_text}

Instructions:
- Answer based ONLY on the evidence above
- Cite record IDs like [rec:ID] for every factual claim
- If evidence is insufficient, say so clearly
- Do not add facts not in evidence
- Be warm and supportive but precise
- Use {lang_name} for the response"""


@router.post("/sessions/{session_id}/end", response_model=FamilyChatEndResponse)
async def end_family_chat_session(
    session_id: str,
    request: FamilyChatEndRequest,
    db: AsyncSession = Depends(get_db),
):
    """End a family chat session and generate summary."""
    from uuid import UUID
    from app.models import Session
    from app.services.session import SessionService, MessageService
    from app.services.concern import ConcernService
    
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.status = SessionStatusEnum.closed
    await db.flush()
    
    message_service = MessageService(db)
    messages = await message_service.get_messages(session_id, limit=100)
    
    concern_service = ConcernService(db)
    concerns = await concern_service.get_session_concerns(session_id)
    
    summary = {
        "session_id": session_id,
        "ended_at": datetime.utcnow().isoformat(),
        "total_messages": len(messages),
        "total_concerns": len(concerns),
        "concerns_by_label": {},
        "languages_used": list(set(m.language for m in messages)),
    }
    
    for concern in concerns:
        label = concern.label.value if hasattr(concern.label, 'value') else str(concern.label)
        summary["concerns_by_label"][label] = summary["concerns_by_label"].get(label, 0) + 1
    
    return {"summary": summary}


@router.get("/sessions/{session_id}/messages")
async def get_family_chat_messages(
    session_id: str,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    """Get messages for a family chat session."""
    from uuid import UUID
    from app.models import Session, Message
    from app.services.session import MessageService
    
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    message_service = MessageService(db)
    messages = await message_service.get_messages(session_id, limit=limit, offset=offset)
    
    return {
        "messages": [
            {
                "id": str(m.id),
                "speaker_role": m.speaker_role.value if hasattr(m.speaker_role, 'value') else str(m.speaker_role),
                "text": m.text,
                "language": m.language,
                "created_at": m.created_at.isoformat() if m.created_at else None,
                "safety_flag": m.safety_flag.value if hasattr(m.safety_flag, 'value') else str(m.safety_flag),
            }
            for m in messages
        ]
    }


@router.get("/sessions/{session_id}/evidence", response_model=EvidenceCardResponse)
async def get_family_chat_evidence(
    session_id: str,
    topic: str,
    trade: Optional[str] = None,
    district_code: Optional[str] = None,
    state_code: Optional[str] = None,
    include_demo: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """Get evidence cards for a topic."""
    from uuid import UUID
    from app.models import Session
    
    session = await db.get(Session, UUID(session_id))
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    retrieval_service = RetrievalService(db)
    query = RetrievalQuery(
        topic=topic,
        trade=trade or session.trade_of_interest,
        district_code=district_code,
        state_code=state_code,
        top_k=3,
        include_demo=include_demo,
    )
    
    result = await retrieval_service.retrieve(query)
    
    cards = []
    for record_obj in result.records:
        source_obj = Source(
            id=uuid4(),
            title=record_obj.source_title,
            authority=record_obj.source_authority,
            source_type=record_obj.source_type,
            published_date=record_obj.published_date,
        )
        evidence_card = EvidenceCardBuilder.build_evidence_card(
            record=KnowledgeRecord(
                id=record_obj.id,
                claim=record_obj.claim,
                value=record_obj.value,
                source_id=source_obj.id,
                geography_level=record_obj.geography_level,
                geography_code=record_obj.geography_code,
                applicability=record_obj.applicability,
                verified_date=record_obj.verified_date,
                status=record_obj.status,
                is_demo=record_obj.is_demo,
            ),
            source=source_obj,
            geography_level=record_obj.geography_level,
        )
        cards.append(evidence_card)
    
    return {
        "cards": cards,
        "geography_used": result.geography_used,
        "abstained": result.abstained,
        "reason": result.reason,
    }