from dataclasses import dataclass
from enum import Enum
from typing import List, Optional
from uuid import UUID

from app.models.knowledge import RecordStatusEnum
from app.schemas.knowledge import EvidenceCard, RetrievalResult


class AbstentionReason(str, Enum):
    """Reasons for abstention."""
    NO_EVIDENCE = "no_evidence"
    ALL_EVIDENCE_EXPIRED = "all_evidence_expired"
    CONFLICTING_EVIDENCE = "conflicting_evidence"
    OUTSIDE_KNOWLEDGE_BASE = "outside_knowledge_base"
    MISSING_ELIGIBILITY = "missing_eligibility"
    GEOGRAPHY_UNAVAILABLE = "geography_unavailable"
    PROVENANCE_INVALID = "provenance_invalid"
    GROUNDING_FAILED = "grounding_failed"
    NUMBER_VALIDATION_FAILED = "number_validation_failed"
    UNSUPPORTED_INFERENCE = "unsupported_inference"


@dataclass
class AbstentionResult:
    """Result of abstention check."""
    should_abstain: bool
    reason: Optional[AbstentionReason] = None
    details: str = ""
    available_evidence: List[dict] = None
    next_action: str = "counsellor"

    def __post_init__(self):
        if self.available_evidence is None:
            self.available_evidence = []


class AbstentionEngine:
    """
    Determines whether PATHIQ has enough trustworthy evidence to answer.
    
    This is the core abstention engine that implements the M2 abstention logic.
    """

    def __init__(self):
        pass

    def check_abstention(
        self,
        question: str,
        retrieval_result: "RetrievalResult",
        evidence_cards: list,
    ) -> AbstentionResult:
        """
        Check if the system should abstain from answering.
        
        Args:
            question: The user's question
            retrieval_result: Result from the retrieval service
            evidence_cards: List of EvidenceCard objects
            
        Returns:
            AbstentionResult with should_abstain and reason
        """
        # Check 1: No evidence at all
        if not evidence_cards:
            return AbstentionResult(
                should_abstain=True,
                reason=AbstentionReason.NO_EVIDENCE,
                details="No verified evidence found for this question.",
                next_action="counsellor",
            )

        # Check 2: All evidence is expired (should not happen if retriever filters correctly)
        expired_count = sum(1 for c in evidence_cards if c.is_demo)
        if expired_count == len(evidence_cards) and not any(not c.is_demo for c in evidence_cards):
            return AbstentionResult(
                should_abstain=True,
                reason=AbstentionReason.ALL_EVIDENCE_EXPIRED,
                details="All available evidence is demo/illustrative data.",
                next_action="counsellor",
            )

        # Check 3: Conflicting evidence (same topic, different claims)
        if self._has_conflicting_evidence(evidence_cards):
            return AbstentionResult(
                should_abstain=True,
                reason=AbstentionReason.CONFLICTING_EVIDENCE,
                details="Conflicting verified evidence found for this topic.",
                next_action="counsellor",
            )

        # Check 4: Geography unavailable (only national/demo evidence for local question)
        if self._geography_insufficient(evidence_cards):
            return AbstentionResult(
                should_abstain=True,
                reason=AbstentionReason.GEOGRAPHY_UNAVAILABLE,
                details="No local or state-level verified evidence available.",
                next_action="counsellor",
            )

        # Check 5: Demo-only evidence
        if all(card.is_demo for card in evidence_cards):
            return AbstentionResult(
                should_abstain=True,
                reason=AbstentionReason.OUTSIDE_KNOWLEDGE_BASE,
                details="Only demo/illustrative evidence available. No verified records found.",
                next_action="counsellor",
            )

        # If we reach here, we have sufficient evidence
        return AbstentionResult(
            should_abstain=False,
            details="Sufficient verified evidence available.",
        )

    def _has_conflicting_evidence(self, evidence_cards: List["EvidenceCard"]) -> bool:
        """Check if evidence cards contain conflicting claims for the same topic."""
        # Group by topic and check for conflicting claims
        # This is a simplified check - in production, would need more sophisticated comparison
        claims_by_topic = {}
        for card in evidence_cards:
            # We don't have topic directly on EvidenceCard, would need to track it
            # For now, return False - would need topic info on cards
            pass
        return False

    def _geography_insufficient(self, evidence_cards: List["EvidenceCard"]) -> bool:
        """Check if evidence geography is insufficient for the question."""
        # If all evidence is national-level and the question asks for local info
        # This would need context about the question's geography intent
        # For now, return False
        return False

    def check_provenance(self, evidence_cards: list) -> AbstentionResult:
        """Check if evidence provenance is valid."""
        for card in evidence_cards:
            if not card.source.title or not card.source.authority:
                return AbstentionResult(
                    should_abstain=True,
                    reason=AbstentionReason.PROVENANCE_INVALID,
                    details=f"Evidence card {card.record_id} has invalid provenance.",
                )
        return AbstentionResult(should_abstain=False)

    def create_abstention_response(
        self,
        reason: AbstentionReason,
        details: str,
        available_evidence: list = None,
    ) -> dict:
        """Create a structured abstention response for the API."""
        return {
            "status": "abstain",
            "reason": reason.value,
            "message": self._get_abstention_message(reason, details),
            "available_evidence": available_evidence or [],
            "next_action": "counsellor",
        }

    def _get_abstention_message(self, reason: AbstentionReason, details: str) -> str:
        """Get human-readable abstention message."""
        messages = {
            AbstentionReason.NO_EVIDENCE: "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?",
            AbstentionReason.ALL_EVIDENCE_EXPIRED: "The available evidence has expired. I can't provide current information. Would you like to talk to a counsellor?",
            AbstentionReason.CONFLICTING_EVIDENCE: "I found conflicting verified information. I can't determine which is correct. Would you like to talk to a counsellor?",
            AbstentionReason.GEOGRAPHY_UNAVAILABLE: "I don't have local verified data for this. Would you like to talk to a counsellor?",
            AbstentionReason.OUTSIDE_KNOWLEDGE_BASE: "This question is outside my verified knowledge base. Would you like to talk to a counsellor?",
            AbstentionReason.MISSING_ELIGIBILITY: "I don't have enough information about eligibility requirements. Would you like to talk to a counsellor?",
            AbstentionReason.PROVENANCE_INVALID: "The evidence source information is incomplete. Would you like to talk to a counsellor?",
            AbstentionReason.GROUNDING_FAILED: "I couldn't verify the answer against the evidence. Would you like to talk to a counsellor?",
            AbstentionReason.NUMBER_VALIDATION_FAILED: "I found numbers in the answer that aren't supported by the evidence. Would you like to talk to a counsellor?",
            AbstentionReason.UNSUPPORTED_INFERENCE: "The question requires inference beyond the verified evidence. Would you like to talk to a counsellor?",
        }
        return messages.get(reason, "I couldn't verify this from the approved sources, so I won't guess. Would you like to talk to a counsellor?")