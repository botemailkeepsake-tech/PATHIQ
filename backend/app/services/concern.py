from dataclasses import dataclass
from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4

from app.core.config import get_settings
from app.models.session import ConcernLabelEnum, ConcernStatusEnum, SpeakerRoleEnum


class ConcernLabel(str, Enum):
    """Canonical concern taxonomy - must match ConcernLabelEnum in models."""
    JOB_SECURITY = "job_security"
    INCOME = "income"
    SOCIAL_PERCEPTION = "social_perception"
    SAFETY = "safety"
    DEGREE_FORECLOSURE = "degree_foreclosure"
    NONE = "none"


CONCERN_KEYWORDS = {
    "job_security": [
        "job", "employment", "work", "company", "factory", "closure", "closure",
        "layoff", "layoffs", "unemployment", "jobless", "employment", "stable",
        "stability", "career", "future", "company", "factory", "shut", "close",
        "band", "bandh", "naukri", "kaam", "rozgar", "company band", "factory band",
    ],
    "income": [
        "income", "salary", "salary", "pay", "wage", "earning", "earnings",
        "money", "rupees", "salary", "enough", "sufficient", "afford",
        "house", "family", "support", "salary badh", "salary kam", "paisa",
        "salary kitna", "earn", "earning", "mehengai", "expense", "kharcha",
    ],
    "social_perception": [
        "relative", "relatives", "family", "community", "society", "log",
        "rishtedar", "samaj", "log kya kahenge", "kya kahenge", "prestige",
        "status", "respect", "izzat", "shame", "sharam", "community", "society",
        "log kya sochenge", "log kya kahenge", "rishtedar kya kahenge",
    ],
    "safety": [
        "safe", "safety", "danger", "dangerous", "risk", "risky", "hazard",
        "hazardous", "injury", "injured", "hurt", "accident", "accident",
        "night shift", "night shift", "shift", "travel", "commute", "site",
        "factory", "electric", "electricity", "ladki", "girl", "daughter",
        "beti", "girls", "women", "woman", "female", "ladki", "night",
    ],
    "degree_foreclosure": [
        "degree", "b.tech", "btech", "engineering", "graduation", "graduation",
        "college", "university", "further study", "higher study", "further",
        "higher", "diploma", "diploma", "b.tech", "btech", "engineering",
        "college", "university", "graduation", "degree", "age", "age limit",
        "age limit", "age", "cutoff", "cut off", "cut-off", "door closed",
        "door band", "door", "band", "closed", "band", "foreclosure",
        "diploma kar", "degree kar", "btech kar", "engineering kar",
    ],
    "none": [
        "happy", "good", "fine", "okay", "ok", "satisfied", "whatever",
        "anything", "any", "don't care", "dont care", "indifferent",
        "khush", "theek", "achha", "theek hai", "koi problem nahi",
    ],
}


CONCERN_TO_TOPIC = {
    "job_security": "job_security",
    "income": "income",
    "social_perception": "social_perception",
    "safety": "safety",
    "degree_foreclosure": "degree_foreclosure",
    "none": None,
}


@dataclass
class ConcernDetectionResult:
    """Result of concern detection."""
    concern: str
    confidence: float
    needs_confirmation: bool
    matched_keywords: List[str]


