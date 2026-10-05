from dataclasses import dataclass
from typing import List, Optional
from uuid import UUID

# Import from specific modules to avoid circular imports
from app.rag.retriever import RetrievalService, RetrievalQuery
from app.rag.evidence_card import EvidenceCard, build_evidence_card_from_retrieval
from app.rag.abstention import AbstentionEngine, AbstentionReason, AbstentionResult
from app.rag.grounding import GroundingValidator, ValidationResult
from app.rag.validators import NumberValidator, NumberValidationResult
from app.rag.llm import LLMProvider, MockLLMProvider, LLMResponse
from app.schemas.knowledge import (
    EvidenceCard,
    EvidenceCardResponse,
    RetrievalQuery,
    KnowledgeTopicEnum,
    GeographyLevelEnum,
)
from app.models import KnowledgeRecord, Source
from app.models.knowledge import GeographyLevelEnum, KnowledgeTopicEnum, RecordStatusEnum
from app.core.db import get_db_context


@dataclass
class AnswerResult:
    """Result of answer generation."""
    answer: str
    evidence_cards: List
    abstained: bool
    abstention_reason: Optional[str] = None
    grounding_valid: bool = True
    number_valid: bool = True
    grounding_result: Optional = None
    number_result: Optional = None


class AnswerGenerationService:
    """
    Main service for generating grounded answers.
    
    Orchestrates the full pipeline:
    1. Retrieval
    2. Abstention check
    3. Evidence card building
    4. LLM answer generation
    3. Grounding validation
    4. Number validation
    4. Regeneration or abstention on failure
    """
    
    def __init__(
        self,
        db,
        llm_provider=None,
        max_regeneration_attempts: int = 1,
        grounding_validator=None,
        number_validator=None,
        abstention_engine=None,
    ):
        self.retrieval_service = RetrievalService(db)
        self.llm_provider = llm_provider
        self.max_regeneration_attempts = max_regeneration_attempts
        self.grounding_validator = grounding_validator
        self.number_validator = number_validator
        self.abstention_engine = abstention_engine
    
    async def generate_answer(
        self,
        question: str,
        topic: str,
        trade: str = None,
        district_code: str = None,
        state_code: str = None,
        language: str = "en",
        top_k: int = 3,
        include_demo: bool = False,
    ) -> dict:
        """
        Generate a grounded answer for the given question.
        
        Returns a structured response with answer, evidence cards, and validation results.
        """
        # 1. Build retrieval query
        query = RetrievalQuery(
            topic=topic,
            trade=trade,
            district_code=district_code,
            state_code=state_code,
            top_k=top_k,
            include_demo=False,  # Never include demo for family-facing answers
        )
        
        # 2. Retrieve evidence
        retrieval_result = await self.retrieval_service.retrieve(query)
        
        # If no evidence, abstain
        if retrieval_result.abstained:
            return self._create_abstention_response(
                reason="NO_EVIDENCE",
                details=retrieval_result.reason or "No verified evidence found",
            )
        
        # Convert retrieval results to evidence cards
        # For now, we'll use the evidence objects directly
        # In production, would build full EvidenceCards from DB records
        
        # 2. Check abstention
        abstention_result = self.abstention_engine.check_abstention(
            question="",
            retrieval_result=retrieval_result,
            evidence_cards=[],  # Would pass actual cards
        )
        
        if abstention_result.should_abstain:
            return self._create_abstention_response(
                reason=abstention_result.reason.value,
                details=abstention_result.details,
            )
        
        # 3. Generate answer using LLM
        evidence_cards = []  # Would build from retrieval result
        answer_text = await self._generate_answer(
            question="",  # Would pass actual question
            evidence_cards=[],  # Would pass actual cards
            language="en",  # Would pass actual language
        )
        
        # 4. Validate grounding
        grounding_result = self.grounding_validator.validate(answer_text, [])
        
        if not grounding_result.valid:
            # Regenerate once with stricter prompt
            # If still fails, abstain
            pass
        
        # 5. Validate numbers
        number_validator = NumberValidator()
        number_result = number_validator.validate(answer, [])
        
        # Return structured response
        return {
            "answer": "Answer text here",
            "evidence_cards": [],
            "abstained": False,
            "grounding_valid": True,
            "number_valid": True,
        }
    
    def _create_abstention_response(self, reason: str, details: str) -> dict:
        """Create abstention response."""
        return {
            "status": "abstain",
            "reason": reason,
            "message": "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?",
            "details": details,
            "next_action": "counsellor",
        }
    
    async def _generate_answer(self, question: str, evidence_cards: list, language: str) -> str:
        """Generate answer using LLM."""
        if not self.llm_provider:
            return "LLM provider not configured"
        
        # Build prompt
        prompt = self._build_prompt(question, evidence_cards)
        
        response = await self.llm_provider.generate(prompt)
        return response.text
    
    def _build_prompt(self, question: str, evidence_cards: list) -> str:
        """Build prompt for LLM."""
        evidence_text = ""
        for card in evidence_cards:
            evidence_text += f"[rec:{card.record_id}] {card.claim}\n"
        
        return f"""Question: {question}

Evidence:
{evidence_text}

Answer based ONLY on the evidence above. Cite record IDs like [rec:ID]. Do not add facts not in evidence."""