class ConcernDetector:
    """Detects parent concerns from messages using keyword-based classification."""

    def __init__(self):
        self.settings = get_settings()
        self.threshold = self.settings.concern_confirm_threshold

    def detect(self, text: str, language: str = "en") -> List[dict]:
        """
        Detect concerns from text.
        
        Args:
            text: The input text to analyze
            language: Language code (en, hi, hinglish)
            
        Returns:
            List of detected concerns with confidence scores
        """
        text_lower = text.lower()
        results = []

        concern_keywords = {
            "job_security": [
                "job", "employment", "work", "company", "factory", "closure",
                "layoff", "layoffs", "unemployment", "jobless", "employment", "stable",
                "stability", "career", "future", "company", "factory", "shut", "close",
                "band", "bandh", "naukri", "kaam", "rozgar", "company band", "factory band",
            ],
            "income": [
                "income", "salary", "salary", "pay", "wage", "earning", "earnings",
                "money", "rupees", "salary", "enough", "sufficient", "afford",
                "house", "family", "support", "salary badh", "salary kam", "paisa",
                "salary kitna", "earn", "earning", "mehengai", "expense", "kharcha",
            ],
            "social_perception": [
                "relative", "relatives", "family", "community", "society", "log",
                "rishtedar", "samaj", "log kya kahenge", "kya kahenge", "prestige",
                "status", "respect", "izzat", "shame", "sharam", "community", "society",
                "log kya sochenge", "log kya kahenge", "rishtedar kya kahenge",
            ],
            "safety": [
                "safe", "safety", "danger", "dangerous", "risk", "risky", "hazard",
                "hazardous", "injury", "injured", "hurt", "accident", "accident",
                "night shift", "night shift", "shift", "travel", "commute", "site",
                "factory", "electric", "electricity", "ladki", "girl", "daughter",
                "beti", "girls", "women", "woman", "female", "ladki", "night",
            ],
            "degree_foreclosure": [
                "degree", "b.tech", "btech", "engineering", "graduation", "graduation",
                "college", "university", "further study", "higher study", "further",
                "higher", "diploma", "diploma", "b.tech", "btech", "engineering",
                "college", "university", "graduation", "degree", "age", "age limit",
                "age limit", "age", "cutoff", "cut off", "cut-off", "door closed",
                "door band", "door", "band", "closed", "band", "foreclosure",
                "diploma kar", "degree kar", "btech kar", "engineering kar",
            ],
            "none": [
                "happy", "good", "fine", "okay", "ok", "satisfied", "whatever",
                "anything", "any", "don't care", "dont care", "indifferent",
                "khush", "theek", "achha", "theek hai", "koi problem nahi",
            ],
        }

        concern_keywords = {
            "job_security": [
                "job", "employment", "work", "company", "factory", "closure",
                "layoff", "layoffs", "unemployment", "jobless", "employment", "stable",
                "stability", "career", "future", "company", "factory", "shut", "close",
                "band", "bandh", "naukri", "kaam", "rozgar", "company band", "factory band",
            ],
            "income": [
                "income", "salary", "salary", "pay", "wage", "earning", "earnings",
                "money", "rupees", "salary", "enough", "sufficient", "afford",
                "house", "family", "support", "salary badh", "salary kam", "paisa",
                "salary kitna", "earn", "earning", "mehengai", "expense", "kharcha",
            ],
            "social_perception": [
                "relative", "relatives", "family", "community", "society", "log",
                "rishtedar", "samaj", "log kya kahenge", "kya kahenge", "prestige",
                "status", "respect", "izzat", "shame", "sharam", "community", "society",
                "log kya sochenge", "log kya kahenge", "rishtedar kya kahenge",
            ],
            "safety": [
                "safe", "safety", "danger", "dangerous", "risk", "risky", "hazard",
                "hazardous", "injury", "injured", "hurt", "accident", "accident",
                "night shift", "night shift", "shift", "travel", "commute", "site",
                "factory", "electric", "electricity", "ladki", "girl", "daughter",
                "beti", "girls", "women", "woman", "female", "ladki", "night",
            ],
            "degree_foreclosure": [
                "degree", "b.tech", "btech", "engineering", "graduation", "graduation",
                "college", "university", "further study", "higher study", "further",
                "higher", "diploma", "diploma", "b.tech", "btech", "engineering",
                "college", "university", "graduation", "degree", "age", "age limit",
                "age limit", "age", "cutoff", "cut off", "cut-off", "door closed",
                "door band", "door", "band", "closed", "band", "foreclosure",
                "diploma kar", "degree kar", "btech kar", "engineering kar",
            ],
            "none": [
                "happy", "good", "fine", "okay", "ok", "satisfied", "whatever",
                "anything", "any", "don't care", "dont care", "indifferent",
                "khush", "theek", "achha", "theek hai", "koi problem nahi",
            ],
        }

        text_lower = text.lower()
        results = []

        for concern_label, keywords in concern_keywords.items():
            if concern_label == "none":
                continue
                
            matched = [kw for kw in keywords if kw.lower() in text_lower]
            if matched:
                # Simple scoring: more keyword matches = higher confidence
                confidence = min(len(matched) / max(len(keywords), 1), 1.0)
                
                # Boost for multiple matches
                if len(matched) > 1:
                    confidence = min(confidence * 1.2, 1.0)
                    
                # Check for ambiguous/uncertain language
                if any(word in text_lower for word in ["maybe", "perhaps", "might", "could", "unsure", "not sure", "shayad", "kya pata"]):
                    confidence *= 0.8

                needs_confirmation = confidence < 0.70
                
                results.append({
                    "concern": concern,
                    "confidence": round(confidence, 2),
                    "needs_confirmation": needs_confirmation,
                    "matched_keywords": matched,
                })

        # Sort by confidence descending
        results.sort(key=lambda x: x["confidence"], reverse=True)
        
        # If no concerns detected, return none
        if not results:
            return [{
                "concern": "none",
                "confidence": 1.0,
                "needs_confirmation": False,
                "matched_keywords": [],
            }]

        return results

    def get_confirmation_prompt(self, concern: str, language: str = "en") -> str:
        """Generate confirmation prompt for low-confidence detection."""
        concern_names = {
            "job_security": "job security",
            "income": "income",
            "social_perception": "what others think",
            "safety": "safety",
            "degree_foreclosure": "future education options",
        }
        
        concern_name = concern_names.get(concern, concern)
        
        prompts = {
            "en": f"It sounds like your main concern is {concern_name}. Is that right?",
            "hi": f"Lagta hai aapki main chinta {concern_name} hai. Kya ye sahi hai?",
        }
        
        return prompts.get(language, prompts["en"])


class ConcernService:
    """Service for managing concerns in a session."""

    def __init__(self, db):
        self.db = db

    async def create_concern(
        self,
        session_id: str,
        message_id: Optional[str],
        label: str,
        confidence: float,
        confirmed: Optional[bool] = None,
    ):
        """Create a new concern record."""
        from app.models import Concern
        from app.models.session import ConcernStatusEnum
        from uuid import UUID

        concern = Concern(
            session_id=UUID(session_id),
            message_id=UUID(message_id) if message_id else None,
            label=label,
            confidence=confidence,
            confirmed=confirmed,
            status="open",
        )
        self.db.add(concern)
        await self.db.flush()
        return concern

    async def confirm_concern(self, concern_id: str, confirmed: bool, corrected_label: Optional[str] = None):
        """Confirm or correct a concern."""
        from app.models import Concern, ConcernCorrection
        from uuid import UUID

        stmt = select(Concern).where(Concern.id == UUID(concern_id))
        result = await self.db.execute(stmt)
        concern = result.scalar_one_or_none()
        
        if not concern:
            return None

        if confirmed:
            concern.confirmed = True
        else:
            concern.confirmed = False
            if corrected_label:
                # Log the correction
                correction = ConcernCorrection(
                    concern_id=UUID(concern_id),
                    original_label=concern.label,
                    corrected_label=corrected_label,
                )
                self.db.add(correction)
                concern.label = corrected_label
                concern.confirmed = True  # Now confirmed with corrected label

        await self.db.flush()
        return concern

    async def update_concern_status(self, concern_id: str, status: str):
        """Update concern status (open, partly_resolved, resolved)."""
        from app.models import Concern
        from uuid import UUID

        stmt = select(Concern).where(Concern.id == UUID(concern_id))
        result = await self.db.execute(stmt)
        concern = result.scalar_one_or_none()
        
        if concern:
            concern.status = status
            await self.db.flush()
        return concern

    async def get_session_concerns(self, session_id: str):
        """Get all concerns for a session."""
        from app.models import Concern
        from uuid import UUID

        stmt = select(Concern).where(Concern.session_id == UUID(session_id))
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_concern(self, concern_id: str):
        """Get a specific concern."""
        from app.models import Concern
        from uuid import UUID

        stmt = select(Concern).where(Concern.id == UUID(concern_id))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()